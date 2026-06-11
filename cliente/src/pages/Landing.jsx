import Navbar from "../components/Navbar";
import logo2 from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero d-flex align-items-center" style={{ paddingTop: 80 }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="fw-bold display-5">Limpieza Profesional para tu Hogar y Negocio</h1>
              <p className="lead">Tu hogar impecable con la calidad, confianza y eficiencia que mereces.</p>
              <Link to="/cotizacion" className="btn btn-success btn-lg">Solicitar Cotización</Link>
            </div>
            <div className="col-md-6">
              <img src={logo2} className="img-fluid rounded shadow" alt="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-2">Nuestros Servicios</h2>
          <p className="text-muted mb-4">Ofrecemos una amplia gama de servicios de limpieza adaptados a tus necesidades.</p>
          <div className="row g-4">
            {[
              { icon: "🏠", title: "Limpieza Residencial", desc: "Servicio completo para tu hogar." },
              { icon: "🏢", title: "Limpieza Comercial",   desc: "Mantenimiento profesional." },
              { icon: "💧", title: "Limpieza Profunda",    desc: "Para espacios difíciles." },
              { icon: "✨", title: "Limpieza Post-Obra",   desc: "Eliminación de residuos." },
            ].map(s => (
              <div className="col-md-3" key={s.title}>
                <div className="service-card card">
                  <div className="icon">{s.icon}</div>
                  <h5>{s.title}</h5>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section id="nosotros" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src={logo3} className="img-fluid rounded shadow" alt="nosotros" />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold">¿Por qué elegirnos?</h2>
              <p>Brindamos servicios de limpieza de alta calidad con personal capacitado.</p>
              <ul className="list-unstyled">
                <li>✔ Personal profesional</li>
                <li>✔ Productos ecológicos</li>
                <li>✔ Horarios flexibles</li>
                <li>✔ Satisfacción garantizada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold">Contáctanos</h2>
          <p className="text-muted">Estamos listos para ayudarte.</p>
          <div className="row mt-4">
            <div className="col-md-4"><p>📞 Teléfono</p><p>+1 (555) 123-4567</p></div>
            <div className="col-md-4"><p>📧 Email</p><p>info@servicioatumano.com</p></div>
            <div className="col-md-4"><p>📍 Ubicación</p><p>Ciudad, País</p></div>
          </div>
          <Link to="/cotizacion" className="btn btn-success mt-3">Solicitar Cotización Ahora</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4"><h5>Servicio a tu Mano</h5><p>Tu socio confiable en limpieza.</p></div>
            <div className="col-md-4">
              <h5>Enlaces</h5>
              <ul>
                <li><Link to="/" className="text-muted text-decoration-none">Inicio</Link></li>
                <li><Link to="/cotizacion" className="text-muted text-decoration-none">Cotización</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Horario</h5>
              <p>Lunes - Viernes: 8AM - 6PM</p>
              <p>Sábado: 9AM - 4PM</p>
            </div>
          </div>
          <p className="text-center mt-4">© 2026 Servicio a tu Mano</p>
        </div>
      </footer>
    </>
  );
}

export default Landing;