from motor.motor_asyncio import AsyncIOMotorClient
from models import Servicio, UpdateServicio, Cotizacion
from bson import ObjectId

cliente = AsyncIOMotorClient("mongodb://localhost")
database = cliente.servicioatumano        # nombre de la BD del proyecto
col_servicios   = database.servicios      # colección de servicios
col_cotizaciones = database.cotizaciones  # colección de cotizaciones

# ─────────────────────────────────────────
#  SERVICIOS
# ─────────────────────────────────────────
async def get_todos_servicios():
    servicios = []
    async for doc in col_servicios.find({}):
        doc["_id"] = str(doc["_id"])
        servicios.append(Servicio(**doc))
    return servicios

async def get_servicio_por_id(id: str):
    doc = await col_servicios.find_one({"_id": ObjectId(id)})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def get_servicio_por_titulo(titulo: str):
    return await col_servicios.find_one({"titulo": titulo})

async def create_servicio(data: dict):
    result = await col_servicios.insert_one(data)
    created = await col_servicios.find_one({"_id": result.inserted_id})
    if created:
        created["_id"] = str(created["_id"])
    return created

async def update_servicio(id: str, data):
    campos = data.model_dump(by_alias=True, exclude_none=True)
    campos.pop("_id", None)
    await col_servicios.update_one({"_id": ObjectId(id)}, {"$set": campos})
    doc = await col_servicios.find_one({"_id": ObjectId(id)})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def delete_servicio(id: str):
    await col_servicios.delete_one({"_id": ObjectId(id)})
    return True

# ─────────────────────────────────────────
#  COTIZACIONES
# ─────────────────────────────────────────
async def get_todas_cotizaciones():
    cotizaciones = []
    async for doc in col_cotizaciones.find({}):
        doc["_id"] = str(doc["_id"])
        cotizaciones.append(Cotizacion(**doc))
    return cotizaciones

async def create_cotizacion(data: dict):
    result = await col_cotizaciones.insert_one(data)
    created = await col_cotizaciones.find_one({"_id": result.inserted_id})
    if created:
        created["_id"] = str(created["_id"])
    return created
