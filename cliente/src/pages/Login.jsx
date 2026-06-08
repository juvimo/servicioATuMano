import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ping } from "../api/servicios";

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
      // Verifica que el backend esté activo
      // Cuando tengas /auth/login, reemplaza ping() por:
      // await axios.post("http://localhost:8000/auth/login", { email, password })
      await ping();
      sessionStorage.setItem("usuario", JSON.stringify({ email, rol: "admin" }));
      setOk(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch {
      // Modo demo si el backend no está disponible
      sessionStorage.setItem("usuario", JSON.stringify({ email, rol: "admin" }));
      setOk(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="login-card text-center">
        <img src={logo} className="login-logo mb-3" alt="logo" />
        <h2 className="fw-bold">Bienvenido</h2>
        <p className="text-muted">Inicia sesión en tu cuenta</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {ok    && <div className="alert alert-success">✔ Sesión iniciada. Redirigiendo...</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label>Correo Electrónico</label>
            <div className="input-group">
              <span className="input-group-text">📧</span>
              <input type="email" className="form-control" placeholder="correo@ejemplo.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="mb-3 text-start">
            <label>Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">🔒</span>
              <input type={verPass ? "text" : "password"} className="form-control" placeholder="********"
                value={password} onChange={e => setPassword(e.target.value)} />
              <span className="input-group-text" style={{ cursor: "pointer" }}
                onClick={() => setVerPass(!verPass)}>👁</span>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <label><input type="checkbox" className="me-1" /> Recordarme</label>
            <a href="#" className="text-decoration-none">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="demo-box mt-4">
          Demo: Usa cualquier email y contraseña para acceder
        </div>
      </div>
    </div>
  );
}

export default Login;
