import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer

SECRET_KEY = os.getenv("SECRET_KEY", "cambia-esto-por-algo-seguro")
serializer = URLSafeTimedSerializer(SECRET_KEY)

def generar_token(correo: str) -> str:
    return serializer.dumps(correo, salt="verificar-correo")

def verificar_token(token: str, max_age: int = 3600) -> str | None:
    try:
        correo = serializer.loads(token, salt="verificar-correo", max_age=max_age)
        return correo
    except Exception:
        return None

def enviar_correo_verificacion(correo_destino: str, nombre: str, token: str):
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    BASE_URL   = os.getenv("BASE_URL", "http://localhost:8000")

    link = f"{BASE_URL}/api/auth/verificar/{token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Confirma tu correo - Servicio a tu Mano"
    msg["From"]    = EMAIL_USER
    msg["To"]      = correo_destino

    html = f"""
    <h2>Hola {nombre} 👋</h2>
    <p>Gracias por registrarte en <b>Servicio a tu Mano</b>.</p>
    <p>Haz clic en el botón para confirmar tu correo:</p>
    <a href="{link}" style="
        background:#2563eb; color:white; padding:12px 24px;
        border-radius:8px; text-decoration:none; font-weight:bold;
    ">Confirmar correo</a>
    <p style="color:#888; font-size:12px; margin-top:16px;">
        Este enlace expira en 1 hora.
    </p>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, correo_destino, msg.as_string())