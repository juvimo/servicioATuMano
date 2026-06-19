import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { fetchServicios, createServicio, updateServicio, deleteServicio, fetchCotizaciones, createCotizacion } from "../api/servicios";
import { generarInformeExcel } from "../utils/reportes";

/* ─── Iconos SVG ─── */
const Icon = {
  dashboard:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  servicios:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  clientes:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  cotizaciones: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  gastos:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  ingresos:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  logout:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  excel:        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  add:          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  edit:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  search:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

const SECCIONES = [
  { id: "dashboard",    label: "Dashboard",    icon: Icon.dashboard    },
  { id: "servicios",    label: "Servicios",    icon: Icon.servicios    },
  { id: "clientes",     label: "Clientes",     icon: Icon.clientes     },
  { id: "cotizaciones", label: "Cotizaciones", icon: Icon.cotizaciones },
  { id: "gastos",       label: "Gastos",       icon: Icon.gastos       },
  { id: "ingresos",     label: "Ingresos",     icon: Icon.ingresos     },
];

/* ─── Datos demo ─── */
const DEMO_SERVICIOS = [
  { _id:"d1",  completada:true,  titulo:"Vapor de Muebles y Sofás — María García",        descripcion:"📞 321-219-6255 · ✉ maria@email.com · Notas: Sala con 3 sillones grandes, tela beige con manchas de café" },
  { _id:"d2",  completada:true,  titulo:"Limpieza de Colchones — Juan Pérez",              descripcion:"📞 320-555-0202 · ✉ juan@email.com · Notas: 2 colchones dobles + 1 sencillo, 2° piso" },
  { _id:"d3",  completada:true,  titulo:"Desinfección Comercial — Restaurante El Patio",   descripcion:"📞 314-555-0606 · ✉ patio@email.com · Notas: Cocina industrial + 40 sillas tapizadas, servicio nocturno" },
  { _id:"d4",  completada:true,  titulo:"Limpieza de Tapetes — Carlos López",              descripcion:"📞 315-555-0404 · ✉ carlos@email.com · Notas: Tapete persa 3×4 m, manchas de mascota" },
  { _id:"d5",  completada:true,  titulo:"Tapicería de Automóvil — Sandra Ruiz",            descripcion:"📞 318-555-0707 · ✉ sandra@email.com · Notas: Toyota Corolla 2021, olores de cigarrillo y manchas en moqueta" },
  { _id:"d6",  completada:true,  titulo:"Vapor de Muebles y Sofás — Pedro Ramírez",        descripcion:"📞 312-444-0201 · ✉ pedro@email.com · Notas: 2 sofás de 3 puestos, tela gris manchada por uso diario" },
  { _id:"d7",  completada:true,  titulo:"Limpieza de Colchones — Ana Moreno",              descripcion:"📞 317-333-0102 · ✉ ana.moreno@email.com · Notas: Colchón doble + 2 almohadas, cuarto principal" },
  { _id:"d8",  completada:true,  titulo:"Alfombras y Tapetes a Vapor — Diana Castillo",    descripcion:"📞 311-222-0503 · ✉ diana@email.com · Notas: Tapete persa 4×3 m + 2 alfombras pequeñas de habitación" },
  { _id:"d9",  completada:true,  titulo:"Tapicería de Automóvil — Luis Hernández",         descripcion:"📞 316-111-0804 · ✉ luis@email.com · Notas: Mazda CX-5 2020, manchas en asientos delanteros y moqueta" },
  { _id:"d10", completada:true,  titulo:"Desinfección Comercial — Café Central",           descripcion:"📞 304-777-0305 · ✉ admin@cafecentral.com · Notas: Cocina 30 m² + barra y 12 sillas tapizadas, servicio lunes 7AM" },
  { _id:"d11", completada:false, titulo:"Vapor Residencial Integral — Familia Torres",     descripcion:"📞 318-555-0505 · ✉ torres@email.com · Notas: Apartamento 60 m², 2 habitaciones y sala, visita programada" },
  { _id:"d12", completada:false, titulo:"Limpieza Post-Obra — Constructora HG",            descripcion:"📞 301-555-0808 · ✉ hg@constructora.com · Notas: Apartamento 90 m², polvo de cemento y restos de pintura" },
  { _id:"d13", completada:false, titulo:"Limpieza de Baños a Vapor — Hotel Camino Real",   descripcion:"📞 305-888-0607 · ✉ mant@caminoreal.com · Notas: 8 baños de huéspedes, juntas de azulejo con hongos" },
  { _id:"d14", completada:false, titulo:"Desinfección de Baños — Ana Martínez",            descripcion:"📞 300-555-0303 · ✉ ana@email.com · Notas: 3 baños con hongos en juntas, azulejos blancos" },
  { _id:"d15", completada:false, titulo:"Vapor Residencial — Laura Gómez",                 descripcion:"📞 318-555-0504 · ✉ laura@email.com · Notas: Casa 3 habitaciones + jardín, cliente nueva" },
];

const DEMO_COTIZACIONES = [
  { _id: "c1", nombre: "María García",    telefono: "310-555-0101", correo: "maria@email.com",  servicio: "Limpieza Residencial", info: "Casa de 3 habitaciones", fecha: "2026-05-10", estado: "Pendiente" },
  { _id: "c2", nombre: "Juan Pérez",      telefono: "320-555-0202", correo: "juan@email.com",   servicio: "Limpieza Profunda",     info: "Apartamento 60 m²",      fecha: "2026-05-11", estado: "Confirmada" },
  { _id: "c3", nombre: "Ana Martínez",    telefono: "300-555-0303", correo: "ana@email.com",    servicio: "Limpieza Comercial",    info: "Oficina 4 pisos",        fecha: "2026-05-12", estado: "Pendiente" },
  { _id: "c4", nombre: "Carlos López",    telefono: "315-555-0404", correo: "carlos@email.com", servicio: "Limpieza de Tapetes",   info: "Sala y comedor",         fecha: "2026-05-13", estado: "Atendida"  },
  { _id: "c5", nombre: "Laura Gómez",     telefono: "318-555-0505", correo: "laura@email.com",  servicio: "Limpieza a Vapor",      info: "Colchón + sofá",         fecha: "2026-05-14", estado: "Pendiente" },
];

const DEMO_CLIENTES = [
  { _id: "cl1", nombre: "María García",    telefono: "310-555-0101", correo: "maria@email.com",  servicios: 4, total: "$480.000",  ultima: "2026-05-10" },
  { _id: "cl2", nombre: "Juan Pérez",      telefono: "320-555-0202", correo: "juan@email.com",   servicios: 2, total: "$240.000",  ultima: "2026-05-11" },
  { _id: "cl3", nombre: "Ana Martínez",    telefono: "300-555-0303", correo: "ana@email.com",    servicios: 7, total: "$1.050.000",ultima: "2026-05-12" },
  { _id: "cl4", nombre: "Carlos López",    telefono: "315-555-0404", correo: "carlos@email.com", servicios: 1, total: "$120.000",  ultima: "2026-05-13" },
  { _id: "cl5", nombre: "Laura Gómez",     telefono: "318-555-0505", correo: "laura@email.com",  servicios: 3, total: "$360.000",  ultima: "2026-05-14" },
  { _id: "cl6", nombre: "Pedro Sánchez",   telefono: "312-555-0606", correo: "pedro@email.com",  servicios: 5, total: "$600.000",  ultima: "2026-05-15" },
];

const DEMO_GASTOS = [
  { _id: "g1", concepto: "Productos de limpieza",  categoria: "Insumos",      monto: 85000,  fecha: "2026-05-01", nota: "Jabón, cloro, desinfectante" },
  { _id: "g2", concepto: "Transporte empleados",   categoria: "Operativo",    monto: 45000,  fecha: "2026-05-03", nota: "" },
  { _id: "g3", concepto: "Uniformes",              categoria: "Equipamiento", monto: 120000, fecha: "2026-05-05", nota: "4 uniformes nuevos" },
  { _id: "g4", concepto: "Publicidad redes",       categoria: "Marketing",    monto: 60000,  fecha: "2026-05-08", nota: "Pauta Instagram" },
  { _id: "g5", concepto: "Herramientas",           categoria: "Equipamiento", monto: 95000,  fecha: "2026-05-10", nota: "Aspiradora y trapero" },
];

const DEMO_INGRESOS = [
  { _id: "i1", concepto: "Limpieza casa García",   categoria: "Residencial", monto: 150000, fecha: "2026-05-02", nota: "Pago efectivo" },
  { _id: "i2", concepto: "Limpieza oficina TechCo",categoria: "Comercial",   monto: 320000, fecha: "2026-05-04", nota: "Transferencia" },
  { _id: "i3", concepto: "Tapetes López",          categoria: "Tapicería",   monto: 80000,  fecha: "2026-05-06", nota: "" },
  { _id: "i4", concepto: "Limpieza profunda Apt",  categoria: "Residencial", monto: 200000, fecha: "2026-05-09", nota: "Pago app" },
  { _id: "i5", concepto: "Colchones Gómez",        categoria: "Tapicería",   monto: 130000, fecha: "2026-05-11", nota: "Efectivo" },
  { _id: "i6", concepto: "Limpieza mensual Pérez", categoria: "Residencial", monto: 240000, fecha: "2026-05-13", nota: "Contrato" },
];

const CATEGORIAS_GASTO   = ["Insumos", "Operativo", "Equipamiento", "Marketing", "Nómina", "Otro"];
const CATEGORIAS_INGRESO = ["Residencial", "Comercial", "Tapicería", "Vapor", "Otro"];
const CATEGORIAS_CLIENTE_SERVICIO = ["Vapor de Muebles y Sofás","Limpieza de Colchones","Alfombras y Tapetes a Vapor","Tapicería de Automóviles","Limpieza Residencial a Vapor","Limpieza Comercial a Vapor","Limpieza Post-Obra","Desinfección de Baños a Vapor","Vapor Residencial Integral","Desinfección Comercial"];

/* ─── Helpers ─── */
const fmtCOP = (n) => "$" + Number(n).toLocaleString("es-CO");

function exportCSV(data, nombre) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).filter(k => k !== "_id");
  const rows = data.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href = url; a.download = nombre + ".csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ── Badge estado cotización ── */
