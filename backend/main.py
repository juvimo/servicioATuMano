from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.servicios import router

app = FastAPI(title="Servicio a tu Mano API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def welcome():
    return {"message": "Bienvenido a la API de Servicio a tu Mano"}

app.include_router(router)
