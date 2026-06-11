import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SERVICIOS_LIST } from "../api/servicios";

function Servicios() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="section-badge">Lo que ofrecemos</span>
          <h1>Nuestros Servicios</h1>
          <p>
            Soluciones de limpieza profesional para cada espacio y necesidad.
            Selecciona el servicio que te interesa para conocer todos los detalles.
          </p>
        </div>
      </section>

      {/* ── GRILLA DE SERVICIOS ── */}
      <section className="py-5" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="row g-4">
            {SERVICIOS_LIST.map(s => (
              <div className="col-md-6 col-lg-4" key={s.slug}>
                <div className="service-card d-flex flex-column">
                  <div className="icon-wrap">{s.icon}</div>
                  <h5>{s.title}</h5>
                  <p style={{ flex: 1 }}>{s.description}</p>
                  <div className="d-flex gap-2 flex-wrap mt-3">
                    {s.idealFor.slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        background: s.bgColor,
                        color: s.color,
                        borderRadius: 100,
                        padding: ".25rem .75rem",
                        fontSize: ".75rem",
                        fontWeight: 600,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/servicios/${s.slug}`}
                    className="btn-nav-solid btn mt-3"
                    style={{ padding: ".55rem 1.25rem", fontSize: ".875rem" }}
                  >
                    Ver detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2>¿No encuentras lo que buscas?</h2>
          <p>Contáctanos y diseñamos un plan completamente a tu medida.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/cotizacion" className="btn-cta-white">Solicitar Cotización</Link>
            <Link to="/faq"        className="btn-cta-outline-white">Preguntas Frecuentes</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Servicios;
