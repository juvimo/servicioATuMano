import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { loginUsuario } from "../api/auth";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [verPass,  setVerPass]  = useState(false);
  const [error,    setError]    = useState("");
  const [ok,       setOk]       = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

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
      setOk(true);
      setTimeout(() => {
        console.log("DATA:", data);
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
    <div className="login-bg">
      <div className="login-card">

        <div className="text-center mb-4">
          <img src={logo} className="login-logo mb-3" alt="logo" />
          <h2 className="mb-1">Bienvenido</h2>
          <p style={{ color: "#64748b", fontSize: ".9rem", margin: 0 }}>
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
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-group login-input">
              <span className="input-group-text">📧</span>
              <input type="email" className="form-control" placeholder="correo@ejemplo.com"
                autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group login-input">
              <span className="input-group-text">🔒</span>
              <input type={verPass ? "text" : "password"} className="form-control" placeholder="••••••••"
                autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
              <span className="input-group-text" style={{ cursor: "pointer", borderLeft: "none" }}
                onClick={() => setVerPass(v => !v)}>
                {verPass ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4"
            style={{ fontSize: ".85rem" }}>
            <label style={{ cursor: "pointer", color: "#475569" }}>
              <input type="checkbox" className="me-2" />
              Recordarme
            </label>
            <a href="#" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Verificando…" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span style={{ color: "#64748b", fontSize: ".85rem" }}>¿No tienes cuenta? </span>
          <Link to="/registro" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none", fontSize: ".85rem" }}>
            Regístrate aquí
          </Link>
        </div>

        <div className="text-center mt-3">
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: ".85rem" }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;