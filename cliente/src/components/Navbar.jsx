import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Navega a una sección del Landing sin recargar la página */
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

  /* Inicio: si ya está en "/" solo hace scroll al tope y limpia hash */
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
            <img src={logo} style={{ width: 36 }} alt="logo" />
            Servicio a tu Mano
          </Link>

          <nav className="navbar-links d-none d-lg-flex">
            <Link className="nav-link" to="/" onClick={goInicio}>Inicio</Link>
            <a className="nav-link" href="#servicios" onClick={goSection("servicios")}>Servicios</a>
            <Link className="nav-link" to="/nosotros">Nosotros</Link>
            <a className="nav-link" href="#contacto"  onClick={goSection("contacto")}>Contacto</a>
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
            <Link className="mobile-link" to="/"          onClick={goInicio}>Inicio</Link>
            <a    className="mobile-link" href="#servicios" onClick={goSection("servicios")}>Servicios</a>
            <Link className="mobile-link" to="/nosotros"  onClick={() => setMenuOpen(false)}>Nosotros</Link>
            <a    className="mobile-link" href="#contacto"  onClick={goSection("contacto")}>Contacto</a>
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
