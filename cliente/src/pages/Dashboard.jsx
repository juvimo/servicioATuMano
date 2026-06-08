import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  fetchServicios, createServicio, updateServicio, deleteServicio
} from "../api/servicios";

/* ── Secciones del menú ── */
const SECCIONES = [
  { id: "dashboard",   label: "Dashboard" },
  { id: "servicios",   label: "Servicios" },
  { id: "clientes",    label: "Clientes" },
  { id: "cotizaciones",label: "Cotizaciones" },
  { id: "gastos",      label: "Gastos" },
  { id: "ingresos",    label: "Ingresos" },
];

function Dashboard() {
  const [seccion,   setSeccion]  = useState("dashboard");
  const [servicios, setServicios]= useState([]);
  const [loadingT,  setLoadingT] = useState(true);
  const [demoMode,  setDemoMode] = useState(false);
  const [alerta,    setAlerta]   = useState({ msg: "", tipo: "" });

  // Form agregar servicio
  const [fTitulo, setFTitulo] = useState("");
  const [fDesc,   setFDesc]   = useState("");

  const navigate = useNavigate();
  const usuario  = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!usuario.email) navigate("/login");
  }, []);

  // Cargar servicios al montar y al cambiar sección
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
      // Backend no disponible: datos demo
      setDemoMode(true);
      setServicios([
        { _id: "demo1", titulo: "Limpieza Residencial - María García",  descripcion: "2026-04-08", completada: true },
        { _id: "demo2", titulo: "Limpieza Profunda - Juan Pérez",       descripcion: "2026-04-09", completada: false },
        { _id: "demo3", titulo: "Limpieza Comercial - Ana Martínez",    descripcion: "2026-04-10", completada: false },
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
      mostrarAlerta("Servicio agregado.", "success");
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

  // ── RENDER ──
  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <div className="sidebar p-3">
        <div className="d-flex align-items-center mb-4">
          <img src={logo} style={{ width: 36 }} className="me-2" alt="logo" />
          <div>
            <strong>Servicio a tu Mano</strong><br />
            <small>Panel Admin</small>
          </div>
        </div>

        <ul className="nav flex-column">
          {SECCIONES.map(s => (
            <li key={s.id}
              className={`nav-item${seccion === s.id ? " active" : ""}`}
              onClick={() => setSeccion(s.id)}>
              {s.label}
            </li>
          ))}
        </ul>

        <hr />
        <span className="logout" style={{ cursor: "pointer" }} onClick={cerrarSesion}>
          Cerrar Sesión
        </span>
      </div>

      {/* CONTENIDO */}
      <div className="content w-100 p-4">

        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-capitalize">{seccion}</h3>
          <div className="d-flex align-items-center gap-2">
            <div>
              <strong>Administrador</strong><br />
              <small>{usuario.email || "admin@servicioatumano.com"}</small>
            </div>
            <div className="avatar">A</div>
          </div>
        </div>

        {/* Alerta global */}
        {alerta.msg && (
          <div className={`alert alert-${alerta.tipo} mb-3`}>{alerta.msg}</div>
        )}

        {/* Aviso modo demo */}
        {demoMode && (
          <div className="alert alert-warning mb-3">
            ⚠ Backend no conectado — mostrando datos de ejemplo.
            Levanta el servidor con <code>uvicorn main:app --reload</code>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {seccion === "dashboard" && (
          <>
            <div className="row g-3 mb-4">
              {[
                { label: "Ingresos del Mes",     valor: "$12,450", icono: "$",  bg: "bg-success" },
                { label: "Gastos del Mes",        valor: "$4,230",  icono: "📉", bg: "bg-danger"  },
                { label: "Servicios Realizados",  valor: servicios.filter(s=>s.completada).length || 45, icono: "✔", bg: "bg-info" },
                { label: "Total Registros",       valor: servicios.length || 127, icono: "👥", bg: "bg-purple text-white" },
              ].map(c => (
                <div className="col-md-3" key={c.label}>
                  <div className="card stat-card">
                    <div className={`icon ${c.bg} text-white`}>{c.icono}</div>
                    <p>{c.label}</p>
                    <h3>{c.valor}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-3">
              <div className="d-flex justify-content-between mb-3">
                <h5>Servicios Recientes</h5>
                <button className="btn btn-success" onClick={() => setSeccion("servicios")}>
                  + Nuevo Servicio
                </button>
              </div>

              {loadingT ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-success" />
                  <span className="ms-2 text-muted">Cargando...</span>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr><th>Título</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {servicios.slice(0, 5).map(s => (
                      <tr key={s._id}>
                        <td>{s.titulo}</td>
                        <td>{s.descripcion || "—"}</td>
                        <td>
                          <span className={`badge ${s.completada ? "bg-success" : "bg-warning text-dark"}`}>
                            {s.completada ? "Completado" : "En Proceso"}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminar(s._id)}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── SERVICIOS CRUD ── */}
        {seccion === "servicios" && (
          <>
            <div className="card p-4 mb-3">
              <h5>Agregar Servicio</h5>
              <div className="row g-2">
                <div className="col-md-5">
                  <input className="form-control" placeholder="Título"
                    value={fTitulo} onChange={e => setFTitulo(e.target.value)} />
                </div>
                <div className="col-md-5">
                  <input className="form-control" placeholder="Descripción"
                    value={fDesc} onChange={e => setFDesc(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-success w-100" onClick={agregar}>+ Agregar</button>
                </div>
              </div>
            </div>

            <div className="card p-3">
              <h5>Lista de Servicios</h5>
              {loadingT ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-success" />
                </div>
              ) : servicios.length === 0 ? (
                <p className="text-muted text-center py-3">No hay servicios registrados.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr><th>Título</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {servicios.map(s => (
                      <tr key={s._id}>
                        <td>{s.titulo}</td>
                        <td>{s.descripcion || "—"}</td>
                        <td>
                          <span className={`badge ${s.completada ? "bg-success" : "bg-warning text-dark"}`}>
                            {s.completada ? "Completado" : "Pendiente"}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-1"
                            onClick={() => toggleCompletar(s._id, s.completada)}>
                            {s.completada ? "↩ Reabrir" : "✔ Completar"}
                          </button>
                          <button className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminar(s._id)}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── SECCIONES EN DESARROLLO ── */}
        {["clientes","cotizaciones","gastos","ingresos"].includes(seccion) && (
          <div className="text-center p-5">
            <div style={{ fontSize: "3rem" }} className="mb-3">
              {{ clientes: "👥", cotizaciones: "📄", gastos: "💸", ingresos: "📈" }[seccion]}
            </div>
            <h3 className="text-capitalize">{seccion}</h3>
            <p className="text-muted">Este módulo está en desarrollo.</p>
            {seccion === "cotizaciones" && (
              <Link to="/cotizacion" className="btn btn-success mt-3">+ Nueva Cotización</Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
