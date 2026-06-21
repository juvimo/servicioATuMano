import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from router.servicios import router
from router.auth import router as auth_router
from router.chatbot import router as chatbot_router

load_dotenv()

app = FastAPI(title="Servicio a tu Mano API")

origenes_env = os.getenv("FRONTEND_URL", "http://localhost:5173,http://localhost:5174")
origenes_permitidos = [o.strip() for o in origenes_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def welcome():
    return {"message": "Bienvenido a la API de Servicio a tu Mano"}

app.include_router(router)
app.include_router(auth_router)
app.include_router(chatbot_router)
