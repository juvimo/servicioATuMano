import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { fetchServicios, createServicio, updateServicio, deleteServicio, fetchCotizaciones } from "../api/servicios";
import { generarInformeExcel } from "../utils/reportes";
import { Icon, SECCIONES } from "./dashboard/icons";
import {
  DEMO_SERVICIOS, DEMO_COTIZACIONES, DEMO_CLIENTES, DEMO_GASTOS, DEMO_INGRESOS,
  CATEGORIAS_GASTO, CATEGORIAS_INGRESO, CATEGORIAS_CLIENTE_SERVICIO,
} from "./dashboard/demoData";
import { fmtCOP, exportCSV } from "./dashboard/helpers";
import { BadgeEstado, Modal, TablaBase } from "./dashboard/ui";
import { CotizadorCostos } from "./dashboard/CotizadorCostos";

/* ═══════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════ */
function Dashboard() {
  const [seccion,    setSeccion]   = useState("dashboard");
  const [servicios,  setServicios] = useState([]);
  const [loadingT,   setLoadingT]  = useState(true);
  const [demoMode,   setDemoMode]  = useState(false);
  const [alerta,     setAlerta]    = useState({ msg: "", tipo: "" });
  const [hora,       setHora]      = useState(() => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

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
    const t = setInterval(() => setHora(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seccion === "dashboard" || seccion === "servicios") cargarServicios();
    if (seccion === "dashboard" || seccion === "cotizaciones") cargarCotizaciones();
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

  const cargarCotizaciones = async () => {
    try {
      const res = await fetchCotizaciones();
      const data = (res.data || []).map(c => ({ estado: "Pendiente", fecha: "", ...c }));
      if (data.length) setCotizaciones(data);
    } catch {
      /* sin backend: se conservan los datos de ejemplo */
    }
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
    sessionStorage.removeItem("token");
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
          <div>
            <p className="topbar-title" style={{ margin: 0, textTransform: "capitalize" }}>{seccion}</p>
            <p style={{ margin: 0, fontSize: ".75rem", color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
              {new Date().toLocaleDateString("es-CO", { weekday:"long", day:"2-digit", month:"long", year:"numeric" })} · {hora}
            </p>
          </div>
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
            {/* ── Banner bienvenida con reloj ── */}
            <div style={{
              background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0369a1 100%)",
              borderRadius: 22, padding: "1.5rem 2rem", marginBottom: "1.5rem",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 8px 32px rgba(15,23,42,.25)", flexWrap: "wrap", gap: "1rem",
            }}>
              <div>
                <p style={{ color:"rgba(255,255,255,.55)", fontSize:".78rem", fontWeight:600, margin:0, letterSpacing:".06em", textTransform:"uppercase" }}>Panel de Control</p>
                <h4 style={{ color:"#fff", margin:"4px 0 2px", fontWeight:900, fontSize:"1.25rem" }}>Servicio a tu Mano 🧹</h4>
                <p style={{ color:"rgba(255,255,255,.55)", fontSize:".8rem", margin:0 }}>
                  {new Date().toLocaleDateString("es-CO", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                </p>
              </div>
              <div style={{ display:"flex", gap:"1.25rem", flexWrap:"wrap" }}>
                <div style={{ textAlign:"center", background:"rgba(255,255,255,.08)", borderRadius:16, padding:"0.75rem 1.25rem", border:"1px solid rgba(255,255,255,.12)" }}>
                  <div style={{ color:"#38bdf8", fontWeight:900, fontSize:"1.6rem", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{hora}</div>
                  <div style={{ color:"rgba(255,255,255,.45)", fontSize:".7rem", marginTop:3 }}>Hora actual</div>
                </div>
                <div style={{ textAlign:"center", background:"rgba(255,255,255,.08)", borderRadius:16, padding:"0.75rem 1.25rem", border:"1px solid rgba(255,255,255,.12)" }}>
                  <div style={{ color:"#4ade80", fontWeight:900, fontSize:"1.6rem", lineHeight:1 }}>{completados}</div>
                  <div style={{ color:"rgba(255,255,255,.45)", fontSize:".7rem", marginTop:3 }}>Completados hoy</div>
                </div>
                <div style={{ textAlign:"center", background:"rgba(255,255,255,.08)", borderRadius:16, padding:"0.75rem 1.25rem", border:"1px solid rgba(255,255,255,.12)" }}>
                  <div style={{ color:"#fbbf24", fontWeight:900, fontSize:"1.6rem", lineHeight:1 }}>{cotPendientes}</div>
                  <div style={{ color:"rgba(255,255,255,.45)", fontSize:".7rem", marginTop:3 }}>Cot. pendientes</div>
                </div>
              </div>
            </div>

            {/* ── KPI Cards con gradientes ── */}
            <div className="row g-3 mb-4">
              {[
                { label:"Ingresos del Mes",        valor:fmtCOP(totalIngresos), icon:"💰", g:"linear-gradient(135deg,#16a34a,#15803d)", sh:"rgba(22,163,74,.3)"  },
                { label:"Gastos del Mes",          valor:fmtCOP(totalGastos),   icon:"📉", g:"linear-gradient(135deg,#dc2626,#b91c1c)", sh:"rgba(220,38,38,.3)"  },
                { label:"Utilidad Neta",           valor:(utilidad>=0?"+":"")+fmtCOP(utilidad), icon:"📊", g: utilidad>=0?"linear-gradient(135deg,#0ea5e9,#0369a1)":"linear-gradient(135deg,#f59e0b,#d97706)", sh:"rgba(14,165,233,.3)" },
                { label:"Servicios Completados",   valor:completados,           icon:"✅", g:"linear-gradient(135deg,#7c3aed,#6d28d9)", sh:"rgba(124,58,237,.3)" },
                { label:"Cotizaciones Pendientes", valor:cotPendientes,         icon:"📋", g:"linear-gradient(135deg,#f59e0b,#d97706)", sh:"rgba(245,158,11,.3)" },
                { label:"Clientes Registrados",    valor:clientes.length,       icon:"👥", g:"linear-gradient(135deg,#0891b2,#0e7490)", sh:"rgba(8,145,178,.3)"  },
              ].map(c => (
                <div className="col-sm-6 col-xl-4" key={c.label}>
                  <div style={{
                    background: c.g, borderRadius: 20, padding:"1.4rem 1.6rem",
                    boxShadow:`0 8px 28px ${c.sh}`, position:"relative", overflow:"hidden",
                    cursor:"default",
                  }}>
                    <div style={{ position:"absolute", top:-14, right:-14, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
                    <div style={{ position:"absolute", bottom:-24, right:18, width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
                      <div>
                        <p style={{ color:"rgba(255,255,255,.72)", fontSize:".72rem", fontWeight:700, margin:0, letterSpacing:".05em", textTransform:"uppercase" }}>{c.label}</p>
                        <p style={{ color:"#fff", fontWeight:900, fontSize:"1.65rem", margin:"6px 0 0", lineHeight:1 }}>{c.valor}</p>
                      </div>
                      <div style={{ background:"rgba(255,255,255,.18)", borderRadius:14, width:50, height:50, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>
                        {c.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Financiero + Actividad ── */}
            <div className="row g-3 mb-3">

              {/* Resumen financiero visual */}
              <div className="col-lg-7">
                <div className="dash-card" style={{ height:"100%" }}>
                  <div className="dash-card-header">
                    <h5>📊 Resumen Financiero</h5>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={() => setSeccion("ingresos")} style={{ borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#334155", fontSize:".8rem", fontWeight:600, padding:"4px 12px", cursor:"pointer" }}>Ingresos</button>
                      <button onClick={() => setSeccion("gastos")}   style={{ borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#334155", fontSize:".8rem", fontWeight:600, padding:"4px 12px", cursor:"pointer" }}>Gastos</button>
                    </div>
                  </div>
                  <div className="dash-card-body">
                    {/* Banner utilidad */}
                    <div style={{
                      background: utilidad>=0 ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "linear-gradient(135deg,#fef2f2,#fee2e2)",
                      border: `1.5px solid ${utilidad>=0?"#86efac":"#fca5a5"}`,
                      borderRadius:16, padding:"1rem 1.4rem", marginBottom:"1.25rem",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                    }}>
                      <div>
                        <p style={{ margin:0, fontSize:".72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".05em" }}>Utilidad Neta del Mes</p>
                        <p style={{ margin:"5px 0 0", fontWeight:900, fontSize:"1.9rem", color: utilidad>=0?"#15803d":"#dc2626", lineHeight:1 }}>
                          {utilidad>=0?"+":""}{fmtCOP(utilidad)}
                        </p>
                      </div>
                      <span style={{ fontSize:"2.5rem" }}>{utilidad>=0?"📈":"📉"}</span>
                    </div>

                    {/* Barra Ingresos */}
                    <div style={{ marginBottom:"1rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:".82rem", fontWeight:700, color:"#15803d" }}>💰 Ingresos</span>
                        <span style={{ fontSize:".82rem", fontWeight:800, color:"#15803d" }}>{fmtCOP(totalIngresos)}</span>
                      </div>
                      <div style={{ background:"#e2e8f0", borderRadius:10, height:12, overflow:"hidden" }}>
                        <div style={{ width:"100%", background:"linear-gradient(90deg,#16a34a,#4ade80)", height:"100%", borderRadius:10 }} />
                      </div>
                    </div>

                    {/* Barra Gastos */}
                    <div style={{ marginBottom:"1rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:".82rem", fontWeight:700, color:"#b91c1c" }}>📉 Gastos</span>
                        <span style={{ fontSize:".82rem", fontWeight:800, color:"#b91c1c" }}>{fmtCOP(totalGastos)}</span>
                      </div>
                      <div style={{ background:"#e2e8f0", borderRadius:10, height:12, overflow:"hidden" }}>
                        <div style={{
                          width: totalIngresos>0 ? Math.min(100,(totalGastos/totalIngresos)*100)+"%" : "0%",
                          background:"linear-gradient(90deg,#dc2626,#f87171)", height:"100%", borderRadius:10,
                          transition:"width .8s ease",
                        }} />
                      </div>
                    </div>

                    {/* Desglose rápido de ingresos */}
                    <p style={{ fontSize:".75rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".05em", margin:"1rem 0 0.6rem" }}>Últimos ingresos</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {ingresos.slice(0,4).map(i => (
                        <div key={i._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", background:"#f8fafc", borderRadius:10, border:"1px solid #f1f5f9" }}>
                          <span style={{ fontSize:".8rem", color:"#374151", fontWeight:500 }}>
                            <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#16a34a", marginRight:7 }}/>
                            {i.concepto}
                          </span>
                          <span style={{ fontSize:".82rem", fontWeight:800, color:"#15803d" }}>{fmtCOP(i.monto)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Margen */}
                    <div style={{ marginTop:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.75rem 1rem", background:"#f0fdf4", borderRadius:12, border:"1px solid #bbf7d0" }}>
                      <span style={{ fontSize:".82rem", fontWeight:600, color:"#166534" }}>Margen de utilidad del mes</span>
                      <span style={{ fontWeight:900, fontSize:"1.1rem", color: utilidad>=0?"#15803d":"#dc2626" }}>
                        {totalIngresos>0 ? Math.round((utilidad/totalIngresos)*100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actividad reciente — timeline */}
              <div className="col-lg-5">
                <div className="dash-card" style={{ height:"100%" }}>
                  <div className="dash-card-header">
                    <h5>🕐 Actividad Reciente</h5>
                    <button onClick={() => setSeccion("servicios")} style={{ borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#334155", fontSize:".8rem", fontWeight:600, padding:"4px 12px", cursor:"pointer" }}>
                      Ver todos
                    </button>
                  </div>
                  <div className="dash-card-body" style={{ padding:"0.75rem 1rem" }}>
                    {servicios.slice(0,7).map((s, idx) => (
                      <div key={s._id} style={{ display:"flex", gap:12, alignItems:"flex-start", paddingBottom:10, marginBottom:10, borderBottom: idx < 6 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:3 }}>
                          <div style={{
                            width:11, height:11, borderRadius:"50%", flexShrink:0,
                            background: s.completada ? "#16a34a" : "#f59e0b",
                            boxShadow: s.completada ? "0 0 0 3px #dcfce7" : "0 0 0 3px #fef9c3",
                          }} />
                          {idx < 6 && <div style={{ width:1, height:"100%", background:"#e2e8f0", marginTop:4, minHeight:20 }} />}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ margin:0, fontWeight:700, fontSize:".82rem", color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {s.titulo}
                          </p>
                          <div style={{ marginTop:3, display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                            <span style={{
                              fontSize:".7rem", fontWeight:700, borderRadius:6, padding:"1px 7px",
                              background: s.completada ? "#dcfce7" : "#fef9c3",
                              color:      s.completada ? "#15803d" : "#b45309",
                            }}>
                              {s.completada ? "✅ Completado" : "⏳ Pendiente"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {servicios.length === 0 && (
                      <div style={{ textAlign:"center", color:"#94a3b8", padding:"2rem 0", fontSize:".85rem" }}>Sin actividad registrada</div>
                    )}
                    <button onClick={() => setSeccion("servicios")} className="btn-green btn w-100" style={{ borderRadius:12, fontSize:".82rem", marginTop:4 }}>
                      + Registrar servicio
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Cotizaciones pendientes (cards) ── */}
            {cotizaciones.filter(c => c.estado === "Pendiente").length > 0 && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <h5>📋 Cotizaciones por Atender <span style={{ background:"#fef9c3",color:"#854d0e",borderRadius:8,padding:"2px 10px",fontSize:".75rem",fontWeight:700,marginLeft:8 }}>{cotizaciones.filter(c=>c.estado==="Pendiente").length} pendientes</span></h5>
                  <button onClick={() => setSeccion("cotizaciones")} style={{ borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#334155", fontSize:".8rem", fontWeight:600, padding:"4px 12px", cursor:"pointer" }}>
                    Ver todas
                  </button>
                </div>
                <div className="dash-card-body">
                  <div className="row g-3">
                    {cotizaciones.filter(c => c.estado === "Pendiente").slice(0,4).map(c => (
                      <div className="col-sm-6 col-xl-3" key={c._id}>
                        <div style={{ border:"1.5px solid #fde68a", borderRadius:16, padding:"1rem 1.1rem", background:"#fffbeb", height:"100%", display:"flex", flexDirection:"column", gap:6 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                            <div style={{ fontWeight:800, fontSize:".9rem", color:"#0f172a" }}>{c.nombre}</div>
                            <span style={{ background:"#fef3c7", color:"#92400e", fontSize:".68rem", fontWeight:700, borderRadius:6, padding:"2px 7px", flexShrink:0 }}>⏳</span>
                          </div>
                          <div style={{ fontSize:".78rem", color:"#0369a1", fontWeight:600 }}>{c.servicio}</div>
                          <div style={{ fontSize:".75rem", color:"#64748b" }}>{c.telefono}</div>
                          {c.info && <div style={{ fontSize:".73rem", color:"#94a3b8", fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.info}</div>}
                          <button
                            onClick={() => aceptarCotizacion(c)}
                            style={{ marginTop:"auto", width:"100%", borderRadius:10, border:"none", padding:"7px", background:"linear-gradient(135deg,#16a34a,#15803d)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:".8rem", boxShadow:"0 2px 8px rgba(22,163,74,.3)" }}
                          >✅ Aceptar y asignar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
              {["Insumos/Productos Vapor","Transporte","Equipamiento/Máquinas","Marketing"].map(cat => {
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
              {["Residencial","Comercial","Tapicería/Sofás"].map(cat => {
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
