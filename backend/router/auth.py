from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse
from passlib.context import CryptContext
from models import UsuarioRegistro
from database import get_usuario_por_correo, create_usuario, verificar_usuario
from utils_email import generar_token, verificar_token, enviar_correo_verificacion

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/api/auth/registro")
async def registro(data: UsuarioRegistro):
    existente = await get_usuario_por_correo(data.correo)
    if existente:
        raise HTTPException(400, "Ya existe una cuenta con ese correo.")

    password_hash = pwd_context.hash(data.password)
    usuario = {
        "nombre": data.nombre,
        "correo": data.correo,
        "password_hash": password_hash,
        "is_verified": False,
    }
    await create_usuario(usuario)

    token = generar_token(data.correo)
    enviar_correo_verificacion(data.correo, data.nombre, token)

    return {"mensaje": "Registro exitoso. Revisa tu correo para confirmar tu cuenta."}

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