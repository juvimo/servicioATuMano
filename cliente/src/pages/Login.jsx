import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { loginUsuario } from "../api/auth";

/* ─── Mascota que tapa los ojos ─── */
const Mascot = ({ covering }) => (
  <div className={`login-mascot${covering ? " covering" : ""}`}>
    <svg width="96" height="96" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* sombra */}
      <ellipse cx="60" cy="117" rx="26" ry="4" fill="rgba(0,0,0,.09)"/>
      {/* cuello */}
      <rect x="44" y="102" width="32" height="14" rx="9" fill="#0ea5e9"/>
      {/* orejas */}
      <circle cx="18"  cy="58" r="11" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
      <circle cx="102" cy="58" r="11" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
      {/* cabeza */}
      <circle cx="60" cy="56" r="40" fill="#fde68a" stroke="#f59e0b" strokeWidth="2.5"/>
      {/* ojos */}
      <g className="mascot-eyes">
        <ellipse cx="45" cy="50" rx="8.5" ry="9.5" fill="white"/>
        <circle  cx="46.5" cy="52"   r="6"   fill="#0f172a"/>
        <circle  cx="48.5" cy="49.5" r="2.2" fill="white"/>
        <ellipse cx="75"  cy="50" rx="8.5" ry="9.5" fill="white"/>
        <circle  cx="76.5" cy="52"   r="6"   fill="#0f172a"/>
        <circle  cx="78.5" cy="49.5" r="2.2" fill="white"/>
      </g>
      {/* mejillas */}
      <ellipse cx="32" cy="66" rx="7.5" ry="5" fill="#fca5a5" opacity="0.5"/>
      <ellipse cx="88" cy="66" rx="7.5" ry="5" fill="#fca5a5" opacity="0.5"/>
      {/* nariz */}
      <ellipse cx="60" cy="62" rx="4" ry="2.5" fill="#f59e0b" opacity="0.45"/>
      {/* boca feliz */}
      <path className="mascot-mouth-happy" d="M 46 72 Q 60 86 74 72"
        stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* boca tímida */}
      <path className="mascot-mouth-shy" d="M 48 76 Q 60 71 72 76"
        stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>

    {/* mano izquierda */}
    <div className="mascot-hand mascot-hand-l">
      <svg width="46" height="55" viewBox="0 0 46 55" fill="none">
        <rect x="4"  y="1"  width="10" height="19" rx="5" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="17" y="0"  width="10" height="19" rx="5" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="30" y="3"  width="10" height="17" rx="5" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="2"  y="14" width="42" height="30" rx="13" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
      </svg>
    </div>

    {/* mano derecha (espejada) */}
    <div className="mascot-hand mascot-hand-r">
      <svg width="46" height="55" viewBox="0 0 46 55" fill="none">
        <rect x="4"  y="1"  width="10" height="19" rx="5" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="17" y="0"  width="10" height="19" rx="5" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="30" y="3"  width="10" height="17" rx="5" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="2"  y="14" width="42" height="30" rx="13" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
      </svg>
    </div>
  </div>
);

function Login() {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [verPass,     setVerPass]     = useState(false);
  const [error,       setError]       = useState("");
  const [ok,          setOk]          = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const navigate = useNavigate();

  const covering = (passFocused || password.length > 0) && !verPass;

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(""); setOk(false);
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUsuario(email, password);
      sessionStorage.setItem("usuario", JSON.stringify(data));
      if (data.token) sessionStorage.setItem("token", data.token);
      setOk(true);
      setTimeout(() => {
        if (data.rol === "admin") navigate("/dashboard");
        else navigate("/");
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Fondo azul con vapor */}
      <div className="hero-orb hero-orb-1" style={{ opacity: .45 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: .4  }} />
      <div className="hero-orb hero-orb-3" style={{ opacity: .25 }} />
      <div className="steam-mist" />
      <div className="steam-wrap">
        <div className="steam-puff sp1"/><div className="steam-puff sp3"/>
        <div className="steam-puff sp5"/><div className="steam-puff sp7"/>
        <div className="steam-puff sp2"/><div className="steam-puff sp4"/>
        <div className="steam-drop sd1"/><div className="steam-drop sd3"/>
        <div className="steam-drop sd5"/><div className="steam-drop sd7"/>
      </div>

      {/* Contenedor mascota + tarjeta */}
      <div className="login-outer">

        {/* Mascota flotando sobre la tarjeta */}
        <div className={`login-mascot-float${covering ? " no-float" : ""}`}>
          <Mascot covering={covering} />
        </div>

        {/* Tarjeta blanca */}
        <div className="login-card-light">
          <div className="text-center mb-3">
            <img src={logo} className="login-logo-light mb-2" alt="logo" />
            <h2 className="login-title-light mb-1">Bienvenido</h2>
            <p style={{ color: "#64748b", fontSize: ".85rem", margin: 0 }}>
              Inicia sesión en tu cuenta
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3"
              style={{ fontSize: ".875rem", borderRadius: 10 }}>
              <span>⚠</span> {error}
            </div>
          )}
          {ok && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3"
              style={{ fontSize: ".875rem", borderRadius: 10 }}>
              <span>✓</span> Sesión iniciada. Redirigiendo…
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="mb-2">
              <label className="login-label">Correo Electrónico</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  className="login-field"
                  placeholder="correo@ejemplo.com"
                  autoComplete="off"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="login-label">Contraseña</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  type={verPass ? "text" : "password"}
                  className="login-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setVerPass(v => !v)}
                  tabIndex={-1}
                >
                  {verPass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                  }
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3"
              style={{ fontSize: ".82rem" }}>
              <label style={{ cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", gap: ".4rem" }}>
                <input type="checkbox" className="me-1" />
                Recordarme
              </label>
              <a href="#" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="btn-login-light" disabled={loading}>
              {loading ? "Verificando…" : "Iniciar Sesión"}
            </button>
          </form>

          <div className="text-center mt-2">
            <span style={{ color: "#64748b", fontSize: ".82rem" }}>¿No tienes cuenta? </span>
            <Link to="/registro" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none", fontSize: ".82rem" }}>
              Regístrate aquí
            </Link>
          </div>
          <div className="text-center mt-2">
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: ".8rem" }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
