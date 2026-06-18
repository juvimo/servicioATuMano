import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { verificarCodigo } from "../api/auth";

function VerificacionCodigo() {
  const [searchParams] = useSearchParams();
  const correo = searchParams.get("correo") || "";

  const [codigo,   setCodigo]   = useState("");
  const [error,    setError]    = useState("");
  const [ok,       setOk]       = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const navigate = useNavigate();

  const handleVerificar = async (e) => {
    e?.preventDefault();
    setError("");

    if (codigo.length !== 5) {
      setError("El código debe tener 5 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await verificarCodigo(correo, codigo);
      setOk(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.message;
      setError(msg);
      if (msg.includes("No tienes más intentos") || msg.includes("agotado")) {
        setBloqueado(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">

        <div className="text-center mb-4">
          <img src={logo} className="login-logo mb-3" alt="logo" />
          <h2 className="mb-1">Verifica tu correo</h2>
          <p style={{ color: "#64748b", fontSize: ".9rem", margin: 0 }}>
            Ingresa el código de 5 dígitos que te enviamos a<br />
            <strong>{correo}</strong>
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
            <span>✓</span> ¡Cuenta verificada! Redirigiendo al inicio de sesión…
          </div>
        )}

        {!ok && !bloqueado && (
          <form onSubmit={handleVerificar}>
            <div className="mb-4">
              <label className="form-label">Código de verificación</label>
              <input
                type="text"
                className="form-control text-center"
                placeholder="_ _ _ _ _"
                maxLength={5}
                value={codigo}
                onChange={e => setCodigo(e.target.value.replace(/\D/g, ""))}
                style={{
                  fontSize: "2rem",
                  letterSpacing: "0.5rem",
                  fontWeight: "bold",
                  borderRadius: 10,
                  padding: "12px",
                }}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Verificando…" : "Confirmar código"}
            </button>
          </form>
        )}

        {bloqueado && (
          <div className="text-center mt-2" style={{ color: "#64748b", fontSize: ".875rem" }}>
            Has agotado los intentos disponibles. Contacta al soporte para desbloquear tu cuenta.
          </div>
        )}

        <div className="text-center mt-3">
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: ".85rem" }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerificacionCodigo;
