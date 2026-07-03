import os
import io
import json
import asyncio
from fastapi import APIRouter, Form, File, UploadFile
from typing import List, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv
from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()  # habilita Pillow para abrir HEIC/HEIF (fotos nativas de iPhone)
except ImportError:
    print("[chatbot] pillow-heif no instalado — fotos HEIC/HEIF de iPhone podrían fallar")

load_dotenv()

router = APIRouter(prefix="/api", tags=["chatbot"])

# ── Configuración de procesamiento de imágenes ──────────────────
MAX_DIMENSION  = 1024   # px — lado mayor máximo antes de enviar a Gemini
JPEG_QUALITY   = 85     # calidad JPEG de salida
GEMINI_TIMEOUT = 8.0    # segundos antes de pasar al respaldo
RETRY_DELAY    = 0.5    # segundos entre reintentos (texto e imagen)
MAX_REINTENTOS = 2
HISTORIAL_MAX  = 10     # turnos de historial enviados a Gemini
# ────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """Eres el asistente virtual de "Servicio a tu Mano", empresa de limpieza profesional a vapor.
Tu objetivo es orientar clientes, responder dudas, COTIZAR servicios con precios concretos y analizar manchas en fotos.

═══════════════════════════════════════════
DATOS DE LA EMPRESA
═══════════════════════════════════════════
- Propietarios: Juan Pablo Villamil Guzmán (321 219 6255) y Sandra Milena Mora González (312 527 6445)
- Zona de atención: Alrededores de Cundinamarca — servicio a domicilio (Mosquera, Madrid, Funza y municipios cercanos)
- Horario: Lunes a sábado, 7:00 a.m. – 6:00 p.m. (casos especiales se coordinan)
- Formas de pago: efectivo, transferencia, Nequi / Daviplata
- Garantía: si el cliente no queda satisfecho, revisamos sin costo adicional

═══════════════════════════════════════════
SERVICIOS Y PRECIOS (COP – 2025)
═══════════════════════════════════════════

1. VAPOR DE MUEBLES Y SOFÁS
   - Silla individual:           $25,000 – $50,000
   - Sillón / Poltrona:          $40,000 – $80,000
   - Sofá 2 puestos:             $65,000 – $120,000
   - Sofá 3 puestos:             $90,000 – $160,000
   - Sofá esquinero / L:        $150,000 – $260,000
   - Sillas de comedor (c/u):    $20,000 – $40,000

2. LIMPIEZA DE COLCHONES A VAPOR
   - Colchón sencillo:           $50,000 – $90,000
   - Colchón doble / queen:      $70,000 – $130,000
   - Colchón king:               $90,000 – $160,000
   - Almohadas (c/u):            $15,000 – $30,000

3. ALFOMBRAS Y TAPETES A VAPOR
   - Hasta 2 m²:                 $40,000 – $70,000
   - 2 – 6 m²:                   $70,000 – $140,000
   - 6 – 12 m²:                 $140,000 – $240,000
   - Más de 12 m²:              $240,000 – $420,000
   - Por m² aprox.:              $20,000 – $35,000/m²

4. TAPICERÍA DE AUTOMÓVILES
   - Carro pequeño (hatchback): $120,000 – $200,000
   - Carro mediano (sedán):     $150,000 – $250,000
   - SUV / camioneta:           $200,000 – $350,000
   - Microbús / van:            $300,000 – $500,000
   Incluye: asientos, moqueta, techo interior y paneles de puerta.

5. LIMPIEZA RESIDENCIAL A VAPOR
   - Apartamento < 50 m²:      $180,000 – $280,000
   - Apartamento 50–80 m²:     $250,000 – $380,000
   - Casa 80–120 m²:           $350,000 – $520,000
   - Casa > 120 m²:            $520,000 – $800,000
   - Por m² aprox.:              $4,000 – $6,500/m²

