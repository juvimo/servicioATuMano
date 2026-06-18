import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIAS = ["Todas", "Servicio", "Pagos", "Agendamiento", "Personal"];

const PREGUNTAS = [
  {
    cat: "Servicio",
    q: "¿Qué tipos de limpieza ofrecen?",
    a: "Ofrecemos limpieza residencial, comercial, profunda, post-obra, de muebles y tapicería, colchones, tapetes y pisos. Cada servicio está diseñado para responder a una necesidad específica con el equipo y los productos adecuados.",
  },
  {
    cat: "Servicio",
    q: "¿Con qué frecuencia debo contratar el servicio?",
    a: "Depende del uso del espacio. Para hogares recomendamos una limpieza regular semanal o quincenal. Para oficinas o locales comerciales puede ser diaria o tres veces por semana. Te asesoramos según tu situación específica.",
  },
  {
    cat: "Servicio",
    q: "¿Cuánto tiempo toma el servicio?",
    a: "Varía según el tamaño del espacio y el tipo de servicio. Una limpieza estándar de 60–80 m² toma entre 2 y 3 horas. Una limpieza profunda puede durar entre 4 y 6 horas. Te damos un estimado al momento de la cotización.",
  },
  {
    cat: "Servicio",
    q: "¿Qué productos de limpieza utilizan?",
    a: "Trabajamos exclusivamente con productos ecológicos certificados, biodegradables y seguros para niños, adultos mayores y mascotas. No utilizamos cloro ni productos abrasivos que puedan dañar superficies o afectar la salud.",
  },
  {
    cat: "Agendamiento",
    q: "¿Necesito estar en casa durante la limpieza?",
    a: "No es obligatorio. Muchos clientes nos dejan las llaves o un código de acceso. Garantizamos total discreción y seguridad. Eso sí, eres bienvenido a quedarte si así lo prefieres.",
  },
  {
    cat: "Agendamiento",
    q: "¿Puedo cancelar o reprogramar una cita?",
    a: "Sí. Puedes cancelar o reprogramar sin costo hasta 24 horas antes del servicio. Cancelaciones con menos de 24 horas de anticipación pueden estar sujetas a un cargo administrativo del 20%.",
  },
  {
    cat: "Agendamiento",
    q: "¿Trabajan los fines de semana y días festivos?",
    a: "Los sábados trabajamos de 9AM a 4PM. Los domingos y festivos nacionales no prestamos servicio regular, aunque en casos especiales podemos coordinar con un recargo adicional.",
  },
  {
    cat: "Pagos",
    q: "¿Cómo funciona el proceso de pago?",
    a: "Aceptamos efectivo, tarjeta de crédito/débito y transferencia bancaria. El pago se realiza al finalizar el servicio. Para servicios recurrentes ofrecemos facturación mensual con descuento del 10%.",
  },
  {
    cat: "Pagos",
    q: "¿Tienen algún cargo oculto?",
    a: "No. La cotización que recibes incluye mano de obra y productos. Si durante el servicio se detectan necesidades adicionales, te consultamos antes de proceder. Sin sorpresas.",
  },
  {
    cat: "Personal",
    q: "¿El personal está asegurado?",
    a: "Sí. Todo nuestro personal cuenta con seguridad social y seguro de accidentes de trabajo vigente. En caso de algún incidente, estamos completamente cubiertos.",
  },
  {
    cat: "Personal",
    q: "¿Cómo seleccionan a sus empleados?",
    a: "Realizamos verificación de antecedentes, referencias laborales y personales, entrevistas y un período de formación antes de que cualquier empleado entre a un hogar. La confianza es nuestra prioridad.",
  },
  {
    cat: "Servicio",
    q: "¿Qué pasa si no quedo satisfecho con el servicio?",
    a: "Te garantizamos satisfacción total. Si algo no cumplió tus expectativas, regresamos dentro de las 24 horas siguientes para corregirlo sin costo adicional. Tu tranquilidad es nuestra responsabilidad.",
  },
];

function FAQ() {
  const [catActiva, setCatActiva] = useState("Todas");
  const [abierta,   setAbierta]  = useState(null);

  const filtradas = catActiva === "Todas"
    ? PREGUNTAS
    : PREGUNTAS.filter(p => p.cat === catActiva);

  const toggle = (i) => setAbierta(prev => prev === i ? null : i);

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
          <span className="section-badge">Ayuda</span>
          <h1>Preguntas Frecuentes</h1>
          <p>
            Resolvemos las dudas más comunes sobre nuestros servicios, personal,
            pagos y agendamiento.
          </p>
        </div>
      </section>

      {/* ── ACORDEÓN ── */}
      <section className="py-5" style={{ background: "#f0f9ff" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              {/* Filtros de categoría */}
              <div className="faq-category">
                {CATEGORIAS.map(c => (
                  <button
                    key={c}
                    className={`faq-cat-btn${catActiva === c ? " active" : ""}`}
                    onClick={() => { setCatActiva(c); setAbierta(null); }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Preguntas */}
              {filtradas.map((p, i) => (
                <div key={i} className={`faq-item${abierta === i ? " open" : ""}`}>
                  <button className="faq-question" onClick={() => toggle(i)}>
                    <span>{p.q}</span>
                    <span className="faq-icon">{abierta === i ? "−" : "+"}</span>
                  </button>
                  {abierta === i && (
                    <div className="faq-answer">{p.a}</div>
                  )}
                </div>
              ))}

              {filtradas.length === 0 && (
                <p className="text-center py-4" style={{ color: "#64748b" }}>
                  No hay preguntas en esta categoría.
                </p>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── ¿AÚN TIENES DUDAS? ── */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center">
              <div style={{
                background: "#fff",
                border: "1.5px solid #dbeafe",
                borderRadius: 24,
                padding: "2.75rem",
                boxShadow: "0 8px 40px rgba(14,165,233,.08)",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "#e0f2fe", border: "1.5px solid #bae6fd",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem", fontSize: "1.75rem",
                }}>🤝</div>
                <h3 style={{ fontWeight: 800, color: "#0c1a2e", marginBottom: ".75rem" }}>
                  ¿No encontraste tu respuesta?
                </h3>
                <p style={{ color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.75 }}>
                  Nuestro equipo está disponible para resolver cualquier duda personalizada.
                  Escríbenos o llámanos directamente.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/cotizacion" className="btn-nav-solid btn"
                    style={{ padding: ".7rem 1.75rem" }}>
                    Solicitar Cotización
                  </Link>
                  <a href="mailto:info@servicioatumano.com" className="btn-nav-outline btn"
                    style={{ padding: ".7rem 1.75rem" }}>
                    Enviar Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow-1" />
        <div className="cta-glow-2" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2>Comienza hoy mismo</h2>
          <p>Solicita tu cotización gratuita. Sin compromisos, sin letra pequeña.</p>
          <Link to="/cotizacion" className="btn-cta-white">Quiero mi Cotización Gratis</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default FAQ;
