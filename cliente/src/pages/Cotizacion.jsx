import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createServicio } from "../api/servicios";

const SERVICIOS_LISTA = [
  { icon: "💨", title: "Limpieza a Vapor",      desc: "Elimina suciedad y bacterias en profundidad." },
  { icon: "🛋️", title: "Limpieza de Muebles",  desc: "Sofás y tapizados en perfecto estado." },
  { icon: "💧", title: "Limpieza de Tapicería", desc: "Manchas y olores eliminados." },
  { icon: "🛏️", title: "Limpieza de Colchones", desc: "Libre de ácaros y bacterias." },
  { icon: "🧼", title: "Limpieza de Tapetes",   desc: "Lavado profundo y restauración." },
  { icon: "✨", title: "Limpieza de Pisos",      desc: "Para todo tipo de superficies." },
];

function Cotizacion() {
  const [nombre,   setNombre]   = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo,   setCorreo]   = useState("");
  const [servicio, setServicio] = useState("");
  const [info,     setInfo]     = useState("");
  const [ok,       setOk]       = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const seleccionar = (title) => setServicio(prev => prev === title ? "" : title);

  const enviar = async (e) => {
    e.preventDefault();
    setError(""); setOk(false);

    if (!nombre || !telefono || !correo || !servicio) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    const payload = {
      titulo: `Cotización – ${servicio}`,
      descripcion: `Cliente: ${nombre} | Tel: ${telefono} | Email: ${correo}${info ? " | " + info : ""}`,
      completada: false,
    };

    try {
      await createServicio(payload);
    } catch {
      console.warn("Backend no disponible, modo demo");
    } finally {
      setLoading(false);
      setOk(true);
      setNombre(""); setTelefono(""); setCorreo(""); setServicio(""); setInfo("");
    }
  };

  return (
    <>
      <Navbar />

      <div className="cot-page">
        <div className="container">

          <Link to="/" className="d-inline-flex align-items-center gap-2 mb-4"
            style={{ color: "#64748b", textDecoration: "none", fontSize: ".875rem", fontWeight: 500 }}>
            ← Volver al inicio
          </Link>

          {/* Encabezado */}
          <div className="text-center mb-5">
            <span className="section-badge">Cotización</span>
            <h1 className="section-title">Elige tu servicio</h1>
            <p className="section-sub">
              Selecciona el servicio que necesitas y completa el formulario.
              Te contactamos en menos de 24 horas.
            </p>
          </div>

          {/* Cards clicables */}
          <div className="row g-3 mb-5">
            {SERVICIOS_LISTA.map(s => (
              <div className="col-6 col-md-4 col-lg-2" key={s.title}>
                <div
                  className={`cot-service-card${servicio === s.title ? " selected" : ""}`}
                  onClick={() => seleccionar(s.title)}
                >
                  {servicio === s.title && <div className="selected-badge">✓</div>}
                  <div className="icon-wrap">{s.icon}</div>
                  <h6>{s.title}</h6>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="form-card">
                <h2 className="mb-1">Solicitar Cotización</h2>
                <p className="mb-4" style={{ color: "#64748b", fontSize: ".9rem" }}>
                  Completa el formulario y te contactaremos pronto.
                </p>

                {ok && (
                  <div className="alert alert-success d-flex gap-2 align-items-center mb-4"
                    style={{ borderRadius: 12, fontSize: ".875rem" }}>
                    ✓ ¡Solicitud enviada! Te contactaremos pronto.
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger d-flex gap-2 align-items-center mb-4"
                    style={{ borderRadius: 12, fontSize: ".875rem" }}>
                    ⚠ {error}
                  </div>
                )}

                <form onSubmit={enviar}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo *</label>
                      <input className="form-control" placeholder="Tu nombre"
                        value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono *</label>
                      <input className="form-control" placeholder="+1 (555) 123-4567"
                        value={telefono} onChange={e => setTelefono(e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Correo Electrónico *</label>
                      <input type="email" className="form-control" placeholder="correo@ejemplo.com"
                        value={correo} onChange={e => setCorreo(e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Tipo de Servicio *</label>
                      <select className="form-select" value={servicio}
                        onChange={e => setServicio(e.target.value)}>
                        <option value="">— Selecciona un servicio —</option>
                        {SERVICIOS_LISTA.map(s => (
                          <option key={s.title} value={s.title}>{s.icon} {s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Información Adicional</label>
                      <textarea className="form-control" rows="3"
                        placeholder="Tamaño del espacio, frecuencia deseada, detalles..."
                        value={info} onChange={e => setInfo(e.target.value)} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn-green btn w-100 py-2"
                        style={{ fontSize: "1rem" }} disabled={loading}>
                        {loading ? "Enviando…" : "Enviar Solicitud de Cotización"}
                      </button>
                      <p className="text-center mt-2" style={{ fontSize: ".8rem", color: "#94a3b8" }}>
                        * Campos obligatorios · Sin compromisos
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Cotizacion;