6. LIMPIEZA COMERCIAL A VAPOR
   - Restaurantes / cocinas:   $300,000 – $700,000
   - Oficinas (por m²):          $3,500 – $6,000/m²
   - Hoteles (por habitación):  $60,000 – $120,000
   - Locales comerciales:      $200,000 – $600,000

7. LIMPIEZA POST-OBRA
   - Apartamento < 60 m²:      $280,000 – $420,000
   - Casa 60–120 m²:           $420,000 – $700,000
   - Local / oficina:           $300,000 – $600,000
   Incluye: polvo de cemento, pintura y residuos de construcción.

8. BAÑOS Y DESINFECCIÓN A VAPOR
   - Baño individual:           $45,000 – $80,000
   - Pack 2–3 baños:           $90,000 – $200,000
   - Baños comerciales (c/u):  $60,000 – $120,000
   Elimina: hongos, sarro, bacterias en juntas y azulejos.

═══════════════════════════════════════════
AJUSTE POR CONDICIÓN Y MANCHAS
═══════════════════════════════════════════
- Limpieza normal (suciedad acumulada):       precio base
- Manchas medias (comida, bebida reciente):   +15% a +30%
- Manchas severas (grasa, orina, sangre):     +35% a +60%
- Olores fuertes (cigarrillo, mascotas):      +20% a +40%

Manchas que SÍ se eliminan: polvo, ácaros, bacterias, hongos, comida, sudor, grasa, barro, orina reciente, bebidas.
Manchas difíciles pero posibles: sangre seca, vino tinto, orina de mascotas (según antigüedad), tinta.
Manchas que NO se eliminan: quemaduras profundas, decoloración química, daño solar severo.

═══════════════════════════════════════════
PROCESO DEL SERVICIO
═══════════════════════════════════════════
1. Cliente solicita cotización en la web o llama a Juan Pablo o Sandra
2. En menos de 24 h el equipo contacta para confirmar detalles
3. Se agenda la visita en el día y hora convenidos
4. El equipo llega con máquina de vapor industrial (hasta 180 °C), aspiradora y productos biodegradables
5. Tiempos de secado: muebles 2–4 h · colchones 3–5 h · tapetes 1–3 h · automóviles 1–2 h
6. No se usan químicos agresivos

═══════════════════════════════════════════
CÓMO COTIZAR
═══════════════════════════════════════════
Cuando pidan precio, SIEMPRE responde con cifras concretas en COP. Usa este formato:
💰 **Estimación**: $XX,000 – $XX,000 COP
📋 **Incluye**: [qué abarca]
⚙️ **Factores que ajustan el precio**: [lista breve]
📲 **Para precio exacto**: solicita cotización en la web o llama al 321 219 6255.

═══════════════════════════════════════════
ANÁLISIS DE FOTOS
═══════════════════════════════════════════
Cuando el usuario suba fotos, usa SIEMPRE este formato:
1. **Análisis**: tipo de mueble, material estimado, tipo de mancha, antigüedad estimada
2. **¿Se puede eliminar?**: Sí / Probablemente sí / Difícil / No — breve explicación
3. **Estimación de precio**: rango en COP con ajuste según condición
4. **Recomendaciones**: 2–3 consejos concretos

═══════════════════════════════════════════
REGLAS DE COMPORTAMIENTO
═══════════════════════════════════════════
- Responde siempre en español, natural, breve y conversacional — como una persona real
- Para saludos cortos: máximo 2 oraciones e invita a preguntar
- Para agradecimientos: 1 oración y ofrece más ayuda
- Para preguntas de precio/servicio/proceso: SIEMPRE da cifras concretas en COP
- Para sugerir opciones al usuario, termina con: ##OPCIONES:opcion1|opcion2|opcion3##
- Si la pregunta NO es sobre limpieza o la empresa: di amablemente que solo puedes ayudar con Servicio a tu Mano y termina con ##FAQ##
- NUNCA pongas ##FAQ## ni ##OPCIONES## en respuestas normales sobre precios o servicios
- Si analizas una foto y no puedes determinar el tamaño con certeza (p. ej. puestos del sofá, medida del colchón o del tapete), da un rango amplio y pregunta el dato que falta terminando con ##OPCIONES:opcion1|opcion2|opcion3## para precisar la cotización"""


