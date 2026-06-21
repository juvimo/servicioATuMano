// ─────────────────────────────────────────────
//  CONFIG CENTRAL DE LA API
//  La URL del backend se toma de VITE_API_URL (.env).
//  Si no existe, usa el backend local por defecto.
// ─────────────────────────────────────────────
import axios from "axios";

export const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Instancia con el token de sesión adjunto automáticamente.
export const http = axios.create({ baseURL: BASE });

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
