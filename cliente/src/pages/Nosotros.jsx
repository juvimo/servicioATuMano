import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo2 from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";

const VALUES = [
  {
    icon: "🛡️",
    title: "Confianza",
    desc: "Construimos relaciones duraderas. Nuestro personal es verificado, capacitado y comprometido con la integridad en cada hogar.",
  },
  {
    icon: "⭐",
    title: "Calidad",
    desc: "No nos conformamos con 'suficiente'. Cada rincón recibe el mismo nivel de atención y cuidado que el primero.",
  },
  {
    icon: "⚡",
    title: "Eficiencia",
    desc: "Tu tiempo es valioso. Llegamos puntual, trabajamos con metodología y terminamos en el tiempo acordado.",
  },
  {
    icon: "🌿",
    title: "Sostenibilidad",
    desc: "Usamos productos ecológicos certificados, seguros para tu familia, tus mascotas y el medio ambiente.",
  },
];

const TEAM = [
  {
    initials: "JL",
    name: "Juana López",
    role: "Fundadora & CEO",
    bio: "Con más de 10 años en el sector, Juana fundó la empresa con la misión de elevar el estándar de limpieza en la región.",
  },
  {
    initials: "MC",
    name: "María Castro",
    role: "Coordinadora de Operaciones",
    bio: "Garantiza que cada servicio se entregue con excelencia, coordinando equipos y asegurando la satisfacción del cliente.",
  },
  {
    initials: "CR",
    name: "Carlos Ríos",
    role: "Jefe de Calidad",
    bio: "Desarrolla protocolos de limpieza y supervisa que los estándares de calidad se cumplan en cada visita.",
  },
];

const MILESTONES = [
  { year: "2019", event: "Fundación de la empresa con 3 empleados y 10 clientes." },
  { year: "2021", event: "Expansión a limpieza comercial. Primer contrato corporativo." },
  { year: "2023", event: "Certificación en productos ecológicos. +200 clientes activos." },
  { year: "2025", event: "Lanzamiento de plataforma digital y sistema de cotizaciones online." },
];

function Nosotros() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="section-badge">Sobre Nosotros</span>
          <h1>Más de 5 años transformando<br />hogares con dedicación</h1>
          <p>
            Somos un equipo apasionado que combina técnica, cuidado y responsabilidad
            para brindarte un espacio impecable.
          </p>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ── */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <img src={logo3} alt="Nuestro equipo"
                style={{ width: "100%", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,.1)" }} />
            </div>
            <div className="col-lg-7">
              <span className="section-badge">Nuestra Historia</span>
              <h2 className="section-title">Nacimos de la necesidad<br />de hacerlo mejor</h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                Servicio a tu Mano nació en 2019 con una idea simple: que cada familia
                merezca un hogar limpio sin complicaciones, con personal de confianza
                y resultados que se notan.
              </p>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "1.75rem" }}>
                Empezamos con tres empleados y diez clientes. Hoy somos un equipo
                consolidado que ha atendido a más de 500 hogares y empresas, siempre
                con el mismo compromiso que el primer día.
              </p>
              <div className="row g-3">
                {[
                  { n: "500+", l: "Clientes" },
                  { n: "98%",  l: "Satisfacción" },
                  { n: "5+",   l: "Años" },
                ].map(s => (
                  <div className="col-4" key={s.l}>
                    <div style={{
                      background: "var(--primary-light)",
                      borderRadius: 14,
                      padding: "1rem",
                      textAlign: "center",
                    }}>
                      <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)", margin: 0 }}>{s.n}</p>
                      <p style={{ fontSize: ".8rem", color: "#15803d", fontWeight: 600, margin: 0 }}>{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISIÓN & VISIÓN ── */}
      <section className="py-5" style={{ background: "var(--gray-bg)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Propósito</span>
            <h2 className="section-title">Lo que nos mueve cada día</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mission-card">
                <span className="mc-icon">🎯</span>
                <h4>Nuestra Misión</h4>
                <p>
                  Brindar servicios de limpieza profesional que superen las expectativas de
                  nuestros clientes, generando bienestar en sus espacios mediante personal
                  capacitado, productos ecológicos y un servicio ágil y confiable.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mission-card vision">
                <span className="mc-icon">🔭</span>
                <h4>Nuestra Visión</h4>
                <p>
                  Ser la empresa líder en servicios de limpieza de la región, reconocida por
                  su excelencia, innovación y compromiso con la sostenibilidad, expandiendo
                  nuestra presencia a nivel nacional para 2028.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Nuestros Valores</span>
            <h2 className="section-title">Los principios que nos guían</h2>
            <p className="section-sub">
              Cada decisión, cada contratación y cada visita está basada en estos cuatro pilares.
            </p>
          </div>
          <div className="row g-4">
            {VALUES.map(v => (
              <div className="col-sm-6 col-lg-3" key={v.title}>
                <div className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <h5>{v.title}</h5>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LÍNEA DE TIEMPO ── */}
      <section className="py-5" style={{ background: "var(--gray-bg)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Trayectoria</span>
            <h2 className="section-title">Nuestro recorrido</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="d-flex gap-4 mb-4 align-items-start">
                  <div style={{
                    width: 56, height: 56, flexShrink: 0,
                    background: i % 2 === 0 ? "var(--primary)" : "var(--dark)",
                    borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: ".875rem",
                  }}>
                    {m.year}
                  </div>
                  <div style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "1rem 1.25rem",
                    flex: 1,
                  }}>
                    <p style={{ margin: 0, color: "#334155", fontSize: ".9rem", lineHeight: 1.6 }}>
                      {m.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Nuestro Equipo</span>
            <h2 className="section-title">Las personas detrás del servicio</h2>
            <p className="section-sub">
              Un equipo comprometido, capacitado y apasionado por entregar lo mejor.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {TEAM.map(t => (
              <div className="col-sm-6 col-lg-4" key={t.name}>
                <div className="team-card">
                  <div className="team-avatar">{t.initials}</div>
                  <h5>{t.name}</h5>
                  <p className="team-role">{t.role}</p>
                  <p>{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2>¿Listo para un espacio impecable?</h2>
          <p>Solicita tu cotización gratis y te contactamos en menos de 24 horas.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/cotizacion" className="btn-cta-white">Solicitar Cotización</Link>
            <Link to="/faq" className="btn-cta-outline-white">Ver Preguntas Frecuentes</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Nosotros;
