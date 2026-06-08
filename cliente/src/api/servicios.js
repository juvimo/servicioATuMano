// ─────────────────────────────────────────────
//  API CONFIG CENTRAL
//  Si cambia la URL del backend, solo edita aquí
// ─────────────────────────────────────────────
import axios from "axios";

const BASE = "http://127.0.0.1:8000";

// ── Servicios (colección principal del negocio) ──
export const fetchServicios  = ()        => axios.get(`${BASE}/api/servicios`);
export const fetchServicio   = (id)      => axios.get(`${BASE}/api/servicios/${id}`);
export const createServicio  = (data)    => axios.post(`${BASE}/api/servicios`, data);
export const updateServicio  = (id,data) => axios.put(`${BASE}/api/servicios/${id}`, data);
export const deleteServicio  = (id)      => axios.delete(`${BASE}/api/servicios/${id}`);

// ── Cotizaciones ──
export const fetchCotizaciones = ()     => axios.get(`${BASE}/api/cotizaciones`);
export const createCotizacion  = (data) => axios.post(`${BASE}/api/cotizaciones`, data);

// ── Ping general ──
export const ping = () => axios.get(`${BASE}/`);