# ── Respuestas locales de respaldo (sin costo) si la IA no está disponible ──
PRECIOS_RESPALDO = {
    ("sofa", "sillon", "mueble", "poltrona", "puesto"): "Vapor de muebles/sofás: sillón $40.000–$80.000, sofá 2 puestos $65.000–$120.000, sofá 3 puestos $90.000–$160.000, esquinero $150.000–$260.000.",
    ("colchon", "cama"): "Colchones a vapor: sencillo $50.000–$90.000, doble/queen $70.000–$130.000, king $90.000–$160.000.",
    ("tapete", "alfombra"): "Alfombras y tapetes: hasta 2 m² $40.000–$70.000, 2–6 m² $70.000–$140.000, 6–12 m² $140.000–$240.000.",
    ("carro", "auto", "vehiculo", "tapiceria"): "Tapicería de autos: hatchback $120.000–$200.000, sedán $150.000–$250.000, SUV $200.000–$350.000.",
    ("bano", "baño", "sanitario", "ducha"): "Baños y desinfección: baño individual $45.000–$80.000, pack 2–3 baños $90.000–$200.000.",
    ("casa", "apartamento", "apto", "residencial", "hogar"): "Limpieza residencial: apto <50 m² $180.000–$280.000, 50–80 m² $250.000–$380.000, casa 80–120 m² $350.000–$520.000.",
    ("oficina", "local", "comercial", "restaurante"): "Limpieza comercial: locales $200.000–$600.000, oficinas $3.500–$6.000/m², restaurantes $300.000–$700.000.",
    ("horario", "hora", "atienden", "abren"): "Atendemos lunes a sábado, 7:00 a.m.–6:00 p.m., a domicilio.",
    ("zona", "donde", "ubicad", "cobertura", "domicilio"): "Cubrimos Mosquera, Madrid, Funza y municipios cercanos de Cundinamarca, a domicilio.",
    ("agendar", "cita", "reservar", "contratar", "contacto", "telefono", "whatsapp"): "Para agendar llama o escribe a Juan Pablo 321 219 6255 o Sandra 312 527 6445, o usa el formulario de cotización en la web.",
}


