import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo2 from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";

const SERVICIOS = [
  { icon: "🏠", slug: "residencial", title: "Limpieza Residencial", desc: "Servicio completo para tu hogar, desde cocina hasta dormitorios." },
  { icon: "🏢", slug: "comercial",   title: "Limpieza Comercial",   desc: "Mantenimiento profesional de oficinas y locales comerciales." },
  { icon: "💧", slug: "profunda",    title: "Limpieza Profunda",    desc: "Eliminación de suciedad acumulada en espacios difíciles." },
  { icon: "✨", slug: "post-obra",   title: "Limpieza Post-Obra",   desc: "Retiro completo de residuos y polvo tras construcción." },
];

const STATS = [
  { valor: "500+", label: "Clientes satisfechos" },
  { valor: "5",    label: "Años de experiencia"  },
  { valor: "98%",  label: "Tasa de satisfacción" },
  { valor: "4.9★", label: "Calificación promedio" },
];

const WHY_FEATURES = [
  { title: "Personal profesional capacitado",    desc: "Nuestro equipo recibe formación continua en técnicas de limpieza avanzada." },
  { title: "Productos ecológicos certificados",  desc: "Seguros para tu familia, mascotas y el medio ambiente." },
  { title: "Horarios 100% flexibles",            desc: "Nos adaptamos a tu agenda, incluidos fines de semana." },
  { title: "Garantía de satisfacción total",     desc: "Si algo no está a tu gusto, regresamos sin costo adicional." },
];

function Landing() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="hero-badge">
                <span>✦</span> Limpieza Profesional de Confianza
              </div>
              <h1 className="hero-title">
                Tu Hogar Merece<br />
                <span>Lo Mejor</span> de Nosotros
              </h1>
              <p className="hero-subtitle">
                Brindamos servicios de limpieza de alta calidad con personal capacitado,
                productos ecológicos y horarios que se adaptan a tu vida.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/cotizacion" className="btn-nav-solid btn"
                  style={{ padding: ".75rem 1.75rem", fontSize: "1rem" }}>
                  Solicitar Cotización
                </Link>
                <a href="#servicios" className="btn-nav-outline btn"
                  style={{ padding: ".75rem 1.75rem", fontSize: "1rem" }}>
                  Ver Servicios
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-img-wrap">
                <img src={logo2} className="hero-img" alt="Limpieza profesional" />
                <div className="hero-floating-badge">
                  <div className="fb-icon">✅</div>
                  <div>
                    <strong>Satisfacción Garantizada</strong>
                    <span>Más de 500 hogares felices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="row justify-content-center text-center gy-4">
            {STATS.map(s => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="stat-item">
                  <h3>{s.valor}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="py-5" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Nuestros Servicios</span>
            <h2 className="section-title">Soluciones para cada espacio</h2>
            <p className="section-sub">
              Una amplia gama de servicios adaptados a las necesidades de tu hogar o negocio.
            </p>
          </div>
          <div className="row g-4">
            {SERVICIOS.map(s => (
              <div className="col-md-6 col-lg-3" key={s.slug}>
                <div className="service-card d-flex flex-column">
                  <div className="icon-wrap">{s.icon}</div>
                  <h5>{s.title}</h5>
                  <p style={{ flex: 1 }}>{s.desc}</p>
                  <Link
                    to={`/servicios/${s.slug}`}
                    style={{
                      color: "var(--primary)", fontWeight: 700,
                      fontSize: ".875rem", textDecoration: "none",
                      marginTop: ".75rem", display: "inline-block",
                    }}
                  >
                    Ver detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/servicios" className="btn-nav-outline btn"
              style={{ padding: ".65rem 2rem" }}>
              Ver todos los servicios →
            </Link>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section id="nosotros" className="why-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <img src={logo3} className="why-img" alt="Nuestro equipo" />
            </div>
            <div className="col-lg-7">
              <span className="section-badge">¿Por qué elegirnos?</span>
              <h2 className="section-title mb-3">Calidad que se ve y se siente</h2>
              <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Llevamos años transformando hogares y espacios comerciales con un estándar
                de excelencia que nos distingue.
              </p>
              {WHY_FEATURES.map(f => (
                <div className="why-feature" key={f.title}>
                  <div className="why-check-icon">✓</div>
                  <div>
                    <h6>{f.title}</h6>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Link to="/nosotros" className="btn-nav-solid btn"
                  style={{ padding: ".65rem 1.75rem" }}>
                  Conocer más sobre nosotros
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="py-5" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Contacto</span>
            <h2 className="section-title">Estamos para ayudarte</h2>
            <p className="section-sub">
              Comunícate con nosotros por el canal que prefieras.
            </p>
          </div>
          <div className="row g-4 mb-5">
            {[
              { icon: "📞", title: "Teléfono",  info: "+1 (555) 123-4567",        sub: "Lun – Vie, 8AM – 6PM" },
              { icon: "📧", title: "Email",      info: "info@servicioatumano.com", sub: "Respondemos en 24h" },
              { icon: "📍", title: "Ubicación",  info: "Ciudad, País",             sub: "Cobertura local y regional" },
            ].map(c => (
              <div className="col-md-4" key={c.title}>
                <div className="contact-card">
                  <div className="contact-icon">{c.icon}</div>
                  <h6>{c.title}</h6>
                  <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: ".2rem" }}>{c.info}</p>
                  <p style={{ fontSize: ".82rem" }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/cotizacion" className="btn-nav-solid btn"
              style={{ padding: ".75rem 2rem", fontSize: "1rem" }}>
              Solicitar Cotización Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2>¿Listo para un hogar impecable?</h2>
          <p>Únete a más de 500 familias que ya confían en nosotros.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register"   className="btn-cta-white">Crear cuenta gratis</Link>
            <Link to="/cotizacion" className="btn-cta-outline-white">Solicitar cotización</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Landing;
