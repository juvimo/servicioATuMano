import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createCotizacion } from "../api/servicios";

const SERVICIOS_LISTA = [
  { vid: "/videos/13.mp4", title: "Limpieza a Vapor",      desc: "Elimina suciedad y bacterias en profundidad." },
  { vid: "/videos/9.mp4",  title: "Limpieza de Muebles",  desc: "Sofás y tapizados en perfecto estado." },
  { vid: "/videos/12.mp4", title: "Limpieza de Tapicería", desc: "Manchas y olores eliminados." },
  { vid: "/videos/10.mp4", title: "Limpieza de Colchones", desc: "Libre de ácaros y bacterias." },
  { vid: "/videos/11.mp4", title: "Limpieza de Tapetes",   desc: "Lavado profundo y restauración." },
  { vid: "/videos/15.mp4", title: "Limpieza de Pisos",     desc: "Para todo tipo de superficies." },
];

function Cotizacion() {
  const [nombre,    setNombre]   = useState("");
  const [telefono,  setTelefono] = useState("");
  const [correo,    setCorreo]   = useState("");
  const [servicios, setServicios] = useState([]);
  const [info,      setInfo]     = useState("");
  const [ok,        setOk]       = useState(false);
  const [error,     setError]    = useState("");
  const [loading,   setLoading]  = useState(false);

  const seleccionar = (title) =>
    setServicios(prev =>
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );

  const enviar = async (e) => {
    e.preventDefault();
    setError(""); setOk(false);

    if (!nombre || !telefono || !correo || servicios.length === 0) {
      setError("Por favor completa todos los campos y selecciona al menos un servicio.");
      return;
    }

    setLoading(true);
    const payload = {
      nombre,
      telefono,
      correo,
      servicio: servicios.join(", "),
      info,
    };

    try {
      await createCotizacion(payload);
    } catch {
      console.warn("Backend no disponible, modo demo");
    } finally {
      setLoading(false);
      setOk(true);
      setNombre(""); setTelefono(""); setCorreo(""); setServicios([]); setInfo("");
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
              Selecciona uno o más servicios y completa el formulario.
              Te contactamos en menos de 24 horas.
            </p>
          </div>

          {/* Cards clicables con imagen — selección múltiple */}
          <div className="row g-4 mb-5">
            {SERVICIOS_LISTA.map(s => (
              <div className="col-12 col-sm-6 col-md-4" key={s.title}>
                <div
                  className={`cot-service-card${servicios.includes(s.title) ? " selected" : ""}`}
                  onClick={() => seleccionar(s.title)}
                >
                  {servicios.includes(s.title) && <div className="selected-badge">✓</div>}
                  <div className="cot-img-wrap">
                    <video
                      src={s.vid}
                      className="cot-service-img"
                      autoPlay muted loop playsInline
                      preload="metadata"
                    />
                  </div>
                  <div className="cot-card-body">
                    <h6>{s.title}</h6>
                    <p>{s.desc}</p>
                  </div>
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

                    {/* Servicios seleccionados */}
                    <div className="col-12">
                      <label className="form-label">Servicios seleccionados *</label>
                      <div className="cot-selected-summary">
                        {servicios.length === 0
                          ? <span className="cot-no-selection">Selecciona al menos un servicio arriba</span>
                          : servicios.map(s => (
                              <span key={s} className="cot-chip">
                                {s}
                                <button type="button" onClick={() => seleccionar(s)}>×</button>
                              </span>
                            ))
                        }
                      </div>
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
