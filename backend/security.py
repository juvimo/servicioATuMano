import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("Falta SECRET_KEY en el archivo .env")

ALGORITHM = "HS256"
TOKEN_EXP_MINUTES = int(os.getenv("TOKEN_EXP_MINUTES", "720"))

bearer_scheme = HTTPBearer(auto_error=False)


def crear_token(correo: str, rol: str, nombre: str) -> str:
    expira = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXP_MINUTES)
    payload = {"sub": correo, "rol": rol, "nombre": nombre, "exp": expira}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _decodificar(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "La sesión expiró. Inicia sesión de nuevo.")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido.")


def usuario_actual(
    cred: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    if cred is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Falta el token de autenticación.")
    return _decodificar(cred.credentials)


def solo_admin(usuario: dict = Depends(usuario_actual)) -> dict:
    if usuario.get("rol") != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Acceso restringido a administradores.")
    return usuario
