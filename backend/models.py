from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if v is not None else v)]

# ── Modelo principal: Servicio ──
class Servicio(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    titulo: str
    descripcion: Optional[str] = None
    completada: bool = False

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "json_encoders": {object: str},
    }

class UpdateServicio(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    completada: Optional[bool] = None

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "json_encoders": {object: str},
    }

# ── Modelo: Cotización ──
class Cotizacion(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    nombre: str
    telefono: str
    correo: str
    servicio: str
    info: Optional[str] = None

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "json_encoders": {object: str},
    }
