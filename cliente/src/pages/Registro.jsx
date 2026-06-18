import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { registrarUsuario } from "../api/auth";

function Registro() {
  const [nombre,   setNombre]   = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [verPass,  setVerPass]  = useState(false);
  const [error,    setError]    = useState("");
  const [ok,       setOk]       = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e?.preventDefault();
    setError(""); setOk(false);

    if (!nombre || !email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await registrarUsuario(nombre, email, password);
      setOk(true);
      setTimeout(() => navigate(`/verificar-codigo?correo=${encodeURIComponent(email)}`), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="login-card text-center">
        <img src={logo} className="login-logo mb-3" alt="logo" />
        <h2 className="fw-bold">Crear Cuenta</h2>
        <p className="text-muted">Regístrate para comenzar</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {ok && (
          <div className="alert alert-success">
            ✔ Registro exitoso. Revisa tu correo para confirmar tu cuenta.
          </div>
        )}

        {!ok && (
          <form onSubmit={handleRegistro}>
            <div className="mb-3 text-start">
              <label>Nombre Completo</label>
              <div className="input-group">
                <span className="input-group-text">👤</span>
                <input type="text" className="form-control" placeholder="Tu nombre"
                  value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
            </div>

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

            <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>
        )}

        <p className="mt-3">
          ¿Ya tienes cuenta? <a href="/login" className="text-decoration-none">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Registro;