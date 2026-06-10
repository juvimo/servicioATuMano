import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar-custom${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand-custom">
            <img src={logo} style={{ width: 36 }} alt="logo" />
            Servicio a tu Mano
          </Link>
          <nav className="navbar-links d-none d-lg-flex">
            <Link className="nav-link" to="/">Inicio</Link>
            <a className="nav-link" href="#servicios">Servicios</a>
            <Link className="nav-link" to="/nosotros">Nosotros</Link>
            <Link className="nav-link" to="/faq">FAQ</Link>
            <a className="nav-link" href="#contacto">Contacto</a>
          </nav>
          <div className="navbar-ctas d-none d-lg-flex">
            <Link to="/login"      className="btn-nav-outline">Acceso</Link>
            <Link to="/cotizacion" className="btn-nav-solid">Cotización</Link>
          </div>
          <button className="navbar-hamburger d-lg-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <Link className="mobile-link" to="/"           onClick={() => setMenuOpen(false)}>Inicio</Link>
            <a    className="mobile-link" href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            <Link className="mobile-link" to="/nosotros"   onClick={() => setMenuOpen(false)}>Nosotros</Link>
            <Link className="mobile-link" to="/faq"        onClick={() => setMenuOpen(false)}>FAQ</Link>
            <a    className="mobile-link" href="#contacto"  onClick={() => setMenuOpen(false)}>Contacto</a>
            <div className="mobile-ctas">
              <Link to="/login"      className="btn-nav-outline text-center" onClick={() => setMenuOpen(false)}>Acceso</Link>
              <Link to="/cotizacion" className="btn-nav-solid  text-center"  onClick={() => setMenuOpen(false)}>Cotización</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default Navbar;