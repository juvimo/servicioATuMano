import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SERVICIOS_DATA, SERVICIOS_LIST } from "../api/servicios";

function ServicioDetalle() {
  const { slug } = useParams();
  const s = SERVICIOS_DATA[slug];

  if (!s) return <Navigate to="/servicios" replace />;

  const otros = SERVICIOS_LIST.filter(o => o.slug !== slug).slice(0, 3);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
        paddingTop: "calc(var(--navbar-h) + 3.5rem)",
        paddingBottom: "3.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Orbe de color del servicio */}
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 500, height: 500,
          background: `radial-gradient(circle, ${s.color}28 0%, transparent 70%)`,
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: ".82rem" }}>
            <Link to="/"           style={{ color: "#64748b", textDecoration: "none" }}>Inicio</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/servicios"  style={{ color: "#64748b", textDecoration: "none" }}>Servicios</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94a3b8" }}>{s.title}</span>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                background: `${s.color}22`,
                border: `1px solid ${s.color}44`,
                borderRadius: 100, padding: ".4rem 1rem",
                fontSize: ".8rem", fontWeight: 700, color: s.color,
                marginBottom: "1.25rem",
              }}>
                {s.icon} {s.title}
              </div>

              <h1 style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 800,
                color: "#f1f5f9", letterSpacing: "-.025em", marginBottom: ".85rem",
              }}>
                {s.tagline}
              </h1>
              <p style={{
                color: "#94a3b8", fontSize: "1.05rem",
                lineHeight: 1.75, maxWidth: 520, marginBottom: "2rem",
              }}>
                {s.description}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/cotizacion" className="btn-cta-white">Solicitar Cotización</Link>
                <a href="#incluye"     className="btn-cta-outline-white">Ver qué incluye ↓</a>
              </div>
            </div>

            {/* Icono grande */}
            <div className="col-lg-5 d-none d-lg-flex justify-content-center">
              <div style={{
                width: 190, height: 190,
                background: `${s.color}18`,
                border: `2px solid ${s.color}30`,
                borderRadius: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "5.5rem",
              }}>
                {s.icon}
              </div>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="row g-3 mt-4">
            {[
              { label: "Duración estimada",     value: s.duration,  icon: "⏱" },
              { label: "Frecuencia recomendada", value: s.frequency, icon: "📅" },
              { label: "Garantía de satisfacción", value: "100%",   icon: "✅" },
            ].map(st => (
              <div className="col-md-4" key={st.label}>
                <div style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 14, padding: "1rem 1.25rem",
                  display: "flex", alignItems: "center", gap: ".85rem",
                }}>
                  <span style={{ fontSize: "1.4rem" }}>{st.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: ".72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      {st.label}
                    </p>
                    <p style={{ margin: 0, fontSize: ".9rem", color: "#e2e8f0", fontWeight: 700 }}>
                      {st.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE + IDEAL PARA ── */}
      <section id="incluye" className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="row g-5 align-items-start">

            {/* Incluye */}
            <div className="col-lg-6">
              <span className="section-badge">Cobertura del servicio</span>
              <h2 className="section-title">¿Qué incluye?</h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                {s.longDesc}
              </p>
              <div className="d-flex flex-column gap-2">
                {s.includes.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: ".75rem",
                    background: "var(--gray-bg)", borderRadius: 12, padding: ".75rem 1rem",
                  }}>
                    <span style={{
                      width: 24, height: 24, flexShrink: 0,
                      background: s.bgColor,
                      color: s.color, borderRadius: 7,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: ".8rem", fontWeight: 800,
                    }}>✓</span>
                    <span style={{ fontSize: ".9rem", color: "#334155", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal para + CTA card */}
            <div className="col-lg-6">
              <span className="section-badge">Perfil del cliente</span>
              <h2 className="section-title">¿Para quién es ideal?</h2>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {s.idealFor.map((tag, i) => (
                  <span key={i} style={{
                    background: s.bgColor, color: s.color,
                    border: `1.5px solid ${s.color}44`,
                    borderRadius: 100, padding: ".45rem 1.1rem",
                    fontSize: ".875rem", fontWeight: 600,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA card */}
              <div style={{
                background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}cc 100%)`,
                borderRadius: 20, padding: "2rem", color: "#fff",
              }}>
                <h4 style={{ fontWeight: 800, marginBottom: ".75rem" }}>¿Listo para empezar?</h4>
                <p style={{ opacity: .85, marginBottom: "1.5rem", fontSize: ".9rem", lineHeight: 1.7 }}>
                  Solicita tu cotización gratuita. Sin compromisos, sin letra pequeña.
                  Te respondemos en menos de 24 horas.
                </p>
                <Link to="/cotizacion" style={{
                  background: "#fff", color: s.color,
                  borderRadius: 12, padding: ".65rem 1.5rem",
                  fontWeight: 700, textDecoration: "none", fontSize: ".9rem",
                  display: "inline-block", transition: "transform .15s, box-shadow .15s",
                }}>
                  Solicitar Cotización →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section className="py-5" style={{ background: "var(--gray-bg)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Metodología</span>
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="section-sub">
              Nuestro proceso garantiza resultados consistentes y de calidad en cada visita.
            </p>
          </div>
          <div className="row g-4">
            {s.process.map((p, i) => (
              <div className="col-sm-6 col-lg-3" key={p.step}>
                <div style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 18, padding: "1.75rem",
                  height: "100%", position: "relative",
                }}>
                  <div style={{
                    width: 44, height: 44,
                    background: i === 0 ? s.color : "var(--gray-bg)",
                    color: i === 0 ? "#fff" : s.color,
                    border: `2px solid ${s.color}${i === 0 ? "" : "55"}`,
                    borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "1.1rem",
                    marginBottom: "1rem",
                  }}>
                    {p.step}
                  </div>
                  <h6 style={{ fontWeight: 700, color: "#0f172a", marginBottom: ".5rem", fontSize: ".975rem" }}>
                    {p.title}
                  </h6>
                  <p style={{ color: "#64748b", fontSize: ".875rem", lineHeight: 1.65, margin: 0 }}>
                    {p.desc}
                  </p>
                  {/* Flecha de conexión */}
                  {i < s.process.length - 1 && (
                    <div className="d-none d-lg-block" style={{
                      position: "absolute", right: -14, top: "2.75rem",
                      color: "#cbd5e1", fontSize: "1.2rem", zIndex: 2, lineHeight: 1,
                    }}>→</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTROS SERVICIOS ── */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-badge">Más servicios</span>
            <h2 className="section-title">También te puede interesar</h2>
          </div>
          <div className="row g-4">
            {otros.map(o => (
              <div className="col-md-4" key={o.slug}>
                <div className="service-card d-flex flex-column" style={{ height: "100%" }}>
                  <div className="icon-wrap">{o.icon}</div>
                  <h5>{o.title}</h5>
                  <p style={{ flex: 1 }}>
                    {o.description.length > 90 ? o.description.slice(0, 90) + "…" : o.description}
                  </p>
                  <Link
                    to={`/servicios/${o.slug}`}
                    className="btn-nav-outline btn mt-3"
                    style={{ padding: ".5rem 1.1rem", fontSize: ".875rem" }}
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
          <h2>¿Tienes preguntas sobre este servicio?</h2>
          <p>Revisa nuestras preguntas frecuentes o contáctanos directamente.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/cotizacion" className="btn-cta-white">Solicitar Cotización</Link>
            <Link to="/faq"        className="btn-cta-outline-white">Ver Preguntas Frecuentes</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ServicioDetalle;
