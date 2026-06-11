import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def verificar():
    cliente = AsyncIOMotorClient("mongodb://localhost")
    db = cliente.servicioatumano
    result = await db.usuarios.update_one(
        {"correo": "unijuanita2007@gmail.com"},
        {"$set": {"is_verified": True}}
    )
    print("Modificados:", result.modified_count)

asyncio.run(verificar())