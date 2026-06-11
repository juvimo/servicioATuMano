import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { fetchServicios, createServicio, updateServicio, deleteServicio } from "../api/servicios";

/* ── Iconos SVG inline ── */
const Icon = {
  dashboard:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  servicios:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  clientes:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  cotizaciones: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  gastos:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  ingresos:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  logout:       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const SECCIONES = [
  { id: "dashboard",    label: "Dashboard",    icon: Icon.dashboard    },
  { id: "servicios",    label: "Servicios",    icon: Icon.servicios    },
  { id: "clientes",     label: "Clientes",     icon: Icon.clientes     },
  { id: "cotizaciones", label: "Cotizaciones", icon: Icon.cotizaciones },
  { id: "gastos",       label: "Gastos",       icon: Icon.gastos       },
  { id: "ingresos",     label: "Ingresos",     icon: Icon.ingresos     },
];

const PLACEHOLDER_DEV = {
  clientes:     { icon: "👥", msg: "Módulo de clientes en desarrollo." },
  cotizaciones: { icon: "📄", msg: "Módulo de cotizaciones en desarrollo." },
  gastos:       { icon: "💸", msg: "Módulo de gastos en desarrollo." },
  ingresos:     { icon: "📈", msg: "Módulo de ingresos en desarrollo." },
};

function Dashboard() {
  const [seccion,    setSeccion]   = useState("dashboard");
  const [servicios,  setServicios] = useState([]);
  const [loadingT,   setLoadingT]  = useState(true);
  const [demoMode,   setDemoMode]  = useState(false);
  const [alerta,     setAlerta]    = useState({ msg: "", tipo: "" });
  const [fTitulo,    setFTitulo]   = useState("");
  const [fDesc,      setFDesc]     = useState("");

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
      setServicios([
        { _id: "d1", titulo: "Limpieza Residencial – María García",  descripcion: "2026-04-08", completada: true  },
        { _id: "d2", titulo: "Limpieza Profunda – Juan Pérez",       descripcion: "2026-04-09", completada: false },
        { _id: "d3", titulo: "Limpieza Comercial – Ana Martínez",    descripcion: "2026-04-10", completada: false },
      ]);
    } finally {
      setLoadingT(false);
    }
  };

  const mostrarAlerta = (msg, tipo = "danger") => {
    setAlerta({ msg, tipo });
    setTimeout(() => setAlerta({ msg: "", tipo: "" }), 3500);
  };

  const agregar = async () => {
    if (!fTitulo.trim()) { mostrarAlerta("El título es obligatorio."); return; }
    try {
      await createServicio({ titulo: fTitulo, descripcion: fDesc, completada: false });
      setFTitulo(""); setFDesc("");
      mostrarAlerta("Servicio agregado correctamente.", "success");
      cargarServicios();
    } catch (err) { mostrarAlerta("Error: " + err.message); }
  };

  const toggleCompletar = async (id, actual) => {
    if (demoMode) { mostrarAlerta("Modo demo: backend no conectado.", "warning"); return; }
    try { await updateServicio(id, { completada: !actual }); cargarServicios(); }
    catch (err) { mostrarAlerta("Error: " + err.message); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    if (demoMode) { mostrarAlerta("Modo demo: backend no conectado.", "warning"); return; }
    try { await deleteServicio(id); cargarServicios(); }
    catch (err) { mostrarAlerta("Error: " + err.message); }
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario");
    navigate("/");
  };

  const emailInicial = (usuario.correo || usuario.email || "A")[0].toUpperCase();

  /* ── STAT CARDS DATA ── */
  const completados = servicios.filter(s => s.completada).length;
  const statCards = [
    { label: "Ingresos del Mes",    valor: "$12,450", icon: "💰", bg: "#dcfce7", color: "#15803d" },
    { label: "Gastos del Mes",      valor: "$4,230",  icon: "📉", bg: "#fee2e2", color: "#b91c1c" },
    { label: "Servicios Completados", valor: completados || 45, icon: "✅", bg: "#dbeafe", color: "#1d4ed8" },
    { label: "Total Registros",     valor: servicios.length || 127, icon: "📋", bg: "#f3e8ff", color: "#7c3aed" },
  ];

  return (
    <div style={{ display: "flex" }}>

      {/* ── SIDEBAR ── */}
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
            <li
              key={s.id}
              className={`nav-item${seccion === s.id ? " active" : ""}`}
              onClick={() => setSeccion(s.id)}
            >
              {s.icon}
              {s.label}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button className="logout" onClick={cerrarSesion}>
            {Icon.logout}
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO ── */}
      <main className="dash-content">

        {/* TOP BAR */}
        <div className="topbar">
          <p className="topbar-title">{seccion}</p>
          <div className="d-flex align-items-center gap-3">
            <div className="topbar-user">
              <strong>Administrador</strong>
              <small>{usuario.correo || usuario.email || "admin@servicioatumano.com"}</small>
            </div>
            <div className="avatar">{emailInicial}</div>
          </div>
        </div>

        {/* Alertas */}
        {alerta.msg && (
          <div className={`alert alert-${alerta.tipo} mb-3`}
            style={{ borderRadius: 12, fontSize: ".875rem" }}>
            {alerta.msg}
          </div>
        )}
        {demoMode && (
          <div className="alert alert-warning mb-3"
            style={{ borderRadius: 12, fontSize: ".875rem" }}>
            ⚠ Backend no conectado — mostrando datos de ejemplo.
            Ejecuta <code>python -m uvicorn main:app --reload</code>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {seccion === "dashboard" && (
          <>
            {/* Stat cards */}
            <div className="row g-3 mb-4">
              {statCards.map(c => (
                <div className="col-sm-6 col-xl-3" key={c.label}>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: c.bg, color: c.color }}>
                      {c.icon}
                    </div>
                    <p className="stat-label">{c.label}</p>
                    <p className="stat-value">{c.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla reciente */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h5>Servicios Recientes</h5>
                <button className="btn-green btn" onClick={() => setSeccion("servicios")}>
                  + Nuevo Servicio
                </button>
              </div>
              <div className="dash-card-body">
                {loadingT ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-success" />
                    <span className="ms-2" style={{ color: "#94a3b8", fontSize: ".875rem" }}>Cargando...</span>
                  </div>
                ) : (
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios.slice(0, 5).map(s => (
                        <tr key={s._id}>
                          <td style={{ fontWeight: 600 }}>{s.titulo}</td>
                          <td>{s.descripcion || "—"}</td>
                          <td>
                            <span className={`badge ${s.completada ? "bg-success" : "bg-warning text-dark"}`}
                              style={{ borderRadius: 8, fontWeight: 600, fontSize: ".75rem" }}>
                              {s.completada ? "✓ Completado" : "⏳ En Proceso"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: 8, fontSize: ".8rem" }}
                              onClick={() => eliminar(s._id)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── SERVICIOS CRUD ── */}
        {seccion === "servicios" && (
          <>
            <div className="add-form-card">
              <h5>Agregar Nuevo Servicio</h5>
              <div className="row g-2">
                <div className="col-md-5">
                  <input className="form-control" placeholder="Título del servicio"
                    value={fTitulo} onChange={e => setFTitulo(e.target.value)} />
                </div>
                <div className="col-md-5">
                  <input className="form-control" placeholder="Descripción o fecha"
                    value={fDesc} onChange={e => setFDesc(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn-green btn w-100" onClick={agregar}>+ Agregar</button>
                </div>
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <h5>Lista de Servicios</h5>
                <span style={{ fontSize: ".85rem", color: "#94a3b8" }}>{servicios.length} registros</span>
              </div>
              <div className="dash-card-body">
                {loadingT ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-success" />
                  </div>
                ) : servicios.length === 0 ? (
                  <p className="text-center py-4" style={{ color: "#94a3b8", fontSize: ".9rem" }}>
                    No hay servicios registrados.
                  </p>
                ) : (
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios.map(s => (
                        <tr key={s._id}>
                          <td style={{ fontWeight: 600 }}>{s.titulo}</td>
                          <td>{s.descripcion || "—"}</td>
                          <td>
                            <span className={`badge ${s.completada ? "bg-success" : "bg-warning text-dark"}`}
                              style={{ borderRadius: 8, fontWeight: 600, fontSize: ".75rem" }}>
                              {s.completada ? "✓ Completado" : "⏳ Pendiente"}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm me-2 ${s.completada ? "btn-outline-secondary" : "btn-outline-success"}`}
                              style={{ borderRadius: 8, fontSize: ".8rem" }}
                              onClick={() => toggleCompletar(s._id, s.completada)}>
                              {s.completada ? "↩ Reabrir" : "✓ Completar"}
                            </button>
                            <button className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: 8, fontSize: ".8rem" }}
                              onClick={() => eliminar(s._id)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── SECCIONES EN DESARROLLO ── */}
        {Object.keys(PLACEHOLDER_DEV).includes(seccion) && (
          <div className="dash-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
              {PLACEHOLDER_DEV[seccion].icon}
            </div>
            <h4 style={{ fontWeight: 800, color: "#0f172a", textTransform: "capitalize" }}>
              {seccion}
            </h4>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
              {PLACEHOLDER_DEV[seccion].msg}
            </p>
            {seccion === "cotizaciones" && (
              <Link to="/cotizacion" className="btn-green btn">+ Nueva Cotización</Link>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
