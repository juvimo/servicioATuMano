import smtplib
import os
import random
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

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