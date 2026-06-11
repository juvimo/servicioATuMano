import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">

          {/* Marca */}
          <div className="col-md-4">
            <h5>Servicio a tu Mano</h5>
            <p style={{ maxWidth: 280 }}>
              Tu aliado de confianza en limpieza profesional. Calidad, eficiencia y
              satisfacción garantizada en cada visita.
            </p>
            <div className="footer-social">
              <a href="#" title="Facebook">📘</a>
              <a href="#" title="Instagram">📸</a>
              <a href="#" title="WhatsApp">💬</a>
            </div>
          </div>

          {/* Navegación */}
          <div className="col-6 col-md-2">
            <h5>Navegación</h5>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/faq">Preguntas Frecuentes</Link></li>
              <li><Link to="/cotizacion">Cotización</Link></li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="col-6 col-md-3">
            <h5>Servicios</h5>
            <ul>
              <li><Link to="/cotizacion">Limpieza Residencial</Link></li>
              <li><Link to="/cotizacion">Limpieza Comercial</Link></li>
              <li><Link to="/cotizacion">Limpieza Profunda</Link></li>
              <li><Link to="/cotizacion">Tapicería y Muebles</Link></li>
              <li><Link to="/cotizacion">Tapetes y Pisos</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-3">
            <h5>Contacto</h5>
            <p style={{ marginBottom: ".4rem" }}>📞 +1 (555) 123-4567</p>
            <p style={{ marginBottom: ".4rem" }}>📧 info@servicioatumano.com</p>
            <p style={{ marginBottom: "1.25rem" }}>📍 Ciudad, País</p>
            <h5>Horarios</h5>
            <p style={{ marginBottom: ".3rem" }}>Lun – Vie: 8AM – 6PM</p>
            <p>Sábado: 9AM – 4PM</p>
          </div>
        </div>

        <hr />
        <p className="footer-copy">
          © 2026 Servicio a tu Mano. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
