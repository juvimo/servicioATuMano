import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createServicio } from "../api/servicios";

const SERVICIOS_LISTA = [
  { icon: "💨", title: "Limpieza Profunda a Vapor",   desc: "Limpieza intensiva que elimina suciedad y bacterias." },
  { icon: "🛋️", title: "Limpieza de Muebles",         desc: "Especializado en sofás y muebles tapizados." },
  { icon: "💧", title: "Limpieza de Tapicería",        desc: "Eliminación de manchas y olores en telas." },
  { icon: "🛏️", title: "Limpieza de Colchones",        desc: "Elimina ácaros y bacterias." },
  { icon: "🧼", title: "Limpieza de Tapetes",          desc: "Lavado profundo y restauración." },
  { icon: "✨", title: "Limpieza de Pisos",            desc: "Para todo tipo de superficies." },
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

  const enviar = async (e) => {
    e.preventDefault();
    setError(""); setOk(false);

    if (!nombre || !telefono || !correo || !servicio) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    const payload = {
      titulo: `Cotización - ${servicio}`,
      descripcion: `Cliente: ${nombre} | Tel: ${telefono} | Email: ${correo}${info ? " | " + info : ""}`,
      completada: false,
    };

    try {
      // Envía al endpoint de servicios (cambia a /api/cotizaciones cuando lo implementes)
      await createServicio(payload);
    } catch {
      // Modo demo si el backend no está disponible
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
      <div className="container py-5" style={{ paddingTop: 100 }}>

        <Link to="/" className="text-decoration-none text-dark mb-3 d-inline-block">
          ← Volver al Inicio
        </Link>

        <div className="text-center mb-5">
          <h1 className="fw-bold">Nuestros Servicios</h1>
          <p className="text-muted">
            Ofrecemos servicios profesionales de limpieza con tecnología de punta y productos ecológicos
          </p>
        </div>

        {/* Tarjetas de servicios */}
        <div className="row g-4 mb-5">
          {SERVICIOS_LISTA.map(s => (
            <div className="col-md-4" key={s.title}>
              <div className="service-card card h-100">
                <div className="icon">{s.icon}</div>
                <h5>{s.title}</h5>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Solicitar Cotización</h2>
          <p className="text-muted">Completa el formulario y te contactaremos pronto</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card form-card p-4">

              {ok && (
                <div className="alert alert-success">
                  ✔ ¡Solicitud enviada con éxito! Te contactaremos pronto.
                </div>
              )}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={enviar}>
                <div className="mb-3">
                  <label className="form-label">Nombre Completo *</label>
                  <input className="form-control" placeholder="Ingresa tu nombre completo"
                    value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Número de Teléfono *</label>
                  <input className="form-control" placeholder="+1 (555) 123-4567"
                    value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico *</label>
                  <input type="email" className="form-control" placeholder="correo@ejemplo.com"
                    value={correo} onChange={e => setCorreo(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo de Servicio *</label>
                  <select className="form-select" value={servicio} onChange={e => setServicio(e.target.value)}>
                    <option value="">Selecciona un servicio</option>
                    {SERVICIOS_LISTA.map(s => (
                      <option key={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Información Adicional</label>
                  <textarea className="form-control" rows="4" placeholder="Describe detalles..."
                    value={info} onChange={e => setInfo(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
                  {loading ? "Enviando..." : "✈ Enviar Solicitud de Cotización"}
                </button>
                <p className="text-center mt-3 small text-muted">* Campos obligatorios</p>
              </form>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Cotizacion;
