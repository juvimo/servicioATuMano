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

// ── Datos estáticos de servicios ──
export const SERVICIOS_LIST = [
  { icon: "🏠", slug: "residencial", title: "Limpieza Residencial", description: "Servicio completo para tu hogar, desde cocina hasta dormitorios.", idealFor: ["Casas", "Apartamentos", "Familias"], color: "#16a34a", bgColor: "#dcfce7" },
  { icon: "🏢", slug: "comercial",   title: "Limpieza Comercial",   description: "Mantenimiento profesional de oficinas y locales comerciales.", idealFor: ["Oficinas", "Locales", "Empresas"], color: "#2563eb", bgColor: "#dbeafe" },
  { icon: "💧", slug: "profunda",    title: "Limpieza Profunda",    description: "Eliminación de suciedad acumulada en espacios difíciles.", idealFor: ["Cocinas", "Baños", "Sótanos"], color: "#7c3aed", bgColor: "#ede9fe" },
  { icon: "✨", slug: "post-obra",   title: "Limpieza Post-Obra",   description: "Retiro completo de residuos y polvo tras construcción.", idealFor: ["Obras", "Remodelaciones", "Nuevos inmuebles"], color: "#d97706", bgColor: "#fef3c7" },
  { icon: "💨", slug: "vapor",       title: "Limpieza a Vapor",     description: "Elimina suciedad y bacterias sin químicos agresivos.", idealFor: ["Tapicería", "Colchones", "Tapetes"], color: "#0891b2", bgColor: "#cffafe" },
  { icon: "🛋️", slug: "muebles",    title: "Limpieza de Muebles",  description: "Sofás y tapizados restaurados a su estado original.", idealFor: ["Sofás", "Sillas", "Tapizados"], color: "#be185d", bgColor: "#fce7f3" },
];

export const SERVICIOS_DATA = {
  residencial: { title: "Limpieza Residencial", icon: "🏠", description: "Servicio completo para tu hogar.", idealFor: ["Casas", "Apartamentos"], color: "#16a34a", bgColor: "#dcfce7", beneficios: ["Personal capacitado", "Productos ecológicos", "Horarios flexibles", "Garantía de satisfacción"] },
  comercial:   { title: "Limpieza Comercial",   icon: "🏢", description: "Mantenimiento profesional de oficinas.", idealFor: ["Oficinas", "Locales"], color: "#2563eb", bgColor: "#dbeafe", beneficios: ["Fuera de horario laboral", "Equipos industriales", "Contrato mensual", "Facturación empresarial"] },
  profunda:    { title: "Limpieza Profunda",    icon: "💧", description: "Eliminación de suciedad acumulada.", idealFor: ["Cocinas", "Baños"], color: "#7c3aed", bgColor: "#ede9fe", beneficios: ["Desinfección completa", "Eliminación de bacterias", "Áreas difíciles", "Resultados garantizados"] },
  "post-obra": { title: "Limpieza Post-Obra",   icon: "✨", description: "Retiro de residuos tras construcción.", idealFor: ["Obras", "Remodelaciones"], color: "#d97706", bgColor: "#fef3c7", beneficios: ["Retiro de escombros", "Limpieza de polvo", "Pulido de superficies", "Entrega en 24h"] },
  vapor:       { title: "Limpieza a Vapor",     icon: "💨", description: "Sin químicos agresivos.", idealFor: ["Tapicería", "Colchones"], color: "#0891b2", bgColor: "#cffafe", beneficios: ["Sin químicos", "Elimina ácaros", "Apto alérgicos", "Secado rápido"] },
  muebles:     { title: "Limpieza de Muebles",  icon: "🛋️", description: "Sofás y tapizados restaurados.", idealFor: ["Sofás", "Sillas"], color: "#be185d", bgColor: "#fce7f3", beneficios: ["Elimina manchas", "Restaura colores", "Antiácaros", "Resultados visibles"] },
};