function BadgeEstado({ estado }) {
  const cfg = {
    Pendiente:  { bg: "#fef9c3", color: "#854d0e", label: "⏳ Pendiente"  },
    Confirmada: { bg: "#dcfce7", color: "#15803d", label: "✓ Confirmada" },
    Atendida:   { bg: "#dbeafe", color: "#1d4ed8", label: "✔ Atendida"  },
  };
  const c = cfg[estado] || cfg.Pendiente;
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 8, padding: "2px 10px", fontSize: ".75rem", fontWeight: 700 }}>
      {c.label}
    </span>
  );
}

/* ── Modal genérico ── */
function Modal({ titulo, onClose, children }) {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
      <div style={{ background:"#fff",borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
          <h5 style={{ fontWeight:800,color:"#0f172a",margin:0 }}>{titulo}</h5>
          <button onClick={onClose} style={{ border:"none",background:"none",fontSize:"1.4rem",cursor:"pointer",color:"#94a3b8",lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Tabla con búsqueda + export ── */
function TablaBase({ titulo, datos, columnas, onExport, onAdd, addLabel, renderFila, busquedaKey }) {
  const [busq, setBusq] = useState("");
  const filtrados = busq
    ? datos.filter(d => (d[busquedaKey] || "").toLowerCase().includes(busq.toLowerCase()))
    : datos;

  return (
    <div className="dash-card">
      <div className="dash-card-header" style={{ flexWrap:"wrap", gap:"0.5rem" }}>
        <h5>{titulo} <span style={{ fontWeight:400,color:"#94a3b8",fontSize:".85rem" }}>({filtrados.length})</span></h5>
        <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8" }}>{Icon.search}</span>
            <input
              value={busq} onChange={e => setBusq(e.target.value)}
              placeholder="Buscar..."
              style={{ paddingLeft:32,paddingRight:12,height:36,borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:".85rem",outline:"none",width:180 }}
            />
          </div>
          <button className="btn btn-sm" onClick={onExport}
            style={{ borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",color:"#334155",display:"flex",alignItems:"center",gap:6,fontWeight:600,fontSize:".82rem" }}>
            {Icon.excel} Exportar CSV
          </button>
          {onAdd && (
            <button className="btn-green btn btn-sm" onClick={onAdd} style={{ borderRadius:10,display:"flex",alignItems:"center",gap:5,fontSize:".85rem" }}>
              {Icon.add} {addLabel}
            </button>
          )}
        </div>
      </div>
      <div className="dash-card-body" style={{ overflowX:"auto" }}>
        <table className="table table-borderless" style={{ minWidth:600 }}>
          <thead>
            <tr>{columnas.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.length === 0
              ? <tr><td colSpan={columnas.length} style={{ textAlign:"center",color:"#94a3b8",padding:"2rem" }}>No hay registros.</td></tr>
              : filtrados.map(renderFila)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COTIZADOR DE COSTOS FLOTANTE
═══════════════════════════════════════ */
const SERVICIOS_VAPOR = [
  { nombre:"Sofá 2 puestos",          precio:85000  },
  { nombre:"Sofá 3 puestos",          precio:120000 },
  { nombre:"Sofá esquinero / L",      precio:190000 },
  { nombre:"Sillón / Poltrona",       precio:55000  },
  { nombre:"Silla comedor (c/u)",     precio:28000  },
  { nombre:"Colchón sencillo",        precio:65000  },
  { nombre:"Colchón doble/queen",     precio:95000  },
  { nombre:"Colchón king",            precio:120000 },
  { nombre:"Tapete hasta 4 m²",       precio:85000  },
  { nombre:"Tapete 4–10 m²",          precio:160000 },
  { nombre:"Automóvil sedán",         precio:190000 },
  { nombre:"SUV / Camioneta",         precio:270000 },
  { nombre:"Limpieza residencial",    precio:300000 },
  { nombre:"Limpieza comercial",      precio:450000 },
  { nombre:"Baño individual",         precio:60000  },
];
const fmtCOP2 = n => "$" + Number(n).toLocaleString("es-CO");

function CotizadorCostos({ onClose }) {
  const [items,    setItems]    = useState([]);
  const [desc,     setDesc]     = useState(0);
  const [iva,      setIva]      = useState(false);
  const [copiado,  setCopiado]  = useState(false);

  const subtotal  = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const descuento = subtotal * (desc / 100);
  const baseIva   = subtotal - descuento;
  const ivaVal    = iva ? baseIva * 0.19 : 0;
  const total     = baseIva + ivaVal;

  const agregar = (srv) => {
    setItems(prev => {
      const ex = prev.find(i => i.nombre === srv.nombre);
      return ex
        ? prev.map(i => i.nombre === srv.nombre ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...srv, qty: 1 }];
    });
  };

  const copiar = () => {
    const lineas = items.map(i => `• ${i.nombre} x${i.qty}: ${fmtCOP2(i.precio * i.qty)}`).join("\n");
    const txt = `COTIZACIÓN - Servicio a tu Mano\n${lineas}\nSubtotal: ${fmtCOP2(subtotal)}${desc ? `\nDescuento ${desc}%: -${fmtCOP2(descuento)}` : ""}${iva ? `\nIVA 19%: ${fmtCOP2(ivaVal)}` : ""}\nTOTAL: ${fmtCOP2(total)}\n\nJuan Pablo: 321 219 6255 | Sandra: 312 527 6445`;
    navigator.clipboard.writeText(txt).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 2000); });
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13 }}>
      <div style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>💰 Cotizador de Costos</span>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", padding:"2px 8px", fontSize:14 }}>×</button>
      </div>
      <div style={{ padding:"10px 12px", maxHeight:380, overflowY:"auto" }}>
        <p style={{ color:"#64748b", fontSize:11, margin:"0 0 8px" }}>Toca un servicio para añadirlo:</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
          {SERVICIOS_VAPOR.map(s => (
            <button key={s.nombre} onClick={() => agregar(s)} style={{
              background:"#fef3c7", border:"1px solid #fde68a", borderRadius:8,
              padding:"4px 9px", fontSize:11, cursor:"pointer", color:"#92400e", fontWeight:600,
            }}>{s.nombre}</button>
          ))}
        </div>
        {items.length > 0 && (
          <>
            <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:8 }}>
              <thead><tr style={{ background:"#f8fafc" }}>
                <th style={{ padding:"4px 6px", textAlign:"left", fontSize:11, color:"#64748b" }}>Ítem</th>
                <th style={{ padding:"4px 6px", textAlign:"center", fontSize:11, color:"#64748b" }}>Qty</th>
                <th style={{ padding:"4px 6px", textAlign:"right", fontSize:11, color:"#64748b" }}>Valor</th>
                <th/>
              </tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.nombre} style={{ borderBottom:"1px solid #f1f5f9" }}>
                    <td style={{ padding:"5px 6px" }}>{i.nombre}</td>
                    <td style={{ textAlign:"center", padding:"5px 6px" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                        <button onClick={() => setItems(p => p.map(x => x.nombre===i.nombre ? {...x,qty:Math.max(1,x.qty-1)} : x))} style={{ width:20,height:20,borderRadius:4,border:"1px solid #e2e8f0",background:"#f1f5f9",cursor:"pointer",fontSize:13,lineHeight:1 }}>−</button>
                        <span style={{ fontWeight:700 }}>{i.qty}</span>
                        <button onClick={() => agregar(i)} style={{ width:20,height:20,borderRadius:4,border:"1px solid #e2e8f0",background:"#f1f5f9",cursor:"pointer",fontSize:13,lineHeight:1 }}>+</button>
                      </div>
                    </td>
                    <td style={{ textAlign:"right", fontWeight:700, color:"#0f172a", padding:"5px 6px" }}>{fmtCOP2(i.precio*i.qty)}</td>
                    <td style={{ padding:"5px 6px" }}>
                      <button onClick={() => setItems(p => p.filter(x => x.nombre!==i.nombre))} style={{ background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,lineHeight:1 }}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center", flexWrap:"wrap" }}>
              <label style={{ fontSize:11, color:"#64748b", display:"flex", alignItems:"center", gap:4 }}>
                Descuento %:
                <input type="number" min={0} max={100} value={desc} onChange={e=>setDesc(Number(e.target.value))}
                  style={{ width:52,borderRadius:7,border:"1.5px solid #e2e8f0",padding:"3px 6px",fontSize:12,outline:"none" }} />
              </label>
              <label style={{ fontSize:11, color:"#64748b", display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>
                <input type="checkbox" checked={iva} onChange={e=>setIva(e.target.checked)} /> IVA 19%
              </label>
            </div>
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"8px 12px", marginBottom:8, fontSize:12 }}>
              {desc > 0 && <div style={{ display:"flex",justifyContent:"space-between",color:"#64748b" }}><span>Subtotal</span><span>{fmtCOP2(subtotal)}</span></div>}
              {desc > 0 && <div style={{ display:"flex",justifyContent:"space-between",color:"#dc2626" }}><span>Descuento {desc}%</span><span>-{fmtCOP2(descuento)}</span></div>}
              {iva && <div style={{ display:"flex",justifyContent:"space-between",color:"#64748b" }}><span>IVA 19%</span><span>{fmtCOP2(ivaVal)}</span></div>}
              <div style={{ display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:14,color:"#0f172a",borderTop:"1px solid #e2e8f0",marginTop:4,paddingTop:4 }}>
                <span>TOTAL</span><span style={{ color:"#d97706" }}>{fmtCOP2(total)}</span>
              </div>
            </div>
            <button onClick={copiar} style={{
              width:"100%", borderRadius:10, border:"none", padding:"8px",
              background: copiado ? "#16a34a" : "#f59e0b", color:"#fff",
              fontWeight:700, cursor:"pointer", fontSize:13, transition:"background .2s",
            }}>{copiado ? "✅ ¡Copiado!" : "📋 Copiar cotización"}</button>
            <button onClick={() => setItems([])} style={{ width:"100%",marginTop:5,borderRadius:10,border:"1px solid #e2e8f0",padding:"6px",background:"#fff",color:"#94a3b8",cursor:"pointer",fontSize:12 }}>Limpiar</button>
          </>
        )}
        {items.length === 0 && (
          <div style={{ textAlign:"center",color:"#94a3b8",padding:"20px 0",fontSize:12 }}>
            Selecciona servicios arriba para cotizar
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════ */
function Dashboard() {
  const [seccion,    setSeccion]   = useState("dashboard");
  const [servicios,  setServicios] = useState([]);
  const [loadingT,   setLoadingT]  = useState(true);
  const [demoMode,   setDemoMode]  = useState(false);
  const [alerta,     setAlerta]    = useState({ msg: "", tipo: "" });

  /* Servicios form */
  const [fTitulo,     setFTitulo]     = useState("");
  const [fDesc,       setFDesc]       = useState("");
  const [fCliente,    setFCliente]    = useState("");
  const [fCompletada, setFCompletada] = useState(false);
  const [calcOpen,    setCalcOpen]    = useState(false);

  /* Cotizaciones */
  const [cotizaciones, setCotizaciones] = useState(DEMO_COTIZACIONES);
  const [modalCot,     setModalCot]     = useState(null); // null | objeto

  /* Clientes */
  const [clientes,    setClientes]    = useState(DEMO_CLIENTES);
  const [modalCliente,setModalCliente]= useState(null);
  const [formCliente, setFormCliente] = useState({ nombre:"",telefono:"",correo:"",servicios:0,total:"",ultima:"" });

  /* Gastos */
  const [gastos,    setGastos]    = useState(DEMO_GASTOS);
  const [modalGasto,setModalGasto]= useState(null);
  const [formGasto, setFormGasto] = useState({ concepto:"",categoria:"Insumos",monto:"",fecha:"",nota:"" });

  /* Ingresos */
  const [ingresos,    setIngresos]    = useState(DEMO_INGRESOS);
  const [modalIngreso,setModalIngreso]= useState(null);
  const [formIngreso, setFormIngreso] = useState({ concepto:"",categoria:"Residencial",monto:"",fecha:"",nota:"" });

  /* Informe Excel */
  const [modalInforme, setModalInforme] = useState(false);
  const [seccionesInforme, setSeccionesInforme] = useState({
    resumen: true, ingresos: true, gastos: true,
    cotizaciones: true, clientes: true, servicios: true,
  });

  const navigate = useNavigate();
  const usuario  = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  useEffect(() => {
    if (!usuario.correo && !usuario.email) navigate("/login");
  }, []);

  useEffect(() => {
    if (seccion === "dashboard" || seccion === "servicios") cargarServicios();
  }, [seccion]);

  const cargarServicios = async () => {
    setLoadingT(true);
    try {
      const res = await fetchServicios();
      setServicios(res.data);
      setDemoMode(false);
    } catch {
      setDemoMode(true);
      setServicios(DEMO_SERVICIOS);
    } finally { setLoadingT(false); }
  };

  const mostrarAlerta = (msg, tipo = "danger") => {
    setAlerta({ msg, tipo });
    setTimeout(() => setAlerta({ msg: "", tipo: "" }), 3500);
  };

  const agregarServicio = async () => {
    if (!fTitulo.trim()) { mostrarAlerta("El título es obligatorio."); return; }
    const titulo = fCliente.trim() ? `${fTitulo.trim()} — ${fCliente.trim()}` : fTitulo.trim();
    const descripcion = fCliente.trim()
      ? `📞 ${fCliente.trim()}${fDesc.trim() ? " · " + fDesc.trim() : ""}`
      : fDesc.trim();
    try {
      if (demoMode) {
        setServicios(prev => [{ _id:"new-"+Date.now(), titulo, descripcion, completada: fCompletada }, ...prev]);
      } else {
        await createServicio({ titulo, descripcion, completada: fCompletada });
        cargarServicios();
      }
      setFTitulo(""); setFDesc(""); setFCliente(""); setFCompletada(false);
      mostrarAlerta(fCompletada ? "Servicio completado registrado." : "Servicio agregado.", "success");
    } catch (err) { mostrarAlerta("Error: " + err.message); }
  };

  const aceptarCotizacion = async (cot) => {
    const titulo = `${cot.servicio} — ${cot.nombre}`;
    const descripcion = `📞 ${cot.telefono} · ✉ ${cot.correo}${cot.info ? ` · Notas: ${cot.info}` : ""}`;
    try {
      if (demoMode) {
        setServicios(prev => [{ _id:"gen-"+Date.now(), titulo, descripcion, completada:false }, ...prev]);
      } else {
        await createServicio({ titulo, descripcion, completada: false });
        cargarServicios();
      }
      setCotizaciones(prev => prev.map(c => c._id === cot._id ? { ...c, estado:"Atendida" } : c));
      mostrarAlerta(`Cotización de ${cot.nombre} convertida en servicio.`, "success");
      setSeccion("servicios");
    } catch (err) { mostrarAlerta("Error al crear servicio: " + err.message); }
  };

  const toggleCompletar = async (id, actual) => {
    if (demoMode) {
      setServicios(prev => prev.map(s => s._id === id ? { ...s, completada: !actual } : s));
      return;
    }
    try { await updateServicio(id, { completada: !actual }); cargarServicios(); }
    catch (err) { mostrarAlerta("Error: " + err.message); }
  };

  const eliminarServicio = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    if (demoMode) { setServicios(prev => prev.filter(s => s._id !== id)); return; }
    try { await deleteServicio(id); cargarServicios(); }
    catch (err) { mostrarAlerta("Error: " + err.message); }
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario");
    navigate("/");
  };

  const emailInicial = (usuario.correo || usuario.email || "A")[0].toUpperCase();

  /* ── Resumen ── */
  const totalIngresos = ingresos.reduce((s, i) => s + Number(i.monto), 0);
  const totalGastos   = gastos.reduce((s, g) => s + Number(g.monto), 0);
  const utilidad      = totalIngresos - totalGastos;
  const completados   = servicios.filter(s => s.completada).length;
  const cotPendientes = cotizaciones.filter(c => c.estado === "Pendiente").length;

  const statCards = [
    { label: "Ingresos del Mes",     valor: fmtCOP(totalIngresos), icon: "💰", bg: "#dcfce7", color: "#15803d" },
    { label: "Gastos del Mes",       valor: fmtCOP(totalGastos),   icon: "📉", bg: "#fee2e2", color: "#b91c1c" },
    { label: "Utilidad Neta",        valor: fmtCOP(utilidad),      icon: "📊", bg: "#f0fdf4", color: "#166534" },
    { label: "Servicios Completados",valor: completados,            icon: "✅", bg: "#dbeafe", color: "#1d4ed8" },
    { label: "Cotizaciones Pendientes",valor: cotPendientes,        icon: "📄", bg: "#fef9c3", color: "#854d0e" },
    { label: "Clientes Registrados", valor: clientes.length,       icon: "👥", bg: "#f3e8ff", color: "#7c3aed" },
  ];

  /* ── Helpers CRUD ── */
  /* Cotizaciones */
  const guardarCotizacion = (cot) => {
    if (cot._id) {
      setCotizaciones(prev => prev.map(c => c._id === cot._id ? cot : c));
    } else {
      setCotizaciones(prev => [...prev, { ...cot, _id: "c" + Date.now(), fecha: new Date().toISOString().slice(0,10) }]);
    }
    setModalCot(null);
    mostrarAlerta("Cotización guardada.", "success");
  };
  const eliminarCotizacion = (id) => {
    if (!window.confirm("¿Eliminar cotización?")) return;
    setCotizaciones(prev => prev.filter(c => c._id !== id));
  };

  /* Clientes */
  const guardarCliente = () => {
    if (!formCliente.nombre.trim()) { mostrarAlerta("Nombre obligatorio."); return; }
    if (formCliente._id) {
      setClientes(prev => prev.map(c => c._id === formCliente._id ? formCliente : c));
    } else {
      setClientes(prev => [...prev, { ...formCliente, _id: "cl" + Date.now() }]);
    }
    setModalCliente(null);
    setFormCliente({ nombre:"",telefono:"",correo:"",servicios:0,total:"",ultima:"" });
    mostrarAlerta("Cliente guardado.", "success");
  };
  const eliminarCliente = (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    setClientes(prev => prev.filter(c => c._id !== id));
  };

  /* Gastos */
  const guardarGasto = () => {
    if (!formGasto.concepto.trim() || !formGasto.monto) { mostrarAlerta("Concepto y monto obligatorios."); return; }
    if (formGasto._id) {
      setGastos(prev => prev.map(g => g._id === formGasto._id ? formGasto : g));
    } else {
      setGastos(prev => [...prev, { ...formGasto, _id: "g" + Date.now(), monto: Number(formGasto.monto) }]);
    }
    setModalGasto(null);
    setFormGasto({ concepto:"",categoria:"Insumos",monto:"",fecha:"",nota:"" });
    mostrarAlerta("Gasto registrado.", "success");
  };
  const eliminarGasto = (id) => {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    setGastos(prev => prev.filter(g => g._id !== id));
  };

  /* Ingresos */
  const guardarIngreso = () => {
    if (!formIngreso.concepto.trim() || !formIngreso.monto) { mostrarAlerta("Concepto y monto obligatorios."); return; }
    if (formIngreso._id) {
      setIngresos(prev => prev.map(i => i._id === formIngreso._id ? formIngreso : i));
    } else {
      setIngresos(prev => [...prev, { ...formIngreso, _id: "i" + Date.now(), monto: Number(formIngreso.monto) }]);
    }
    setModalIngreso(null);
    setFormIngreso({ concepto:"",categoria:"Residencial",monto:"",fecha:"",nota:"" });
    mostrarAlerta("Ingreso registrado.", "success");
  };
  const eliminarIngreso = (id) => {
    if (!window.confirm("¿Eliminar este ingreso?")) return;
    setIngresos(prev => prev.filter(i => i._id !== id));
  };

  /* ── Estilos inline extras ── */
  const inputStyle = { borderRadius:10,border:"1.5px solid #e2e8f0",padding:"8px 12px",fontSize:".875rem",width:"100%",outline:"none" };
  const labelStyle = { fontSize:".8rem",fontWeight:600,color:"#374151",display:"block",marginBottom:4 };
  const btnSm = { borderRadius:8,fontSize:".8rem",padding:"4px 10px",border:"none",cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",gap:4 };

  return (
    <div style={{ display: "flex" }}>

      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo-area">
          <div className="d-flex align-items-center gap-2">
            <img src={logo} style={{ width: 32, borderRadius: 8 }} alt="logo" />
            <div>
              <strong>Servicio a tu Mano</strong>
              <small>Panel Admin</small>
            </div>
          </div>
        </div>

        <div className="nav-section-label">Menú principal</div>
        <ul className="list-unstyled px-0 mb-0">
          {SECCIONES.map(s => (
            <li key={s.id} className={`nav-item${seccion === s.id ? " active" : ""}`} onClick={() => setSeccion(s.id)}>
              {s.icon} {s.label}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button className="logout" onClick={cerrarSesion}>{Icon.logout} Cerrar Sesión</button>
        </div>
      </aside>

      {/* ─── CONTENIDO ─── */}
      <main className="dash-content">

        {/* TOP BAR */}
        <div className="topbar">
          <p className="topbar-title">{seccion}</p>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setModalInforme(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 16px", borderRadius: 10,
                border: "1.5px solid #0ea5e9",
                background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
                color: "#fff", fontWeight: 700, fontSize: ".82rem",
                cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(14,165,233,.3)",
              }}
            >
              {Icon.excel} Informe Excel
            </button>
            <div className="topbar-user">
              <strong>Administrador</strong>
              <small>{usuario.correo || usuario.email || "admin@servicioatumano.com"}</small>
            </div>
            <div className="avatar">{emailInicial}</div>
          </div>
        </div>

        {/* Alertas */}
        {alerta.msg && (
          <div className={`alert alert-${alerta.tipo} mb-3`} style={{ borderRadius: 12, fontSize: ".875rem" }}>
            {alerta.msg}
          </div>
        )}
        {demoMode && (
          <div className="alert alert-warning mb-3" style={{ borderRadius: 12, fontSize: ".875rem" }}>
            ⚠ Backend no conectado — mostrando datos de ejemplo. Ejecuta <code>python -m uvicorn main:app --reload</code>
          </div>
        )}

        {/* ══════════════════════════════════
            SECCIÓN: DASHBOARD PRINCIPAL
        ══════════════════════════════════ */}
        {seccion === "dashboard" && (
          <>
            {/* Stat cards */}
            <div className="row g-3 mb-4">
              {statCards.map(c => (
                <div className="col-sm-6 col-xl-4" key={c.label}>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
                    <p className="stat-label">{c.label}</p>
                    <p className="stat-value">{c.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dos columnas: servicios recientes + cotizaciones recientes */}
            <div className="row g-3 mb-3">
              <div className="col-lg-7">
                <div className="dash-card" style={{ height:"100%" }}>
                  <div className="dash-card-header">
                    <h5>Servicios Recientes</h5>
                    <button className="btn-green btn btn-sm" onClick={() => setSeccion("servicios")} style={{ borderRadius:10,fontSize:".82rem" }}>
                      + Nuevo
                    </button>
                  </div>
                  <div className="dash-card-body">
                    <table className="table table-borderless">
                      <thead><tr><th>Servicio</th><th>Fecha</th><th>Estado</th></tr></thead>
                      <tbody>
                        {servicios.slice(0, 5).map(s => (
                          <tr key={s._id}>
                            <td style={{ fontWeight:600 }}>{s.titulo}</td>
                            <td style={{ color:"#64748b",fontSize:".85rem" }}>{s.descripcion || "—"}</td>
                            <td>
                              <span className={`badge ${s.completada ? "bg-success" : "bg-warning text-dark"}`} style={{ borderRadius:8,fontWeight:600,fontSize:".73rem" }}>
                                {s.completada ? "✓ Completado" : "⏳ Pendiente"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="dash-card" style={{ height:"100%" }}>
                  <div className="dash-card-header">
                    <h5>Últimas Cotizaciones</h5>
                    <button className="btn btn-sm" onClick={() => setSeccion("cotizaciones")}
                      style={{ borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",color:"#334155",fontSize:".82rem",fontWeight:600 }}>
                      Ver todas
                    </button>
                  </div>
                  <div className="dash-card-body">
                    <table className="table table-borderless">
                      <thead><tr><th>Cliente</th><th>Servicio</th><th>Estado</th></tr></thead>
                      <tbody>
                        {cotizaciones.slice(0, 5).map(c => (
                          <tr key={c._id}>
                            <td style={{ fontWeight:600,fontSize:".875rem" }}>{c.nombre}</td>
                            <td style={{ color:"#64748b",fontSize:".82rem" }}>{c.servicio}</td>
                            <td><BadgeEstado estado={c.estado} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen financiero */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h5>Resumen Financiero del Mes</h5>
                <div style={{ display:"flex",gap:"0.5rem" }}>
                  <button className="btn btn-sm" onClick={() => setSeccion("ingresos")} style={{ borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",color:"#334155",fontSize:".82rem",fontWeight:600 }}>Ingresos</button>
                  <button className="btn btn-sm" onClick={() => setSeccion("gastos")} style={{ borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",color:"#334155",fontSize:".82rem",fontWeight:600 }}>Gastos</button>
                </div>
              </div>
              <div className="dash-card-body">
                <div className="row g-3">
                  {/* Últimos ingresos */}
                  <div className="col-md-6">
                    <p style={{ fontWeight:700,color:"#15803d",fontSize:".9rem",marginBottom:"0.75rem" }}>💰 Últimos Ingresos</p>
                    <table className="table table-borderless" style={{ fontSize:".85rem" }}>
                      <tbody>
                        {ingresos.slice(0,4).map(i => (
                          <tr key={i._id}>
                            <td style={{ color:"#374151",fontWeight:500 }}>{i.concepto}</td>
                            <td style={{ color:"#15803d",fontWeight:700,textAlign:"right" }}>{fmtCOP(i.monto)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Últimos gastos */}
                  <div className="col-md-6">
                    <p style={{ fontWeight:700,color:"#b91c1c",fontSize:".9rem",marginBottom:"0.75rem" }}>📉 Últimos Gastos</p>
                    <table className="table table-borderless" style={{ fontSize:".85rem" }}>
                      <tbody>
                        {gastos.slice(0,4).map(g => (
                          <tr key={g._id}>
                            <td style={{ color:"#374151",fontWeight:500 }}>{g.concepto}</td>
                            <td style={{ color:"#b91c1c",fontWeight:700,textAlign:"right" }}>{fmtCOP(g.monto)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Barra utilidad */}
                <div style={{ marginTop:"1rem",padding:"1rem",background:"#f0fdf4",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem" }}>
                  <div>
                    <span style={{ fontWeight:600,color:"#166534",fontSize:".85rem" }}>Utilidad Neta del Mes</span>
                    <br /><small style={{ color:"#64748b",fontSize:".78rem" }}>Ingresos − Gastos</small>
                  </div>
                  <span style={{ fontWeight:800,fontSize:"1.3rem",color: utilidad >= 0 ? "#15803d" : "#b91c1c" }}>
                    {utilidad >= 0 ? "+" : ""}{fmtCOP(utilidad)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════
            SECCIÓN: SERVICIOS
        ══════════════════════════════════ */}
        {seccion === "servicios" && (
          <>
            <div className="add-form-card" style={{ background: fCompletada ? "#f0fdf4" : "#fff", borderColor: fCompletada ? "#86efac" : "#e2e8f0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
                <h5 style={{ margin:0 }}>{fCompletada ? "✅ Registrar Servicio Completado" : "➕ Agregar Nuevo Servicio"}</h5>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none" }}>
                  <span style={{ fontSize:".82rem", color:"#64748b" }}>¿Ya se realizó?</span>
                  <div onClick={() => setFCompletada(p => !p)} style={{
                    width:42, height:24, borderRadius:12, background: fCompletada ? "#16a34a" : "#cbd5e1",
                    position:"relative", transition:"background .2s", cursor:"pointer", flexShrink:0,
                  }}>
                    <div style={{
                      position:"absolute", top:3, left: fCompletada ? 21 : 3,
                      width:18, height:18, borderRadius:"50%", background:"#fff",
                      transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)",
                    }}/>
                  </div>
                </label>
              </div>
              <div className="row g-2">
                <div className="col-md-4">
                  <select className="form-select" value={fTitulo} onChange={e => setFTitulo(e.target.value)}>
                    <option value="">— Tipo de servicio —</option>
                    {CATEGORIAS_CLIENTE_SERVICIO.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Nombre del cliente" value={fCliente} onChange={e => setFCliente(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Notas (tel, dirección…)" value={fDesc} onChange={e => setFDesc(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn-green btn w-100" style={{ background: fCompletada ? "#15803d" : undefined }} onClick={agregarServicio}>
                    {fCompletada ? "✅ Guardar" : "+ Agregar"}
                  </button>
                </div>
              </div>
            </div>

            <TablaBase
              titulo="Lista de Servicios"
              datos={servicios}
              columnas={["Título", "Descripción", "Estado", "Acciones"]}
              busquedaKey="titulo"
              onExport={() => exportCSV(servicios.map(s => ({ titulo:s.titulo, descripcion:s.descripcion, estado:s.completada?"Completado":"Pendiente" })), "servicios")}
              renderFila={s => {
                const deCot = s.descripcion?.startsWith("📞") || s.titulo?.includes(" — ");
                return (
                  <tr key={s._id}>
                    <td style={{ fontWeight:600 }}>{s.titulo}</td>
                    <td style={{ fontSize:".82rem",color:"#64748b",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.descripcion || "—"}</td>
                    <td>
                      <span style={{
                        borderRadius:8, padding:"2px 10px", fontSize:".73rem", fontWeight:700,
                        background: s.completada ? "#dcfce7" : deCot ? "#dbeafe" : "#fef9c3",
                        color:      s.completada ? "#15803d" : deCot ? "#1d4ed8" : "#854d0e",
                      }}>
                        {s.completada ? "✅ Completado" : deCot ? "🔄 En proceso" : "📋 Catálogo"}
                      </span>
                    </td>
                    <td style={{ display:"flex",gap:6 }}>
                      <button style={{ ...btnSm, background:s.completada?"#f1f5f9":"#dcfce7", color:s.completada?"#64748b":"#15803d" }}
                        onClick={() => toggleCompletar(s._id, s.completada)}>
                        {Icon.check} {s.completada ? "Reabrir" : "Completar"}
                      </button>
                      <button style={{ ...btnSm, background:"#fee2e2",color:"#b91c1c" }} onClick={() => eliminarServicio(s._id)}>
                        {Icon.trash} Eliminar
                      </button>
                    </td>
                  </tr>
                );
              }}
            />
          </>
        )}

        {/* ══════════════════════════════════
            SECCIÓN: COTIZACIONES
        ══════════════════════════════════ */}
        {seccion === "cotizaciones" && (
          <>
            <TablaBase
              titulo="Solicitudes de Cotización"
              datos={cotizaciones}
              columnas={["Cliente", "Teléfono", "Correo", "Servicio", "Info", "Fecha", "Estado", "Acciones"]}
              busquedaKey="nombre"
              onExport={() => exportCSV(cotizaciones.map(c => ({ nombre:c.nombre,telefono:c.telefono,correo:c.correo,servicio:c.servicio,info:c.info,fecha:c.fecha,estado:c.estado })), "cotizaciones")}
              onAdd={() => setModalCot({ nombre:"",telefono:"",correo:"",servicio:"",info:"",fecha:new Date().toISOString().slice(0,10),estado:"Pendiente" })}
              addLabel="Nueva Cotización"
              renderFila={c => (
                <tr key={c._id}>
                  <td style={{ fontWeight:700 }}>{c.nombre}</td>
                  <td style={{ fontSize:".85rem" }}>{c.telefono}</td>
                  <td style={{ fontSize:".85rem",color:"#64748b" }}>{c.correo}</td>
                  <td style={{ fontSize:".85rem" }}>{c.servicio}</td>
                  <td style={{ fontSize:".82rem",color:"#94a3b8",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.info || "—"}</td>
                  <td style={{ fontSize:".82rem" }}>{c.fecha}</td>
                  <td><BadgeEstado estado={c.estado} /></td>
                  <td style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                    {c.estado !== "Atendida" && (
                      <button style={{ ...btnSm, background:"#dcfce7",color:"#15803d",fontWeight:700 }}
                        title="Aceptar y convertir en servicio"
                        onClick={() => aceptarCotizacion(c)}>
                        {Icon.check} Aceptar
                      </button>
                    )}
                    <button style={{ ...btnSm, background:"#dbeafe",color:"#1d4ed8" }} onClick={() => setModalCot(c)}>{Icon.edit} Editar</button>
                    <button style={{ ...btnSm, background:"#fee2e2",color:"#b91c1c" }} onClick={() => eliminarCotizacion(c._id)}>{Icon.trash}</button>
                  </td>
                </tr>
              )}
            />
            <div style={{ marginTop:"0.75rem",display:"flex",gap:"1rem",flexWrap:"wrap" }}>
              <Link to="/cotizacion" className="btn-green btn btn-sm" style={{ borderRadius:10,fontSize:".85rem" }}>
                + Formulario público de cotización
              </Link>
            </div>
          </>
        )}

        {/* ══════════════════════════════════
            SECCIÓN: CLIENTES
        ══════════════════════════════════ */}
        {seccion === "clientes" && (
          <TablaBase
            titulo="Clientes Registrados"
            datos={clientes}
            columnas={["Nombre", "Teléfono", "Correo", "Servicios", "Total Pagado", "Última Visita", "Acciones"]}
            busquedaKey="nombre"
            onExport={() => exportCSV(clientes.map(c => ({ nombre:c.nombre,telefono:c.telefono,correo:c.correo,servicios:c.servicios,total:c.total,ultima:c.ultima })), "clientes")}
            onAdd={() => { setFormCliente({ nombre:"",telefono:"",correo:"",servicios:0,total:"",ultima:"" }); setModalCliente(true); }}
            addLabel="Nuevo Cliente"
            renderFila={c => (
              <tr key={c._id}>
                <td style={{ fontWeight:700 }}>{c.nombre}</td>
                <td style={{ fontSize:".85rem" }}>{c.telefono}</td>
                <td style={{ fontSize:".85rem",color:"#64748b" }}>{c.correo}</td>
                <td style={{ textAlign:"center" }}>
                  <span style={{ background:"#dbeafe",color:"#1d4ed8",borderRadius:8,padding:"2px 10px",fontWeight:700,fontSize:".8rem" }}>{c.servicios}</span>
                </td>
                <td style={{ fontWeight:700,color:"#15803d" }}>{c.total}</td>
                <td style={{ fontSize:".82rem",color:"#94a3b8" }}>{c.ultima}</td>
                <td style={{ display:"flex",gap:5 }}>
                  <button style={{ ...btnSm,background:"#dbeafe",color:"#1d4ed8" }}
                    onClick={() => { setFormCliente(c); setModalCliente(true); }}>
                    {Icon.edit}
                  </button>
                  <button style={{ ...btnSm,background:"#fee2e2",color:"#b91c1c" }} onClick={() => eliminarCliente(c._id)}>{Icon.trash}</button>
                </td>
              </tr>
            )}
          />
        )}

        {/* ══════════════════════════════════
            SECCIÓN: GASTOS
        ══════════════════════════════════ */}
        {seccion === "gastos" && (
          <>
            {/* Resumen gastos por categoría */}
            <div className="row g-3 mb-3">
              {["Insumos","Operativo","Equipamiento","Marketing"].map(cat => {
                const total = gastos.filter(g => g.categoria === cat).reduce((s,g) => s + Number(g.monto),0);
                return (
                  <div className="col-sm-6 col-xl-3" key={cat}>
                    <div className="stat-card">
                      <div className="stat-icon" style={{ background:"#fee2e2",color:"#b91c1c" }}>💸</div>
                      <p className="stat-label">{cat}</p>
                      <p className="stat-value" style={{ color:"#b91c1c" }}>{fmtCOP(total)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <TablaBase
              titulo="Registro de Gastos"
              datos={gastos}
              columnas={["Concepto", "Categoría", "Monto", "Fecha", "Nota", "Acciones"]}
              busquedaKey="concepto"
              onExport={() => exportCSV(gastos.map(g => ({ concepto:g.concepto,categoria:g.categoria,monto:g.monto,fecha:g.fecha,nota:g.nota })), "gastos")}
              onAdd={() => { setFormGasto({ concepto:"",categoria:"Insumos",monto:"",fecha:new Date().toISOString().slice(0,10),nota:"" }); setModalGasto(true); }}
              addLabel="Registrar Gasto"
              renderFila={g => (
                <tr key={g._id}>
                  <td style={{ fontWeight:600 }}>{g.concepto}</td>
                  <td>
                    <span style={{ background:"#fef3c7",color:"#92400e",borderRadius:8,padding:"2px 8px",fontSize:".78rem",fontWeight:600 }}>{g.categoria}</span>
                  </td>
                  <td style={{ fontWeight:700,color:"#b91c1c" }}>{fmtCOP(g.monto)}</td>
                  <td style={{ fontSize:".82rem",color:"#64748b" }}>{g.fecha}</td>
                  <td style={{ fontSize:".82rem",color:"#94a3b8" }}>{g.nota || "—"}</td>
                  <td style={{ display:"flex",gap:5 }}>
                    <button style={{ ...btnSm,background:"#dbeafe",color:"#1d4ed8" }}
                      onClick={() => { setFormGasto(g); setModalGasto(true); }}>{Icon.edit}</button>
                    <button style={{ ...btnSm,background:"#fee2e2",color:"#b91c1c" }} onClick={() => eliminarGasto(g._id)}>{Icon.trash}</button>
                  </td>
                </tr>
              )}
            />

            {/* Total */}
            <div style={{ marginTop:"0.75rem",padding:"1rem 1.5rem",background:"#fee2e2",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontWeight:700,color:"#7f1d1d" }}>Total Gastos del Mes</span>
              <span style={{ fontWeight:800,fontSize:"1.2rem",color:"#b91c1c" }}>{fmtCOP(totalGastos)}</span>
            </div>
          </>
        )}

        {/* ══════════════════════════════════
            SECCIÓN: INGRESOS
        ══════════════════════════════════ */}
        {seccion === "ingresos" && (
          <>
            {/* Resumen ingresos por categoría */}
            <div className="row g-3 mb-3">
              {["Residencial","Comercial","Tapicería"].map(cat => {
                const total = ingresos.filter(i => i.categoria === cat).reduce((s,i) => s + Number(i.monto),0);
                return (
                  <div className="col-sm-6 col-xl-4" key={cat}>
                    <div className="stat-card">
                      <div className="stat-icon" style={{ background:"#dcfce7",color:"#15803d" }}>💰</div>
                      <p className="stat-label">{cat}</p>
                      <p className="stat-value" style={{ color:"#15803d" }}>{fmtCOP(total)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <TablaBase
              titulo="Registro de Ingresos"
              datos={ingresos}
              columnas={["Concepto", "Categoría", "Monto", "Fecha", "Nota", "Acciones"]}
              busquedaKey="concepto"
              onExport={() => exportCSV(ingresos.map(i => ({ concepto:i.concepto,categoria:i.categoria,monto:i.monto,fecha:i.fecha,nota:i.nota })), "ingresos")}
              onAdd={() => { setFormIngreso({ concepto:"",categoria:"Residencial",monto:"",fecha:new Date().toISOString().slice(0,10),nota:"" }); setModalIngreso(true); }}
              addLabel="Registrar Ingreso"
              renderFila={i => (
                <tr key={i._id}>
                  <td style={{ fontWeight:600 }}>{i.concepto}</td>
                  <td>
                    <span style={{ background:"#dcfce7",color:"#166534",borderRadius:8,padding:"2px 8px",fontSize:".78rem",fontWeight:600 }}>{i.categoria}</span>
                  </td>
                  <td style={{ fontWeight:700,color:"#15803d" }}>{fmtCOP(i.monto)}</td>
                  <td style={{ fontSize:".82rem",color:"#64748b" }}>{i.fecha}</td>
                  <td style={{ fontSize:".82rem",color:"#94a3b8" }}>{i.nota || "—"}</td>
                  <td style={{ display:"flex",gap:5 }}>
                    <button style={{ ...btnSm,background:"#dbeafe",color:"#1d4ed8" }}
                      onClick={() => { setFormIngreso(i); setModalIngreso(true); }}>{Icon.edit}</button>
                    <button style={{ ...btnSm,background:"#fee2e2",color:"#b91c1c" }} onClick={() => eliminarIngreso(i._id)}>{Icon.trash}</button>
                  </td>
                </tr>
              )}
            />

            {/* Total */}
            <div style={{ marginTop:"0.75rem",padding:"1rem 1.5rem",background:"#dcfce7",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontWeight:700,color:"#14532d" }}>Total Ingresos del Mes</span>
              <span style={{ fontWeight:800,fontSize:"1.2rem",color:"#15803d" }}>{fmtCOP(totalIngresos)}</span>
            </div>
          </>
        )}

      </main>

      {/* ══════════════════════════════════
          MODALES
      ══════════════════════════════════ */}

      {/* Modal Cotización */}
      {modalCot && (
        <Modal titulo={modalCot._id ? "Editar Cotización" : "Nueva Cotización"} onClose={() => setModalCot(null)}>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
            {[["nombre","Nombre del cliente"],["telefono","Teléfono"],["correo","Correo"],["info","Información adicional"]].map(([k,lbl]) => (
              <div key={k}>
                <label style={labelStyle}>{lbl}</label>
                <input style={inputStyle} value={modalCot[k] || ""} onChange={e => setModalCot(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Servicio</label>
              <select style={inputStyle} value={modalCot.servicio} onChange={e => setModalCot(p => ({ ...p, servicio: e.target.value }))}>
                <option value="">— Selecciona —</option>
                {CATEGORIAS_CLIENTE_SERVICIO.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Estado</label>
              <select style={inputStyle} value={modalCot.estado} onChange={e => setModalCot(p => ({ ...p, estado: e.target.value }))}>
                {["Pendiente","Confirmada","Atendida"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display:"flex",gap:"0.5rem",marginTop:"0.5rem" }}>
              <button className="btn-green btn w-100" onClick={() => guardarCotizacion(modalCot)}>Guardar</button>
              <button className="btn btn-outline-secondary w-100" style={{ borderRadius:10 }} onClick={() => setModalCot(null)}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Cliente */}
      {modalCliente && (
        <Modal titulo={formCliente._id ? "Editar Cliente" : "Nuevo Cliente"} onClose={() => setModalCliente(null)}>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
            {[["nombre","Nombre completo *"],["telefono","Teléfono"],["correo","Correo electrónico"],["total","Total pagado (ej: $480.000)"],["ultima","Última visita (YYYY-MM-DD)"]].map(([k,lbl]) => (
              <div key={k}>
                <label style={labelStyle}>{lbl}</label>
                <input style={inputStyle} value={formCliente[k] || ""} onChange={e => setFormCliente(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Servicios contratados</label>
              <input type="number" style={inputStyle} value={formCliente.servicios || 0} onChange={e => setFormCliente(p => ({ ...p, servicios: Number(e.target.value) }))} />
            </div>
            <div style={{ display:"flex",gap:"0.5rem",marginTop:"0.5rem" }}>
              <button className="btn-green btn w-100" onClick={guardarCliente}>Guardar</button>
              <button className="btn btn-outline-secondary w-100" style={{ borderRadius:10 }} onClick={() => setModalCliente(null)}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Gasto */}
      {modalGasto && (
        <Modal titulo={formGasto._id ? "Editar Gasto" : "Registrar Gasto"} onClose={() => setModalGasto(null)}>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
            <div>
              <label style={labelStyle}>Concepto *</label>
              <input style={inputStyle} value={formGasto.concepto} onChange={e => setFormGasto(p => ({ ...p, concepto: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={formGasto.categoria} onChange={e => setFormGasto(p => ({ ...p, categoria: e.target.value }))}>
                {CATEGORIAS_GASTO.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Monto (COP) *</label>
              <input type="number" style={inputStyle} value={formGasto.monto} onChange={e => setFormGasto(p => ({ ...p, monto: e.target.value }))} placeholder="85000" />
            </div>
            <div>
              <label style={labelStyle}>Fecha</label>
              <input type="date" style={inputStyle} value={formGasto.fecha} onChange={e => setFormGasto(p => ({ ...p, fecha: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Nota</label>
              <input style={inputStyle} value={formGasto.nota} onChange={e => setFormGasto(p => ({ ...p, nota: e.target.value }))} />
            </div>
            <div style={{ display:"flex",gap:"0.5rem",marginTop:"0.5rem" }}>
              <button className="btn-green btn w-100" onClick={guardarGasto}>Guardar</button>
              <button className="btn btn-outline-secondary w-100" style={{ borderRadius:10 }} onClick={() => setModalGasto(null)}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Ingreso */}
      {modalIngreso && (
        <Modal titulo={formIngreso._id ? "Editar Ingreso" : "Registrar Ingreso"} onClose={() => setModalIngreso(null)}>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
            <div>
              <label style={labelStyle}>Concepto *</label>
              <input style={inputStyle} value={formIngreso.concepto} onChange={e => setFormIngreso(p => ({ ...p, concepto: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={formIngreso.categoria} onChange={e => setFormIngreso(p => ({ ...p, categoria: e.target.value }))}>
                {CATEGORIAS_INGRESO.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Monto (COP) *</label>
              <input type="number" style={inputStyle} value={formIngreso.monto} onChange={e => setFormIngreso(p => ({ ...p, monto: e.target.value }))} placeholder="150000" />
            </div>
            <div>
              <label style={labelStyle}>Fecha</label>
              <input type="date" style={inputStyle} value={formIngreso.fecha} onChange={e => setFormIngreso(p => ({ ...p, fecha: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Nota</label>
              <input style={inputStyle} value={formIngreso.nota} onChange={e => setFormIngreso(p => ({ ...p, nota: e.target.value }))} />
            </div>
            <div style={{ display:"flex",gap:"0.5rem",marginTop:"0.5rem" }}>
              <button className="btn-green btn w-100" onClick={guardarIngreso}>Guardar</button>
              <button className="btn btn-outline-secondary w-100" style={{ borderRadius:10 }} onClick={() => setModalIngreso(null)}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Informe Excel */}
      {modalInforme && (
        <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
          <div style={{ background:"#fff",borderRadius:20,padding:"2rem",width:"100%",maxWidth:480,boxShadow:"0 24px 70px rgba(0,0,0,.2)" }}>
            {/* Header */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
              <div>
                <h5 style={{ fontWeight:800,color:"#0f172a",margin:0,fontSize:"1.1rem" }}>Generar Informe Excel</h5>
                <p style={{ color:"#64748b",fontSize:".8rem",margin:"4px 0 0" }}>Selecciona las secciones a incluir</p>
              </div>
              <button onClick={() => setModalInforme(false)} style={{ border:"none",background:"none",fontSize:"1.4rem",cursor:"pointer",color:"#94a3b8",lineHeight:1 }}>×</button>
            </div>

            {/* Secciones */}
            <div style={{ display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1.5rem" }}>
              {[
                { key:"resumen",      label:"Resumen Ejecutivo",  desc:"KPIs y totales por categoría",   icon:"📊" },
                { key:"ingresos",     label:"Ingresos",           desc:"Detalle de todos los ingresos",  icon:"💰" },
                { key:"gastos",       label:"Gastos",             desc:"Detalle de todos los gastos",    icon:"📉" },
                { key:"cotizaciones", label:"Cotizaciones",       desc:"Solicitudes de clientes",        icon:"📋" },
                { key:"clientes",     label:"Clientes",           desc:"Base de datos de clientes",      icon:"👥" },
                { key:"servicios",    label:"Servicios",          desc:"Lista de servicios y su estado", icon:"🧹" },
              ].map(({ key, label, desc, icon }) => (
                <label
                  key={key}
                  style={{
                    display:"flex", alignItems:"center", gap:"0.75rem",
                    padding:"10px 14px", borderRadius:12, cursor:"pointer",
                    border: `1.5px solid ${seccionesInforme[key] ? "#0ea5e9" : "#e2e8f0"}`,
                    background: seccionesInforme[key] ? "#f0f9ff" : "#fafafa",
                    transition:"all .2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={seccionesInforme[key]}
                    onChange={e => setSeccionesInforme(p => ({ ...p, [key]: e.target.checked }))}
                    style={{ accentColor:"#0ea5e9", width:17, height:17, cursor:"pointer", flexShrink:0 }}
                  />
                  <span style={{ fontSize:"1.1rem" }}>{icon}</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontWeight:700, color: seccionesInforme[key] ? "#0369a1" : "#374151", fontSize:".88rem" }}>{label}</span>
                    <br />
                    <span style={{ color:"#94a3b8", fontSize:".75rem" }}>{desc}</span>
                  </div>
                  {seccionesInforme[key] && (
                    <span style={{ color:"#0ea5e9", fontSize:".75rem", fontWeight:700 }}>✓</span>
                  )}
                </label>
              ))}
            </div>

            {/* Acciones */}
            <div style={{ display:"flex",gap:"0.5rem" }}>
              <button
                className="btn w-100"
                disabled={!Object.values(seccionesInforme).some(Boolean)}
                onClick={() => {
                  generarInformeExcel({ ingresos, gastos, cotizaciones, clientes, servicios, secciones: seccionesInforme });
                  setModalInforme(false);
                  mostrarAlerta("Informe Excel generado correctamente.", "success");
                }}
                style={{
                  borderRadius:12, background:"linear-gradient(135deg,#0ea5e9,#0369a1)",
                  color:"#fff", fontWeight:700, fontSize:".9rem", padding:"10px",
                  border:"none", cursor:"pointer",
                  opacity: Object.values(seccionesInforme).some(Boolean) ? 1 : .5,
                }}
              >
                {Icon.excel} Generar y Descargar
              </button>
              <button
                className="btn btn-outline-secondary w-50"
                style={{ borderRadius:12, fontWeight:600 }}
                onClick={() => setModalInforme(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Botón flotante cotizador ── */}
      <button
        onClick={() => setCalcOpen(p => !p)}
        title="Cotizador de costos"
        style={{
          position:"fixed", bottom:28, right:28, zIndex:9999,
          width:52, height:52, borderRadius:"50%", border:"none", cursor:"pointer",
          background: calcOpen ? "linear-gradient(135deg,#b45309,#92400e)" : "linear-gradient(135deg,#f59e0b,#d97706)",
          color:"#fff", fontSize:"1.3rem",
          boxShadow:"0 4px 18px rgba(245,158,11,.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          transform: calcOpen ? "scale(.92)" : "scale(1)", transition:"all .2s",
        }}
      >💰</button>

      {calcOpen && (
        <div style={{
          position:"fixed", bottom:90, right:28, zIndex:9998, width:400,
          borderRadius:18, boxShadow:"0 12px 48px rgba(0,0,0,.35)",
          overflow:"hidden", background:"#fff",
        }}>
          <CotizadorCostos onClose={() => setCalcOpen(false)} />
        </div>
      )}

    </div>
  );
}

export default Dashboard;
