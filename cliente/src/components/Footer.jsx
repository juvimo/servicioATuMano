import { Link } from "react-router-dom";

const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.41 9a19.79 19.79 0 01-3.07-8.67A2 2 0 012.33 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IconEmail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">

          {/* Marca */}
          <div className="col-md-4">
            <h5>Servicio a tu Mano</h5>
            <p style={{ maxWidth: 280 }}>
              Tu aliado de confianza en limpieza profesional a vapor. Calidad, eficiencia y
              satisfacción garantizada en cada visita.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/share/1H5poLzEWt/" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/servicio.a.tu.mano?igsh=MTlzYWc0YTNhbHY4NA==" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event("openChatbot"))}
                title="Chatbot"
                aria-label="Abrir chatbot"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", display: "inline-flex", alignItems: "center" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.004 2C6.477 2 2 6.477 2 12.004a9.96 9.96 0 001.407 5.136L2 22l4.98-1.384A9.964 9.964 0 0012.004 22C17.531 22 22 17.523 22 12.004 22 6.477 17.531 2 12.004 2z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Navegación */}
          <div className="col-6 col-md-2">
            <h5>Navegación</h5>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
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
            <p style={{ marginBottom: ".4rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <IconPhone /> Juan Pablo: 321 219 6255
            </p>
            <p style={{ marginBottom: ".4rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <IconPhone /> Sandra Milena: 312 527 6445
            </p>
            <p style={{ marginBottom: ".4rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <IconEmail /> info@servicioatumano.com
            </p>
            <p style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <IconLocation /> Alrededores de Cundinamarca · A domicilio
            </p>
            <h5>Horarios</h5>
            <p style={{ marginBottom: ".3rem" }}>Lun – Sáb: 7AM – 6PM</p>
            <p>Dom: Previa cita</p>
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
