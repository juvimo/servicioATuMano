import { BASE as BASE_URL } from "./config";

export async function registrarUsuario(nombre, correo, password) {
  const res = await fetch(`${BASE_URL}/api/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error al registrarse");
  return data;
}

export async function loginUsuario(correo, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Correo o contraseña incorrectos");
  return data;
}

export async function verificarCodigo(correo, codigo) {
  const res = await fetch(`${BASE_URL}/api/auth/verificar-codigo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, codigo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Código incorrecto");
  return data;
}