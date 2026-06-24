import asyncio
import asyncpg

DATABASE_URL = "postgresql://servicioatumano_db_user:pkcXDUNp0t6uyAeijpBRdDvb6a8F0DGB@dpg-d8ti5krsq97s738123o0-a.oregon-postgres.render.com/servicioatumano_db"

SQL = """
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    completada BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cotizaciones (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT,
    correo TEXT,
    servicio TEXT,
    info TEXT
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    codigo_verificacion TEXT,
    intentos_verificacion INTEGER DEFAULT 0
);
"""

async def main():
    conn = await asyncpg.connect(DATABASE_URL)
    await conn.execute(SQL)
    print("¡Tablas creadas correctamente!")
    await conn.close()

asyncio.run(main())