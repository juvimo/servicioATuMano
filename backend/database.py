import os

import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://judcode:pGJud.sQl.26%21@localhost:5432/servicioatumano",
)

_pool = None


async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
    return _pool


def _doc(row):
    """Convierte un Record de asyncpg en dict con _id (string), como devolvía Mongo."""
    if row is None:
        return None
    d = dict(row)
    d["_id"] = str(d.pop("id"))
    return d


def _to_int(id):
    try:
        return int(id)
    except (TypeError, ValueError):
        return None


# ─────────────────────────────────────────
#  SERVICIOS
# ─────────────────────────────────────────
async def get_todos_servicios():
    pool = await get_pool()
    rows = await pool.fetch("SELECT id, titulo, descripcion, completada FROM servicios ORDER BY id")
    return [_doc(r) for r in rows]


async def get_servicio_por_id(id: str):
    pid = _to_int(id)
    if pid is None:
        return None
    pool = await get_pool()
    row = await pool.fetchrow("SELECT id, titulo, descripcion, completada FROM servicios WHERE id=$1", pid)
    return _doc(row)


async def get_servicio_por_titulo(titulo: str):
    pool = await get_pool()
    row = await pool.fetchrow("SELECT id, titulo, descripcion, completada FROM servicios WHERE titulo=$1", titulo)
    return _doc(row)


async def create_servicio(data: dict):
    pool = await get_pool()
    row = await pool.fetchrow(
        """INSERT INTO servicios (titulo, descripcion, completada)
           VALUES ($1, $2, $3)
           RETURNING id, titulo, descripcion, completada""",
        data.get("titulo"),
        data.get("descripcion"),
        bool(data.get("completada", False)),
    )
    return _doc(row)


async def update_servicio(id: str, data):
    pid = _to_int(id)
    if pid is None:
        return None
    campos = data.model_dump(by_alias=True, exclude_none=True)
    campos.pop("_id", None)
    campos.pop("id", None)

    pool = await get_pool()
    if campos:
        columnas = list(campos.keys())
        sets = ", ".join(f"{c}=${i + 2}" for i, c in enumerate(columnas))
        valores = [campos[c] for c in columnas]
        await pool.execute(f"UPDATE servicios SET {sets} WHERE id=$1", pid, *valores)

    row = await pool.fetchrow("SELECT id, titulo, descripcion, completada FROM servicios WHERE id=$1", pid)
    return _doc(row)


async def delete_servicio(id: str):
    pid = _to_int(id)
    if pid is not None:
        pool = await get_pool()
        await pool.execute("DELETE FROM servicios WHERE id=$1", pid)
    return True


# ─────────────────────────────────────────
#  COTIZACIONES
# ─────────────────────────────────────────
async def get_todas_cotizaciones():
    pool = await get_pool()
    rows = await pool.fetch("SELECT id, nombre, telefono, correo, servicio, info FROM cotizaciones ORDER BY id")
    return [_doc(r) for r in rows]


async def create_cotizacion(data: dict):
    pool = await get_pool()
    row = await pool.fetchrow(
        """INSERT INTO cotizaciones (nombre, telefono, correo, servicio, info)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, nombre, telefono, correo, servicio, info""",
        data.get("nombre"),
        data.get("telefono"),
        data.get("correo"),
        data.get("servicio"),
        data.get("info"),
    )
    return _doc(row)


# ─────────────────────────────────────────
#  USUARIOS
# ─────────────────────────────────────────
async def get_usuario_por_correo(correo: str):
    pool = await get_pool()
    row = await pool.fetchrow("SELECT * FROM usuarios WHERE correo=$1", correo)
    return _doc(row)


async def create_usuario(data: dict):
    pool = await get_pool()
    row = await pool.fetchrow(
        """INSERT INTO usuarios (nombre, correo, password_hash, is_verified)
           VALUES ($1, $2, $3, $4)
           RETURNING *""",
        data.get("nombre"),
        data.get("correo"),
        data.get("password_hash"),
        bool(data.get("is_verified", False)),
    )
    return _doc(row)


async def verificar_usuario(correo: str):
    pool = await get_pool()
    await pool.execute("UPDATE usuarios SET is_verified=TRUE WHERE correo=$1", correo)


async def guardar_codigo_verificacion(correo: str, codigo: str):
    pool = await get_pool()
    await pool.execute(
        "UPDATE usuarios SET codigo_verificacion=$2, intentos_verificacion=0 WHERE correo=$1",
        correo, codigo,
    )


async def incrementar_intento_verificacion(correo: str):
    pool = await get_pool()
    await pool.execute(
        "UPDATE usuarios SET intentos_verificacion=intentos_verificacion+1 WHERE correo=$1",
        correo,
    )


async def limpiar_codigo_verificacion(correo: str):
    pool = await get_pool()
    await pool.execute(
        "UPDATE usuarios SET codigo_verificacion=NULL, intentos_verificacion=0 WHERE correo=$1",
        correo,
    )
