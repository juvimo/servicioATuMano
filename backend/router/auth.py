from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse
import bcrypt
import os
from dotenv import load_dotenv
from models import UsuarioRegistro, UsuarioLogin, VerificacionCodigo
from database import (
    get_usuario_por_correo, create_usuario, verificar_usuario,
    guardar_codigo_verificacion, incrementar_intento_verificacion,
    limpiar_codigo_verificacion,
)
from utils_email import (
    generar_token, verificar_token, enviar_correo_verificacion,
    generar_codigo, enviar_correo_codigo,
)

load_dotenv()

print("ADMIN_EMAIL:", os.getenv("ADMIN_EMAIL"))
print("ADMIN_PASSWORD:", os.getenv("ADMIN_PASSWORD"))

router = APIRouter()

ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

@router.post("/api/auth/registro")
async def registro(data: UsuarioRegistro):
    existente = await get_usuario_por_correo(data.correo)
    if existente:
        raise HTTPException(400, "Ya existe una cuenta con ese correo.")

    password_hash = hash_password(data.password)
    usuario = {
        "nombre": data.nombre,
        "correo": data.correo,
        "password_hash": password_hash,
        "is_verified": False,
    }
    await create_usuario(usuario)

    codigo = generar_codigo()
    await guardar_codigo_verificacion(data.correo, codigo)
    enviar_correo_codigo(data.correo, data.nombre, codigo)

    return {"mensaje": "Registro exitoso. Revisa tu correo, te enviamos un código de 5 dígitos."}

@router.post("/api/auth/login")
async def login(data: UsuarioLogin):
    print("LOGIN RECIBIDO:", data.correo, data.password)
    print("ADMIN EN ENV:", ADMIN_EMAIL, ADMIN_PASSWORD)
    if data.correo == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        return {"rol": "admin", "nombre": "Administrador", "correo": data.correo}

    usuario = await get_usuario_por_correo(data.correo)
    if not usuario:
        raise HTTPException(400, "Correo o contraseña incorrectos.")
    if not usuario.get("is_verified"):
        raise HTTPException(400, "Debes verificar tu correo antes de iniciar sesión.")
    if not verify_password(data.password, usuario["password_hash"]):
        raise HTTPException(400, "Correo o contraseña incorrectos.")

    return {"rol": "cliente", "nombre": usuario["nombre"], "correo": usuario["correo"]}

@router.post("/api/auth/verificar-codigo")
async def verificar_codigo(data: VerificacionCodigo):
    usuario = await get_usuario_por_correo(data.correo)
    if not usuario:
        raise HTTPException(404, "Usuario no encontrado.")
    if usuario.get("is_verified"):
        raise HTTPException(400, "Este correo ya fue verificado.")

    intentos = usuario.get("intentos_verificacion", 0)
    if intentos >= 2:
        raise HTTPException(400, "Has agotado todos los intentos. Contacta al soporte.")

    if usuario.get("codigo_verificacion") != data.codigo:
        await incrementar_intento_verificacion(data.correo)
        restantes = 1 - intentos
        if restantes <= 0:
            raise HTTPException(400, "Código incorrecto. No tienes más intentos.")
        raise HTTPException(400, f"Código incorrecto. Te queda {restantes} intento más.")

    await verificar_usuario(data.correo)
    await limpiar_codigo_verificacion(data.correo)
    return {"mensaje": "¡Correo verificado exitosamente! Ya puedes iniciar sesión."}

@router.get("/api/auth/verificar/{token}", response_class=HTMLResponse)
async def verificar_correo(token: str):
    correo = verificar_token(token)
    if not correo:
        return HTMLResponse("<h2>❌ Enlace inválido o expirado.</h2>", status_code=400)

    usuario = await get_usuario_por_correo(correo)
    if not usuario:
        return HTMLResponse("<h2>❌ Usuario no encontrado.</h2>", status_code=404)
    if usuario.get("is_verified"):
        return HTMLResponse("<h2>✅ Tu correo ya fue verificado antes. Puedes iniciar sesión.</h2>")

    await verificar_usuario(correo)
    return HTMLResponse("""
        <h2>✅ ¡Correo verificado exitosamente!</h2>
        <p>Ya puedes <a href="http://localhost:5173/login">iniciar sesión</a>.</p>
    """)