def _procesar_imagen(data: bytes, content_type: str | None) -> tuple[bytes, str]:
    """
    Redimensiona a MAX_DIMENSION en el lado mayor, convierte a JPEG y devuelve
    (bytes_jpeg, "image/jpeg"). Acepta cualquier formato que Pillow reconozca
    (jpg, png, webp, heic, bmp, tiff, avif…). Si Pillow falla, devuelve los
    bytes originales con mime type seguro para no bloquear la llamada.
    """
    try:
        img = Image.open(io.BytesIO(data))
        # Corrige la rotación según el tag EXIF (fotos de celular vienen "acostadas")
        img = ImageOps.exif_transpose(img)
        # Normalizar modo para evitar errores al guardar como JPEG
        if img.mode not in ("RGB",):
            img = img.convert("RGB")
        # Redimensionar solo si supera el límite
        w, h = img.size
        if max(w, h) > MAX_DIMENSION:
            ratio = MAX_DIMENSION / max(w, h)
            new_size = (max(1, int(w * ratio)), max(1, int(h * ratio)))
            img = img.resize(new_size, Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
        return buf.getvalue(), "image/jpeg"
    except Exception as exc:
        print(f"[chatbot] _procesar_imagen: {exc} — usando bytes originales")
        return data, "image/jpeg"


def _respuesta_respaldo(mensaje: str, hay_imagenes: bool) -> str:
    texto = (mensaje or "").lower()
    encontrados = [resp for claves, resp in PRECIOS_RESPALDO.items() if any(k in texto for k in claves)]
    if encontrados:
        return " ".join(encontrados) + " Para un precio exacto solicita tu cotización o llama al 321 219 6255."
    if hay_imagenes:
        return (
            "No pude analizar la foto en este momento, pero cuéntame qué tipo de mueble es "
            "y dónde está la mancha, y te ayudo igual."
            "##OPCIONES:💰 Dame un rango de precio|📸 Enviar otra foto|📲 Hablar con un asesor##"
        )
    return (
        "¡Hola! Somos Servicio a tu Mano, limpieza a vapor a domicilio. "
        "Pregúntame por precios de sofás, colchones, tapetes, autos, baños o limpieza de casa/oficina, "
        "o llama al 321 219 6255."
    )


@router.post("/chatbot")
async def chatbot_endpoint(
    mensaje: str = Form(""),
    historial: str = Form("[]"),
    imagenes: Optional[List[UploadFile]] = File(None),
):
    api_key = os.getenv("GEMINI_API_KEY", "")
    modelo  = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    # ── Parsear historial ────────────────────────────────────────
    try:
        hist = json.loads(historial) if historial and historial != "[]" else []
        hist = [
            m for m in hist
            if isinstance(m, dict)
            and m.get("role") in ("user", "assistant")
            and m.get("content")
        ]
        hist = hist[-HISTORIAL_MAX:]
    except Exception:
        hist = []

    # ── Leer y pre-procesar imágenes ─────────────────────────────
    # Redimensiona, normaliza formato y convierte todo a JPEG antes de enviar
    partes_imagen = []
    hay_imagenes  = bool(imagenes)
    if imagenes:
        for img in imagenes[:3]:
            raw  = await img.read()
            data, mime = _procesar_imagen(raw, img.content_type)
            partes_imagen.append(types.Part.from_bytes(data=data, mime_type=mime))

    texto = mensaje.strip()
    if not texto:
        texto = (
            "Analiza esta imagen: di qué es, su tamaño aproximado y un rango de precio. Si el tamaño no es claro, pregúntalo."
            if hay_imagenes else "Hola"
        )

    # ── Sin API key: respaldo local inmediato ────────────────────
    if not api_key or api_key.startswith("tu-") or api_key.strip() == "":
        return {"respuesta": _respuesta_respaldo(texto, hay_imagenes)}

    # ── Construir contenido para Gemini ──────────────────────────
    contents = []
    for m in hist:
        rol = "model" if m["role"] == "assistant" else "user"
        contents.append(types.Content(role=rol, parts=[types.Part.from_text(text=str(m["content"]))]))
    contents.append(types.Content(role="user", parts=partes_imagen + [types.Part.from_text(text=texto)]))

    client = genai.Client(api_key=api_key)
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        max_output_tokens=1024,
        thinking_config=types.ThinkingConfig(thinking_budget=0),
    )
    loop = asyncio.get_running_loop()

    # ── Reintentos con timeout ───────────────────────────────────
    # - Timeout de 8 s por intento (aplica a texto e imagen por igual)
    # - 1 reintento con 0.5 s de pausa
    # - Si hay TimeoutError: salir del loop inmediatamente (no reintentar)
    # - Peor caso total: ~16.5 s antes de caer al respaldo local
    for intento in range(MAX_REINTENTOS):
        try:
            response = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    lambda: client.models.generate_content(
                        model=modelo, contents=contents, config=config
                    ),
                ),
                timeout=GEMINI_TIMEOUT,
            )
            respuesta = (response.text or "").strip()
            return {"respuesta": respuesta or _respuesta_respaldo(texto, hay_imagenes)}

        except asyncio.TimeoutError:
            print(f"[chatbot] Timeout ({GEMINI_TIMEOUT}s) en intento {intento + 1}/{MAX_REINTENTOS}")
            break  # No tiene sentido reintentar si ya agotó el tiempo

        except Exception as exc:
            print(f"[chatbot] Gemini intento {intento + 1}/{MAX_REINTENTOS} fallido: {exc}")
            if intento < MAX_REINTENTOS - 1:
                await asyncio.sleep(RETRY_DELAY)

    return {"respuesta": _respuesta_respaldo(texto, hay_imagenes)}
