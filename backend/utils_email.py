import smtplib
import os
import random
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer

load_dotenv()

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

def generar_codigo() -> str:
    return str(random.randint(10000, 99999))

def enviar_correo_codigo(correo_destino: str, nombre: str, codigo: str):
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Código de verificación - Servicio a tu Mano"
    msg["From"]    = EMAIL_USER
    msg["To"]      = correo_destino

    html = f"""
    <h2>Hola {nombre} 👋</h2>
    <p>Gracias por registrarte en <b>Servicio a tu Mano</b>.</p>
    <p>Tu código de verificación es:</p>
    <div style="font-size:36px; font-weight:bold; letter-spacing:10px;
                color:#2563eb; margin:20px 0; text-align:center;">
        {codigo}
    </div>
    <p style="color:#888; font-size:12px;">
        Ingresa este código en la página para activar tu cuenta.<br>
        Solo tienes <b>2 intentos</b>.
    </p>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, correo_destino, msg.as_string())

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