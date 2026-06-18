import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const dropRef   = useRef(null);

  const usuario = (() => {
    try { return JSON.parse(sessionStorage.getItem("usuario")); } catch { return null; }
  })();
  const esCliente = usuario?.rol === "cliente";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cierra el dropdown si se hace clic fuera */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario");
    window.location.href = "/";
  };

  const goSection = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("pendingScroll", id);
      navigate("/");
    }
  };

  const goInicio = (e) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }
  };

  return (
    <header className={`navbar-custom${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand-custom" onClick={goInicio}>
            <img src={logo} className="navbar-logo-img" alt="logo" />
            Servicio a tu Mano
          </Link>

          <nav className="navbar-links d-none d-lg-flex">
            <Link className="nav-link" to="/" onClick={goInicio}>Inicio</Link>
            <a className="nav-link" href="#servicios" onClick={goSection("servicios")}>Servicios</a>
            <Link className="nav-link" to="/nosotros">Nosotros</Link>
            <a className="nav-link" href="#contacto" onClick={goSection("contacto")}>Contacto</a>
          </nav>

          <div className="navbar-ctas d-none d-lg-flex">
            {esCliente ? (
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  className="btn-nav-outline"
                  style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                  onClick={() => setDropOpen(v => !v)}
                >
                  Bienvenido(a) a nuestra página, {usuario.nombre} ▾
                </button>
                {dropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.15)",
                    minWidth: 160, zIndex: 999, overflow: "hidden",
                  }}>
                    <button
                      onClick={cerrarSesion}
                      style={{
                        display: "block", width: "100%", padding: "12px 20px",
                        background: "none", border: "none", textAlign: "left",
                        cursor: "pointer", color: "#dc2626", fontWeight: 600,
                        fontSize: ".9rem",
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-nav-outline">Acceso</Link>
            )}
            <Link to="/cotizacion" className="btn-nav-solid">Cotización</Link>
          </div>

          <button className="navbar-hamburger d-lg-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <Link className="mobile-link" to="/" onClick={goInicio}>Inicio</Link>
            <a className="mobile-link" href="#servicios" onClick={goSection("servicios")}>Servicios</a>
            <Link className="mobile-link" to="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</Link>
            <a className="mobile-link" href="#contacto" onClick={goSection("contacto")}>Contacto</a>
            <div className="mobile-ctas">
              {esCliente ? (
                <>
                  <span className="btn-nav-outline text-center" style={{ cursor: "default" }}>
                    Bienvenido(a), {usuario.nombre}
                  </span>
                  <button
                    className="btn-nav-outline text-center"
                    style={{ cursor: "pointer", color: "#dc2626", border: "1.5px solid #dc2626", background: "none" }}
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-nav-outline text-center" onClick={() => setMenuOpen(false)}>Acceso</Link>
              )}
              <Link to="/cotizacion" className="btn-nav-solid text-center" onClick={() => setMenuOpen(false)}>Cotización</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
