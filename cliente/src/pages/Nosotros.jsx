import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo3 from "../assets/logo3.jpg";

const VALUES = [
  { icon: "🛡️", title: "Confianza",      desc: "Personal verificado y comprometido con la integridad en cada visita." },
  { icon: "⭐",  title: "Calidad",        desc: "Atención al detalle en cada rincón, sin excepciones." },
  { icon: "⚡",  title: "Eficiencia",     desc: "Llegamos puntual y terminamos en el tiempo acordado." },
  { icon: "🌿",  title: "Sostenibilidad", desc: "Productos ecológicos seguros para tu familia y el medioambiente." },
];

function Nosotros() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="steam-mist" />
        <div className="steam-wrap">
          <div className="steam-puff sp1" /><div className="steam-puff sp2" />
          <div className="steam-puff sp3" /><div className="steam-puff sp4" />
          <div className="steam-puff sp5" /><div className="steam-puff sp6" />
          <div className="steam-puff sp7" />
          <div className="steam-drop sd1" /><div className="steam-drop sd3" />
          <div className="steam-drop sd5" /><div className="steam-drop sd7" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 3 }}>
          <span className="section-badge">Sobre Nosotros</span>
          <h1>Más de 5 años transformando<br />hogares con dedicación</h1>
          <p>Limpieza profesional a vapor — sin químicos, sin residuos, con resultados reales.</p>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ── */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <img
                src={logo3}
                alt="Nuestro equipo"
                style={{
                  width: "100%", borderRadius: 24,
                  boxShadow: "0 28px 70px rgba(14,165,233,.1)",
                  border: "1.5px solid #dbeafe",
                }}
              />
            </div>
            <div className="col-lg-7">
              <span className="section-badge">Nuestra Historia</span>
              <h2 className="section-title">Nacimos de la necesidad<br />de hacerlo mejor</h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "1.75rem" }}>
                Servicio a tu Mano nació en 2019 con una idea simple: que cada familia merezca un
                hogar limpio con personal de confianza y resultados que se notan. Empezamos con
                tres empleados y hoy hemos atendido más de 500 hogares y empresas, siempre con el
                mismo compromiso que el primer día.
              </p>
              <div className="row g-3">
                {[
                  { n: "500+", l: "Clientes" },
                  { n: "98 %", l: "Satisfacción" },
                  { n: "5+",   l: "Años" },
                ].map(s => (
                  <div className="col-4" key={s.l}>
                    <div style={{
                      background: "#e0f2fe", border: "1.5px solid #bae6fd",
                      borderRadius: 16, padding: "1rem", textAlign: "center",
                    }}>
                      <p style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0284c7", margin: 0 }}>{s.n}</p>
                      <p style={{ fontSize: ".78rem", color: "#0369a1", fontWeight: 600, margin: 0, opacity: .85 }}>{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISIÓN & VISIÓN ── */}
      <section className="py-5" style={{ background: "#f0f9ff" }}>
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
                  Brindar servicios de limpieza que superen las expectativas de nuestros clientes,
                  usando personal capacitado, vapor de alta temperatura y productos ecológicos.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mission-card vision">
                <span className="mc-icon">🔭</span>
                <h4>Nuestra Visión</h4>
                <p>
                  Ser la empresa líder en limpieza a vapor de la región, reconocida por excelencia
                  y compromiso con la sostenibilidad, con presencia nacional para 2028.
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

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow-1" />
        <div className="cta-glow-2" />
        <div className="steam-mist" />
        <div className="steam-wrap">
          <div className="steam-puff sp1" /><div className="steam-puff sp2" />
          <div className="steam-puff sp3" /><div className="steam-puff sp4" />
          <div className="steam-puff sp5" /><div className="steam-puff sp6" />
          <div className="steam-puff sp7" />
          <div className="steam-drop sd2" /><div className="steam-drop sd4" />
          <div className="steam-drop sd6" /><div className="steam-drop sd8" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 3 }}>
          <h2>¿Listo para un espacio impecable?</h2>
          <p>Solicita tu cotización gratis y te contactamos en menos de 24 horas.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/cotizacion" className="btn-cta-white">Solicitar Cotización</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Nosotros;
