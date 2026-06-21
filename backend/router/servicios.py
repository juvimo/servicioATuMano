from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from models import Servicio, UpdateServicio, Cotizacion
from database import (
    get_todos_servicios, get_servicio_por_id, get_servicio_por_titulo,
    create_servicio, update_servicio, delete_servicio,
    get_todas_cotizaciones, create_cotizacion
)
from security import solo_admin

router = APIRouter()

# ─── SERVICIOS ───────────────────────────────────────

@router.get("/api/servicios")
async def listar_servicios():
    return await get_todos_servicios()

@router.post("/api/servicios")
async def crear_servicio(servicio: Servicio, _admin=Depends(solo_admin)):
    existente = await get_servicio_por_titulo(servicio.titulo)
    if existente:
        raise HTTPException(400, "Ya existe un servicio con ese título.")
    data = servicio.model_dump()
    if data.get("id") is None:
        del data["id"]
    return await create_servicio(data)

@router.get("/api/servicios/{id}", response_model=Servicio)
async def obtener_servicio(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(404, "ID inválido")
    doc = await get_servicio_por_id(id)
    if doc:
        return doc
    raise HTTPException(404, f"Servicio {id} no encontrado")

@router.put("/api/servicios/{id}", response_model=Servicio)
async def actualizar_servicio(id: str, data: UpdateServicio, _admin=Depends(solo_admin)):
    if not ObjectId.is_valid(id):
        raise HTTPException(404, "ID inválido")
    doc = await update_servicio(id, data)
    if doc:
        return doc
    raise HTTPException(404, f"Servicio {id} no encontrado")

@router.delete("/api/servicios/{id}")
async def eliminar_servicio(id: str, _admin=Depends(solo_admin)):
    if not ObjectId.is_valid(id):
        raise HTTPException(404, "ID inválido")
    await delete_servicio(id)
    return {"mensaje": "Servicio eliminado exitosamente"}

# ─── COTIZACIONES ────────────────────────────────────

@router.get("/api/cotizaciones")
async def listar_cotizaciones(_admin=Depends(solo_admin)):
    return await get_todas_cotizaciones()

@router.post("/api/cotizaciones")
async def crear_cotizacion(cotizacion: Cotizacion):
    data = cotizacion.model_dump()
    if data.get("id") is None:
        del data["id"]
    return await create_cotizacion(data)
