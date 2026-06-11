import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Register() {
  const [form,     setForm]     = useState({ nombre: "", email: "", telefono: "", password: "", confirm: "" });
  const [verPass,  setVerPass]  = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [error,    setError]    = useState("");
  const [ok,       setOk]       = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.email || !form.telefono || !form.password) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!terminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    sessionStorage.setItem("usuario", JSON.stringify({ email: form.email, rol: "cliente" }));
    setLoading(false);
    setOk(true);
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="login-bg">
      <div className="login-card" style={{ maxWidth: 480 }}>

        {/* Encabezado */}
        <div className="text-center mb-4">
          <img src={logo} className="login-logo mb-3" alt="logo" />
          <h2 className="mb-1">Crea tu cuenta</h2>
          <p style={{ color: "#64748b", fontSize: ".875rem", margin: 0 }}>
            Accede a cotizaciones, historial de servicios y más.
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3"
            style={{ fontSize: ".875rem", borderRadius: 10 }}>
            <span>⚠</span> {error}
          </div>
        )}
        {ok && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3"
            style={{ fontSize: ".875rem", borderRadius: 10 }}>
            <span>✓</span> Cuenta creada. Redirigiendo…
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="row g-3 mb-3">
            {/* Nombre */}
            <div className="col-12">
              <label className="form-label">Nombre Completo *</label>
              <div className="input-group login-input">
                <span className="input-group-text">👤</span>
                <input type="text" className="form-control" placeholder="Tu nombre completo"
                  value={form.nombre} onChange={set("nombre")} />
              </div>
            </div>

            {/* Email */}
            <div className="col-12">
              <label className="form-label">Correo Electrónico *</label>
              <div className="input-group login-input">
                <span className="input-group-text">📧</span>
                <input type="email" className="form-control" placeholder="correo@ejemplo.com"
                  value={form.email} onChange={set("email")} />
              </div>
            </div>

            {/* Teléfono */}
            <div className="col-12">
              <label className="form-label">Teléfono *</label>
              <div className="input-group login-input">
                <span className="input-group-text">📞</span>
                <input type="tel" className="form-control" placeholder="+1 (555) 000-0000"
                  value={form.telefono} onChange={set("telefono")} />
              </div>
            </div>

            {/* Contraseña */}
            <div className="col-12">
              <label className="form-label">Contraseña *</label>
              <div className="input-group login-input">
                <span className="input-group-text">🔒</span>
                <input type={verPass ? "text" : "password"} className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={set("password")} />
                <span className="input-group-text" style={{ cursor: "pointer", borderLeft: "none" }}
                  onClick={() => setVerPass(v => !v)}>
                  {verPass ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="col-12">
              <label className="form-label">Confirmar Contraseña *</label>
              <div className="input-group login-input">
                <span className="input-group-text">🔐</span>
                <input type={verPass ? "text" : "password"} className="form-control"
                  placeholder="Repite tu contraseña"
                  value={form.confirm} onChange={set("confirm")} />
              </div>
            </div>
          </div>

          {/* Términos */}
          <label className="d-flex align-items-start gap-2 mb-4" style={{ cursor: "pointer", fontSize: ".85rem", color: "#475569" }}>
            <input type="checkbox" className="mt-1" checked={terminos}
              onChange={e => setTerminos(e.target.checked)} />
            <span>
              Acepto los{" "}
              <a href="#" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                Términos y Condiciones
              </a>
              {" "}y la{" "}
              <a href="#" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                Política de Privacidad
              </a>
            </span>
          </label>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear Cuenta Gratis"}
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center mt-4 mb-0" style={{ fontSize: ".875rem", color: "#64748b" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
