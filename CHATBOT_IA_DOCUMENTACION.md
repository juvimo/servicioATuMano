# Chatbot IA — Documentación Técnica
**Proyecto:** Servicio a tu Mano  
**Fecha:** Junio 2026  
**Tecnologías:** React + Vite (frontend) · FastAPI (backend) · Google Gemini 2.0 Flash (IA)

---

## Índice

1. [Visión general de la arquitectura](#1-visión-general-de-la-arquitectura)
2. [Flujo completo de una conversación](#2-flujo-completo-de-una-conversación)
3. [Backend — chatbot.py paso a paso](#3-backend--chatbotpy-paso-a-paso)
4. [Frontend — Chatbot.jsx paso a paso](#4-frontend--chatbotjsx-paso-a-paso)
5. [Funciones de cámara (foto en vivo)](#5-funciones-de-cámara-foto-en-vivo)
6. [Sistema de opciones rápidas (chips)](#6-sistema-de-opciones-rápidas-chips)
7. [Renderizado de Markdown en el chat](#7-renderizado-de-markdown-en-el-chat)
8. [Manejo de errores y respuestas de respaldo](#8-manejo-de-errores-y-respuestas-de-respaldo)
9. [Adaptación a móvil (keyboard-aware)](#9-adaptación-a-móvil-keyboard-aware)
10. [Variables de entorno necesarias](#10-variables-de-entorno-necesarias)
11. [Diagrama de carpetas](#11-diagrama-de-carpetas)

---

## 1. Visión general de la arquitectura

```
NAVEGADOR (React)
   │
   │  POST /api/chatbot
   │  FormData { mensaje, historial, imagenes[] }
   ▼
SERVIDOR (FastAPI — Python)
   │
   │  Preprocesa imágenes con Pillow
   │  Construye el contexto de conversación
   ▼
GOOGLE GEMINI 2.0 FLASH (API externa)
   │
   │  Respuesta en texto plano
   ▼
FASTAPI  → devuelve JSON { "respuesta": "..." }
   │
   ▼
REACT  → parsea el texto, extrae chips de opciones, renderiza el chat
```

El chatbot **no guarda nada en base de datos**: el historial se mantiene en el estado de React (memoria del navegador) y se reenvía al servidor en cada mensaje para que Gemini tenga contexto.

---

## 2. Flujo completo de una conversación

```
Usuario escribe o toca un chip
        │
        ▼
handleSend(texto, imagenes)
        │
        ├─ Agrega el mensaje del usuario al estado `messages`
        ├─ Limpia el input y las imágenes seleccionadas
        ├─ Activa el indicador de carga (tres puntos animados)
        │
        ▼
callAI(texto, imagenes, historial)
        │
        ├─ Construye un FormData con:
        │     mensaje   = texto del usuario
        │     historial = últimos 20 turnos (JSON)
        │     imagenes  = archivos (File objects)
        │
        ├─ POST a /api/chatbot  (timeout 30 s)
        │
        ▼
Backend recibe, llama a Gemini, devuelve JSON
        │
        ▼
parseResponse(raw)
        │
        ├─ Extrae chips del formato  ##OPCIONES:op1|op2|op3##
        ├─ Extrae señal ##FAQ##  → muestra las sugerencias iniciales
        └─ Devuelve { text, opciones }
        │
        ▼
Nuevo mensaje del bot en `messages` con text + opciones
```

---

## 3. Backend — chatbot.py paso a paso

### 3.1 Importaciones y configuración

```python
import os, io, json, asyncio
from fastapi import APIRouter, Form, File, UploadFile
from google import genai
from google.genai import types
from PIL import Image
```

| Biblioteca | Por qué se usa |
|---|---|
| `google-genai` | SDK oficial de Google para llamar a Gemini |
| `Pillow (PIL)` | Redimensionar y convertir imágenes antes de enviarlas |
| `asyncio` | Manejar timeout y reintentos sin bloquear el servidor |
| `FastAPI` | Crear el endpoint REST que recibe el formulario |

**Constantes de control:**

```python
MAX_DIMENSION  = 1024   # px — si la imagen es mayor, se reduce
JPEG_QUALITY   = 85     # calidad de la imagen convertida
GEMINI_TIMEOUT = 15.0   # segundos de espera por intento
RETRY_DELAY    = 1.5    # pausa entre reintentos
MAX_REINTENTOS = 3
```

### 3.2 System Prompt — el "cerebro" del chatbot

```python
SYSTEM_PROMPT = """Eres el asistente virtual de "Servicio a tu Mano"..."""
```

Este texto se envía a Gemini **en cada petición** como instrucción de sistema. Contiene:

- **Datos de la empresa**: nombres de los dueños, teléfonos, zona de cobertura, horario, formas de pago.
- **Tabla de precios completa**: 8 categorías de servicios con rangos en COP.
- **Ajuste por condición**: cómo sube el precio según el tipo de mancha.
- **Formato de cotización**: cómo debe responder cuando pidan precio (con emoji, rango, incluye, factores).
- **Formato de análisis de foto**: 4 puntos que Gemini siempre debe cubrir.
- **Reglas de comportamiento**: responde en español, da precios concretos, usa `##OPCIONES:##` para chips, usa `##FAQ##` si la pregunta no es sobre la empresa.

> El System Prompt actúa como un "empleado virtual" entrenado: sabe exactamente qué decir, cómo cotizar y cómo analizar fotos.

### 3.3 Preprocesamiento de imágenes — `_procesar_imagen()`

```python
def _procesar_imagen(data: bytes, content_type: str | None) -> tuple[bytes, str]:
    img = Image.open(io.BytesIO(data))
    if img.mode not in ("RGB",):
        img = img.convert("RGB")          # PNG con alfa, HEIC, etc.
    w, h = img.size
    if max(w, h) > MAX_DIMENSION:
        ratio = MAX_DIMENSION / max(w, h)
        img = img.resize(...)             # reduce sin distorsionar
    img.save(buf, format="JPEG", quality=85, optimize=True)
    return buf.getvalue(), "image/jpeg"
```

**Por qué es necesaria:**

| Problema | Solución |
|---|---|
| Fotos de 10+ MB desde el móvil | Se reducen a ≤ 1024 px antes de enviar a Gemini |
| Fotos PNG con canal alpha | Se convierten a RGB (JPEG no soporta transparencia) |
| Fotos HEIC (iPhone) | Pillow las abre y convierte a JPEG |
| Cualquier formato desconocido | Si Pillow falla, se pasan los bytes originales igual |

### 3.4 Respaldo local — `_respuesta_respaldo()`

Si la API de Gemini no responde, el servidor no le muestra un error al usuario sino una respuesta con precios tomada de un diccionario local:

```python
PRECIOS_RESPALDO = {
    ("sofa", "mueble", ...): "Vapor de muebles: sofá 2 puestos $65.000–$120.000...",
    ("colchon", "cama"):     "Colchones: sencillo $50.000–$90.000...",
    ...
}
```

La función busca palabras clave en el mensaje del usuario y devuelve la respuesta correspondiente. Si no encuentra nada, da un saludo genérico con el teléfono.

### 3.5 Endpoint principal — `POST /api/chatbot`

```python
@router.post("/chatbot")
async def chatbot_endpoint(
    mensaje:   str            = Form(""),
    historial: str            = Form("[]"),
    imagenes:  List[UploadFile] = File(None),
):
```

**Pasos internos del endpoint:**

```
1. Parsear el historial JSON enviado por el frontend
   └─ Filtrar solo roles "user" / "assistant"
   └─ Tomar solo los últimos 20 turnos

2. Leer y preprocesar las imágenes (hasta 3)
   └─ _procesar_imagen() → bytes JPEG normalizados

3. Si no hay API key → respaldo local inmediato

4. Construir el array `contents` para Gemini:
   ├─ Historial pasado como mensajes anteriores
   └─ Mensaje actual: [imágenes] + [texto]

5. Llamar a Gemini con timeout + reintentos:
   ├─ asyncio.wait_for(..., timeout=15)     ← corre en executor para no bloquear
   ├─ Si TimeoutError → salir (sin reintentar)
   └─ Si otro error → esperar 1.5 s y reintentar (hasta 3 veces)

6. Si Gemini responde → devolver { "respuesta": texto }
   Si falla todo   → devolver respaldo local
```

**Por qué `run_in_executor`:**  
El SDK de Gemini hace una llamada HTTP *síncrona*. Llamarla directamente en una función `async` bloquearía todo el servidor. `run_in_executor` la mueve a un hilo separado, permitiendo que FastAPI siga atendiendo otras peticiones.

```python
response = await asyncio.wait_for(
    loop.run_in_executor(None, lambda: client.models.generate_content(...)),
    timeout=GEMINI_TIMEOUT,
)
```

---

## 4. Frontend — Chatbot.jsx paso a paso

### 4.1 Estado (state) del componente

```jsx
const [open,       setOpen]       = useState(false);      // panel abierto/cerrado
const [messages,   setMessages]   = useState([WELCOME]);   // historial visual
const [historial,  setHistorial]  = useState([]);          // historial para Gemini
const [inputVal,   setInputVal]   = useState("");          // texto del input
const [imagenes,   setImagenes]   = useState([]);          // fotos adjuntas
const [loading,    setLoading]    = useState(false);       // "pensando..."
const [isMobile,   setIsMobile]   = useState(false);      // ≤ 480 px?
const [viewH,      setViewH]      = useState(0);           // altura visible (teclado)

// Cámara
const [showAttachMenu, setShowAttachMenu] = useState(false);
const [showCamera,     setShowCamera]     = useState(false);
const [cameraStream,   setCameraStream]   = useState(null);
const [capturedPhoto,  setCapturedPhoto]  = useState(null);
```

Hay **dos historiales diferentes**:

| Estado | Uso |
|---|---|
| `messages` | Lo que se *muestra* en la pantalla (con emojis, formato, opciones) |
| `historial` | Lo que se *envía a Gemini* (solo `role` + `content` en texto plano) |

### 4.2 Mensaje de bienvenida

```jsx
const WELCOME = {
  id: 0,
  from: "bot",
  text: "¡Hola! 👋 Soy el asistente de Servicio a tu Mano...",
  opciones: SUGERENCIAS,  // los 6 chips iniciales
};
```

Este objeto se pone en `messages` desde el inicio (`useState([WELCOME])`), así el usuario siempre ve una bienvenida aunque no haya escrito nada.

### 4.3 Función `callAI` — petición al backend

```jsx
async function callAI(mensaje, imgs, hist) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);  // 30 s

  const formData = new FormData();
  formData.append("mensaje",   mensaje || "");
  formData.append("historial", JSON.stringify(hist.slice(-20)));
  imgs.forEach(img => formData.append("imagenes", img.file));

  const res = await fetch(`${API_URL}/api/chatbot`, {
    method: "POST",
    body: formData,
    signal: controller.signal,
  });

  return (await res.json()).respuesta;
}
```

Se usa `FormData` (multipart) porque hay que enviar tanto texto como archivos binarios (imágenes) en una sola petición.

### 4.4 Función `handleSend` — orquestador principal

```jsx
async function handleSend(texto, imgs) {
  // 1. Agregar el mensaje del usuario al chat visual
  setMessages(prev => [...prev, { id: Date.now(), from: "user", text: texto, imagePreviews: imgs.map(i => i.preview) }]);

  // 2. Limpiar input y activar loading
  setInputVal(""); setImagenes([]); setLoading(true);

  // 3. Llamar a la IA
  const raw = await callAI(texto, imgs, historial);

  // 4. Parsear la respuesta y agregar al chat
  const { text, opciones } = parseResponse(raw);
  setHistorial([...newHist, { role: "assistant", content: raw }]);
  setMessages(prev => [...prev, { id: Date.now(), from: "bot", text, opciones }]);
}
```

### 4.5 Manejo de archivos desde galería — `handleFileChange`

```jsx
function handleFileChange(e) {
  const slots = 3 - imagenes.length;   // máximo 3 fotos
  const newFiles = Array.from(e.target.files).slice(0, slots);
  setImagenes(prev => [
    ...prev,
    ...newFiles.map(file => ({
      file,                              // el File original para enviarlo
      preview: URL.createObjectURL(file), // URL local para mostrar miniatura
      name: file.name,
    }))
  ].slice(0, 3));
}
```

Se crea una URL temporal (`createObjectURL`) solo para la previsualización en el chat. El archivo real (`File`) se guarda en estado para enviarlo al backend via FormData.

---

## 5. Funciones de cámara (foto en vivo)

Esta funcionalidad usa la API nativa del navegador `navigator.mediaDevices.getUserMedia`.

### 5.1 `startCamera()` — abre la cámara trasera

```jsx
async function startCamera() {
  setShowAttachMenu(false);
  if (imagenes.length >= 3) return;  // ya hay 3 fotos, no abrir
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },  // cámara trasera en móvil
      audio: false,
    });
    setCameraStream(stream);   // guarda el stream para poder pararlo después
    setShowCamera(true);
  } catch {
    // Sin permiso o sin cámara → abrir galería como alternativa
    fileInputRef.current?.click();
  }
}
```

`facingMode: "environment"` solicita específicamente la cámara trasera del teléfono (la que apunta al mueble), que es más útil para fotografiar manchas que la frontal.

### 5.2 Conexión del stream al `<video>`

```jsx
useEffect(() => {
  if (!showCamera || !cameraStream || !videoRef.current) return;
  videoRef.current.srcObject = cameraStream;
  videoRef.current.play().catch(() => {});
}, [showCamera, cameraStream]);
```

El `<video>` no puede recibir el stream en el mismo render en que se crea, porque el elemento DOM puede no estar montado todavía. El `useEffect` espera a que ambos (stream y referencia al DOM) estén listos.

### 5.3 `capturePhoto()` — toma la foto

```jsx
function capturePhoto() {
  const video  = videoRef.current;
  const canvas = canvasRef.current;
  canvas.width  = video.videoWidth  || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext("2d").drawImage(video, 0, 0);
  setCapturedPhoto(canvas.toDataURL("image/jpeg", 0.92));
}
```

El truco es usar un `<canvas>` invisible: se "dibuja" el frame actual del video en el canvas y se exporta como imagen JPEG (`toDataURL`). Esto da una imagen base64 que se puede mostrar como previsualización.

### 5.4 `usePhoto()` — convierte la foto en `File` y la adjunta

```jsx
async function usePhoto() {
  const blob = await (await fetch(capturedPhoto)).blob();  // base64 → Blob
  const file = new File([blob], `camara-${Date.now()}.jpg`, { type: "image/jpeg" });
  setImagenes(prev => [...prev, { file, preview: capturedPhoto, name: file.name }].slice(0, 3));
  stopCamera();
}
```

Se convierte el `dataURL` (base64) en un `Blob`, luego en un `File`. Esto es necesario porque el backend espera un `File` en el `FormData`, no una cadena base64.

### 5.5 `stopCamera()` — libera los recursos

```jsx
function stopCamera() {
  cameraStream?.getTracks().forEach(t => t.stop());  // detiene el stream de hardware
  setCameraStream(null);
  setShowCamera(false);
  setCapturedPhoto(null);
}
```

Llamar `getTracks().forEach(t => t.stop())` es crucial: sin esto, la cámara del teléfono sigue activa en segundo plano (el LED verde permanece encendido) aunque el panel del chat esté cerrado.

---

## 6. Sistema de opciones rápidas (chips)

### 6.1 Cómo Gemini indica qué chips mostrar

Gemini incluye en su respuesta una etiqueta especial al final del texto:

```
Claro, el sofá 3 puestos te saldría entre $90.000 y $160.000.

##OPCIONES:💰 Quiero una cotización exacta|📸 Enviar foto de la mancha|📲 Llamar ahora##
```

### 6.2 `parseResponse()` — extrae los chips

```jsx
function parseResponse(raw) {
  let text = raw;
  let opciones = null;

  // Extraer ##OPCIONES:op1|op2|op3##
  const opMatch = text.match(/##OPCIONES:([^#]+)##/);
  if (opMatch) {
    opciones = opMatch[1].split("|").map(s => s.trim()).filter(Boolean);
    text = text.replace(/##OPCIONES:[^#]+##/, "").trim();
  }

  // Señal para volver al FAQ inicial
  if (text.includes("##FAQ##")) {
    opciones = SUGERENCIAS;
    text = text.replace(/##FAQ##/g, "").trim();
  }

  return { text, opciones };
}
```

Los chips se eliminan del texto antes de mostrarlo al usuario. El usuario ve texto limpio y debajo los botones de acción.

### 6.3 `handleOptionClick()` — qué pasa al tocar un chip

```jsx
function handleOptionClick(op) {
  // Redirigir al formulario público
  if (op === "Ir a Cotización") { window.location.href = "/cotizacion"; return; }

  // Reintentar el último mensaje si hubo error
  if (op === "🔄 Intentar de nuevo") {
    const lastUser = [...messages].reverse().find(m => m.from === "user");
    if (lastUser) handleSend(lastUser.text, []);
    return;
  }

  // Mostrar instrucciones de cómo enviar foto
  if (op === "📸 Analizar manchas con IA") {
    setMessages(prev => [...prev,
      { id: Date.now(), from: "user", text: op },
      { id: Date.now()+1, from: "bot", text: "Usa el botón 📷 para adjuntar fotos...", opciones: [...] },
    ]);
    return;
  }

  // Para cualquier otra opción: enviarla como si el usuario la hubiera escrito
  handleSend(op, []);
}
```

---

## 7. Renderizado de Markdown en el chat

Gemini responde con formato Markdown (`**negrita**`, `- listas`, `1. numeradas`). El navegador no renderiza Markdown por defecto, así que hay una función que lo convierte a JSX:

```jsx
function parseMarkdown(text) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();

    // Lista con viñeta
    if (trimmed.startsWith("- ")) {
      const parts = raw.split(/\*\*(.*?)\*\*/g)...;
      return <div key={i}><span>•</span><span>{parts}</span></div>;
    }

    // Lista numerada
    if (trimmed.match(/^(\d+)\.\s(.+)/)) { ... }

    // Línea en negrita intermitente **texto**
    const parts = line.split(/\*\*(.*?)\*\*/g).map((p, j) =>
      j % 2 === 1 ? <strong key={j}>{p}</strong> : p
    );

    return <div key={i}>{parts}</div>;
  });
}
```

Cada `**texto**` se convierte en `<strong>`, cada `- item` en un div con viñeta verde, y cada `1. item` en un div numerado.

---

## 8. Manejo de errores y respuestas de respaldo

### Frontend — errores de red

```jsx
} catch (err) {
  const esTimeout = err.name === "AbortError";  // el AbortController disparó
  setMessages(prev => [...prev, {
    from: "bot",
    text: esTimeout
      ? "La respuesta tardó demasiado. Verifica que el servidor esté activo."
      : `No pude conectarme: ${err.message}`,
    opciones: ["🔄 Intentar de nuevo", "Ir a Cotización"],
  }]);
}
```

El usuario nunca ve una página de error: el error aparece como un mensaje más del bot, con la opción de reintentar.

### Backend — errores de Gemini

```
Intento 1 → falla (error de red, rate limit, etc.)
  └─ esperar 1.5 s → Intento 2
       └─ falla → esperar 1.5 s → Intento 3
            └─ falla → respaldo local (precios del diccionario)

Si hay TimeoutError (>15 s) → salir inmediatamente sin reintentar
```

El respaldo local garantiza que el usuario siempre reciba alguna respuesta útil, incluso si la API de Gemini está caída.

---

## 9. Adaptación a móvil (keyboard-aware)

Cuando el teclado virtual del teléfono aparece, el navegador reduce el espacio visible disponible. Sin corrección, el input quedaría oculto debajo del teclado.

### Solución: `window.visualViewport`

```jsx
useEffect(() => {
  const vv = window.visualViewport;
  if (!vv || !isMobile) return;

  const onVp = () => {
    setViewH(vv.height);  // altura del área visible cuando el teclado está abierto
    // Hacer scroll al último mensaje
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  vv.addEventListener("resize", onVp);   // se dispara al abrir/cerrar el teclado
  vv.addEventListener("scroll", onVp);
  return () => { vv.removeEventListener("resize", onVp); ... };
}, [isMobile, open]);
```

### Uso del valor `viewH` en el panel

```jsx
<div style={{
  top:       isMobile ? (viewH > 0 ? `calc(100dvh - ${viewH}px)` : 0) : "auto",
  height:    isMobile ? (viewH > 0 ? `${viewH}px` : "100dvh") : "auto",
  maxHeight: isMobile ? "none" : "min(590px, calc(100vh - 120px))",
}}>
```

Cuando el teclado abre y `visualViewport.height` pasa de 844 px a 380 px (por ejemplo), el panel se mueve hacia arriba exactamente lo suficiente para que el input siempre sea visible.

---

## 10. Variables de entorno necesarias

Archivo: `backend/.env`

```env
GEMINI_API_KEY=AIzaSy...    # clave de Google AI Studio
GEMINI_MODEL=gemini-2.0-flash
```

**Cómo obtener la clave:**
1. Ir a [aistudio.google.com](https://aistudio.google.com)
2. Crear proyecto → Get API Key
3. Pegar el valor en el `.env`

Si la clave no está o empieza con `"tu-"`, el backend usa automáticamente el modo de respaldo local (sin llamar a Gemini), lo que permite desarrollar sin API key.

---

## 11. Diagrama de carpetas

```
farm_API_integrado/
│
├── backend/
│   ├── main.py                    # FastAPI: monta los routers
│   ├── requirements.txt           # fastapi, uvicorn, google-genai, Pillow, etc.
│   ├── .env                       # GEMINI_API_KEY y GEMINI_MODEL
│   └── router/
│       └── chatbot.py             # Toda la lógica del chatbot (endpoint + IA)
│
├── cliente/
│   └── src/
│       ├── components/
│       │   └── Chatbot.jsx        # Componente React del panel de chat
│       ├── api/
│       │   └── config.js          # BASE URL del backend
│       └── App.jsx                # Monta <Chatbot /> en todas las páginas públicas
│
└── CHATBOT_IA_DOCUMENTACION.md    # Este archivo
```

### Archivos clave por responsabilidad

| Archivo | Responsabilidad |
|---|---|
| `chatbot.py` | Recibe la petición, llama a Gemini, maneja errores, devuelve respuesta |
| `Chatbot.jsx` | Panel de UI, estado del chat, cámara, envío al backend |
| `App.jsx` | Decide en qué rutas se muestra el chatbot (oculto en `/dashboard`, `/login`) |
| `.env` | Credenciales de la API de Google |
| `requirements.txt` | Dependencias de Python (incluye `Pillow` para imágenes) |

---

## Resumen de cada función añadida cronológicamente

| Función | Ubicación | Qué hace |
|---|---|---|
| `callAI()` | Chatbot.jsx | Envía FormData al backend con texto + historial + imágenes |
| `handleSend()` | Chatbot.jsx | Orquesta: agrega mensaje, llama a IA, parsea respuesta |
| `handleOptionClick()` | Chatbot.jsx | Maneja los chips de acción rápida |
| `parseResponse()` | Chatbot.jsx | Extrae `##OPCIONES:##` y `##FAQ##` del texto de Gemini |
| `parseMarkdown()` | Chatbot.jsx | Convierte `**negrita**` y `- listas` a JSX |
| `handleFileChange()` | Chatbot.jsx | Carga fotos desde la galería del teléfono |
| `removeImage()` | Chatbot.jsx | Elimina una foto del preview antes de enviar |
| `startCamera()` | Chatbot.jsx | Abre la cámara trasera con `getUserMedia` |
| `capturePhoto()` | Chatbot.jsx | Captura el frame del video en un `<canvas>` |
| `usePhoto()` | Chatbot.jsx | Convierte el canvas (base64) a `File` para el FormData |
| `stopCamera()` | Chatbot.jsx | Para el stream y libera la cámara de hardware |
| `resetChat()` | Chatbot.jsx | Borra todo y vuelve al mensaje de bienvenida |
| `_procesar_imagen()` | chatbot.py | Redimensiona y convierte a JPEG con Pillow |
| `_respuesta_respaldo()` | chatbot.py | Busca precios en el diccionario local si Gemini falla |
| `chatbot_endpoint()` | chatbot.py | Endpoint POST que orquesta todo el flujo en el servidor |
