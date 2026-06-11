"""
seed_database.py
────────────────
Pobla la base de datos MongoDB del proyecto farm_API_integrado
con registros de prueba en formato JSON.

Cómo usarlo:
    pip install pymongo bcrypt
    python seed_database.py

Por defecto se conecta a mongodb://localhost y usa la BD "servicioatumano".
Si tu conexión es diferente, cambia MONGO_URI abajo.
"""

import json
import sys
from datetime import datetime

try:
    from pymongo import MongoClient
except ImportError:
    sys.exit("❌  Instala pymongo primero:  pip install pymongo")

try:
    import bcrypt
    def hash_password(plain: str) -> str:
        return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()
except ImportError:
    import hashlib
    def hash_password(plain: str) -> str:
        return hashlib.sha256(plain.encode()).hexdigest()

# ──────────────────────────────────────────────────────────────────────────────
#  CONFIGURACIÓN
# ──────────────────────────────────────────────────────────────────────────────
MONGO_URI   = "mongodb://localhost"
DB_NAME     = "servicioatumano"

# ──────────────────────────────────────────────────────────────────────────────
#  DATOS DE PRUEBA
# ──────────────────────────────────────────────────────────────────────────────

SERVICIOS = [
    {
        "titulo": "Diseño Web",
        "descripcion": "Creación de sitios web modernos, responsivos y optimizados para SEO.",
        "completada": False
    },
    {
        "titulo": "Desarrollo de App Móvil",
        "descripcion": "Desarrollo de aplicaciones nativas e híbridas para iOS y Android.",
        "completada": False
    },
    {
        "titulo": "Consultoría en Cloud",
        "descripcion": "Migración y optimización de infraestructura en AWS, Azure o GCP.",
        "completada": True
    },
    {
        "titulo": "Automatización de Procesos",
        "descripcion": "Implementación de flujos automatizados con Python y herramientas RPA.",
        "completada": False
    },
    {
        "titulo": "Auditoría de Seguridad",
        "descripcion": "Análisis de vulnerabilidades y pruebas de penetración para tu sistema.",
        "completada": False
    },
]

COTIZACIONES = [
    {
        "nombre": "Carlos Herrera",
        "telefono": "3001234567",
        "correo": "carlos.herrera@email.com",
        "servicio": "Diseño Web",
        "info": "Necesito una landing page para mi negocio de fotografía."
    },
    {
        "nombre": "Laura Gómez",
        "telefono": "3117654321",
        "correo": "laura.gomez@empresa.co",
        "servicio": "Desarrollo de App Móvil",
        "info": "App de delivery para restaurante, con panel de administración."
    },
    {
        "nombre": "Andrés Martínez",
        "telefono": "3209876543",
        "correo": "andres.m@tech.io",
        "servicio": "Consultoría en Cloud",
        "info": "Quiero migrar nuestros servidores on-premise a AWS."
    },
    {
        "nombre": "Sofía Ramírez",
        "telefono": "3154561234",
        "correo": "sofia.r@startup.co",
        "servicio": "Automatización de Procesos",
        "info": "Automatizar el proceso de facturación y envío de correos."
    },
    {
        "nombre": "Miguel Torres",
        "telefono": "3008887766",
        "correo": "miguel.torres@fintech.com",
        "servicio": "Auditoría de Seguridad",
        "info": "Revisión de nuestra API REST y base de datos antes del lanzamiento."
    },
]

USUARIOS = [
    {
        "nombre": "Administrador",
        "correo": "admin@servicioatumano.com",
        "password_hash": hash_password("Admin2024!"),
        "is_verified": True
    },
    {
        "nombre": "Ana López",
        "correo": "ana.lopez@email.com",
        "password_hash": hash_password("password123"),
        "is_verified": True
    },
    {
        "nombre": "Pedro Ríos",
        "correo": "pedro.rios@mail.co",
        "password_hash": hash_password("pedro456"),
        "is_verified": False
    },
]


# ──────────────────────────────────────────────────────────────────────────────
#  FUNCIÓN PRINCIPAL
# ──────────────────────────────────────────────────────────────────────────────

def seed():
    print(f"\n🔌  Conectando a {MONGO_URI} …")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

    try:
        client.admin.command("ping")
    except Exception as e:
        sys.exit(f"❌  No se pudo conectar a MongoDB: {e}")

    db = client[DB_NAME]

    resultados = {}

    for coleccion, datos, nombre in [
        (db.servicios,    SERVICIOS,    "servicios"),
        (db.cotizaciones, COTIZACIONES, "cotizaciones"),
        (db.usuarios,     USUARIOS,     "usuarios"),
    ]:
        # Limpiar colección antes de insertar (opcional — comenta si no quieres borrar)
        coleccion.delete_many({})

        result = coleccion.insert_many(datos)
        resultados[nombre] = len(result.inserted_ids)
        print(f"  ✅  {nombre:15s} → {len(result.inserted_ids)} documentos insertados")

    # ── Mostrar resumen en JSON ──────────────────────────────────────────────
    print("\n📄  Resumen de los documentos guardados:\n")

    for coleccion_nombre in ["servicios", "cotizaciones", "usuarios"]:
        col = db[coleccion_nombre]
        docs = list(col.find({}))
        for doc in docs:
            doc["_id"] = str(doc["_id"])          # hacer serializable
        print(f"── {coleccion_nombre.upper()} ──")
        print(json.dumps(docs, indent=2, ensure_ascii=False))
        print()

    print(f"🎉  Seed completado. Base de datos: '{DB_NAME}'\n")
    client.close()


if __name__ == "__main__":
    seed()
