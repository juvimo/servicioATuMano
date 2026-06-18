import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { fetchServicios, createServicio, updateServicio, deleteServicio } from "../api/servicios";
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
  { _id: "d1", titulo: "Limpieza Residencial",  descripcion: "2026-04-08", completada: true  },
  { _id: "d2", titulo: "Limpieza Profunda",      descripcion: "2026-04-09", completada: false },
  { _id: "d3", titulo: "Limpieza Comercial",     descripcion: "2026-04-10", completada: false },
  { _id: "d4", titulo: "Limpieza de Tapetes",    descripcion: "2026-04-11", completada: true  },
  { _id: "d5", titulo: "Limpieza a Vapor",       descripcion: "2026-04-12", completada: false },
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
const CATEGORIAS_CLIENTE_SERVICIO = ["Limpieza Residencial","Limpieza Profunda","Limpieza Comercial","Limpieza de Tapetes","Limpieza a Vapor","Limpieza de Muebles","Limpieza de Pisos"];

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
   COMPONENTE PRINCIPAL
═══════════════════════════════════════ */
function Dashboard() {
  const [seccion,    setSeccion]   = useState("dashboard");
  const [servicios,  setServicios] = useState([]);
  const [loadingT,   setLoadingT]  = useState(true);
  const [demoMode,   setDemoMode]  = useState(false);
  const [alerta,     setAlerta]    = useState({ msg: "", tipo: "" });

  /* Servicios form */
  const [fTitulo, setFTitulo] = useState("");
  const [fDesc,   setFDesc]   = useState("");

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
    try {
      await createServicio({ titulo: fTitulo, descripcion: fDesc, completada: false });
      setFTitulo(""); setFDesc("");
      mostrarAlerta("Servicio agregado.", "success");
      cargarServicios();
    } catch (err) { mostrarAlerta("Error: " + err.message); }
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
            <div className="add-form-card">
              <h5>Agregar Nuevo Servicio</h5>
              <div className="row g-2">
                <div className="col-md-5">
                  <input className="form-control" placeholder="Título del servicio" value={fTitulo} onChange={e => setFTitulo(e.target.value)} />
                </div>
                <div className="col-md-5">
                  <input className="form-control" placeholder="Descripción o fecha" value={fDesc} onChange={e => setFDesc(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn-green btn w-100" onClick={agregarServicio}>+ Agregar</button>
                </div>
              </div>
            </div>

            <TablaBase
              titulo="Lista de Servicios"
              datos={servicios}
              columnas={["Título", "Descripción", "Estado", "Acciones"]}
              busquedaKey="titulo"
              onExport={() => exportCSV(servicios.map(s => ({ titulo:s.titulo, descripcion:s.descripcion, estado:s.completada?"Completado":"Pendiente" })), "servicios")}
              renderFila={s => (
                <tr key={s._id}>
                  <td style={{ fontWeight:600 }}>{s.titulo}</td>
                  <td>{s.descripcion || "—"}</td>
                  <td>
                    <span className={`badge ${s.completada ? "bg-success" : "bg-warning text-dark"}`} style={{ borderRadius:8,fontWeight:600,fontSize:".73rem" }}>
                      {s.completada ? "✓ Completado" : "⏳ Pendiente"}
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
              )}
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
                  <td style={{ display:"flex",gap:5 }}>
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

    </div>
  );
}

export default Dashboard;
