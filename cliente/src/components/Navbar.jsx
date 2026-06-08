import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
      <div className="container">
        <img src={logo} style={{ width: 40 }} className="me-2" alt="logo" />
        <Link className="navbar-brand fw-bold" to="/">Servicio a tu Mano</Link>

        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><a className="nav-link" href="#servicios">Servicios</a></li>
            <li className="nav-item"><a className="nav-link" href="#nosotros">Nosotros</a></li>
            <li className="nav-item"><a className="nav-link" href="#contacto">Contacto</a></li>
            <li className="nav-item ms-2">
              <Link to="/login" className="btn btn-outline-success">Acceso</Link>
            </li>
            <li className="nav-item ms-2">
              <Link to="/cotizacion" className="btn btn-success">Cotización</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
