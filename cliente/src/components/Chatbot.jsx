import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8000";

const FAQS = [
  {
    keywords: ["servicio", "ofrecen", "hacen", "limpian", "trabajan", "tipos"],
    pregunta: "¿Qué servicios ofrecen?",
    respuesta:
      "Ofrecemos **Limpieza Residencial**, **Limpieza Comercial**, **Limpieza Profunda**, **Limpieza Post-Obra** y **Lavado de Muebles a Vapor**. Cada servicio está pensado para dejar tu espacio impecable.",
  },
  {
    keywords: ["cotización", "cotizacion", "presupuesto", "solicitar", "pedir", "contratar"],
    pregunta: "¿Cómo solicito una cotización?",
    respuesta:
      "Puedes solicitar tu cotización en nuestra sección de **Cotización**. Solo ingresa los detalles de tu espacio y nos contactaremos contigo.",
  },
  {
    keywords: ["zona", "zonas", "donde", "municipio", "atienden", "ciudad", "ubican", "lleguen"],
    pregunta: "¿En qué zonas trabajan?",
    respuesta:
      "Atendemos en **Mosquera, Madrid, Funza** y municipios cercanos de Cundinamarca. Si tienes dudas sobre tu zona, escríbenos.",
  },
  {
    keywords: ["horario", "hora", "cuando", "cuándo", "días", "dias", "abierto", "disponibles"],
    pregunta: "¿Cuáles son sus horarios?",
    respuesta:
      "Trabajamos de **lunes a sábado de 7:00 a.m. a 6:00 p.m.** Para casos especiales podemos coordinar otros horarios.",
  },
  {
    keywords: ["personal", "capacitado", "confianza", "equipo", "trabajadores", "empleados"],
    pregunta: "¿El personal está capacitado?",
    respuesta:
      "Sí, todo nuestro equipo está **capacitado y es de confianza**. Contamos con los productos y equipos adecuados para cada tipo de limpieza.",
  },
  {
    keywords: ["precio", "costo", "cuesta", "cobran", "valor", "tarifa", "cuanto", "cuánto"],
    pregunta: "¿Cuáles son sus precios?",
    respuesta:
      "Los precios varían según el servicio. Para muebles:\n- Sofá 2 puestos: desde $65,000 COP\n- Sofá 3 puestos: desde $90,000 COP\n- Sillón: desde $40,000 COP\n- Colchón: desde $50,000 COP\n\nPara una cotización exacta usa la sección de **Cotización** o sube fotos con el botón 📷.",
  },
];

const SALUDOS_RE = /^(hola|hello|hey|buenos?\s*d[íi]as?|buenas?\s*(tardes?|noches?)?|saludos?|qu[eé]\s*tal|buen\s*d[íi]a)\s*[!.¡]*$/i;

const MANCHAS_RE = /(mancha|manchas|sucio|suciedad|mueble|sofa|sofá|sillón|silln|colchon|colchón|tapiz|cuero|tela|lavar|limpiar|quitar)/i;

const FAQ_LISTA = FAQS.map((f) => f.pregunta);

const WELCOME = {
  id: 0,
  from: "bot",
  text: "¡Hola! 👋 Soy el asistente de **Servicio a tu Mano**.\n\nPuedo responder tus preguntas y analizar manchas en tus muebles con IA. ¿En qué te ayudo?",
  opciones: ["📸 Analizar manchas con IA", ...FAQ_LISTA],
};

function parseMarkdown(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;

    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("- ");
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/);

    const raw = isBullet
      ? trimmed.slice(2)
      : numberedMatch
      ? numberedMatch[2]
      : trimmed;

    const parts = raw.split(/\*\*(.*?)\*\*/g).map((p, j) =>
      j % 2 === 1 ? <strong key={j}>{p}</strong> : p
    );

    if (isBullet) {
      return (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
          <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>•</span>
          <span>{parts}</span>
        </div>
      );
    }
    if (numberedMatch) {
      return (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
          <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0, minWidth: 16 }}>
            {numberedMatch[1]}.
          </span>
          <span>{parts}</span>
        </div>
      );
    }
    return <div key={i} style={{ marginBottom: 3 }}>{parts}</div>;
  });
}

function respuestaLocal(texto) {
  const lower = texto.toLowerCase();

  // Saludo
  if (SALUDOS_RE.test(texto.trim())) {
    return {
      text: "¡Hola! 😊 ¿En qué puedo ayudarte? Puedo contarte sobre nuestros servicios, zonas, precios o analizar manchas en tus muebles.",
      opciones: ["📸 Analizar manchas con IA", ...FAQ_LISTA],
    };
  }

  // Agradecimiento
  if (/^(gracias|muchas gracias|ok|okay|listo|perfecto|excelente|genial|de acuerdo)\s*[!.]*$/i.test(texto.trim())) {
    return {
      text: "¡Con mucho gusto! 😊 ¿Hay algo más en lo que pueda ayudarte?",
      opciones: ["📸 Analizar manchas con IA", ...FAQ_LISTA],
    };
  }

  // Manchas sin imagen
  if (MANCHAS_RE.test(lower) && !/precio|costo|cuesta|cobran|valor|tarifa|cuanto|cuánto/.test(lower)) {
    return {
      text: "Para analizar manchas en muebles con IA y darte una estimación de precio, usa el botón 📷 para subir fotos del mueble. También puedes describir la situación en texto.",
      opciones: ["📸 Analizar manchas con IA", "¿Cuáles son sus precios?"],
    };
  }

  // Busca en FAQs por keywords
  const faq = FAQS.find((f) =>
    f.keywords.some((k) => lower.includes(k)) ||
    f.pregunta.toLowerCase().includes(lower) ||
    lower.includes(f.pregunta.toLowerCase().slice(0, 8))
  );

  if (faq) {
    return {
      text: faq.respuesta,
      opciones: ["¿Algo más en lo que pueda ayudarte?", "Ir a Cotización"],
    };
  }

  // No entendió
  return {
    text: "No estoy seguro de entenderte. ¿Sobre qué quieres saber? Elige una opción o escribe con más detalle.",
    opciones: FAQ_LISTA,
  };
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [inputVal, setInputVal] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  async function callAI(mensaje, imgs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const formData = new FormData();
    formData.append("mensaje", mensaje || "");
    imgs.forEach((img) => formData.append("imagenes", img.file));
    try {
      const res = await fetch(`${API_URL}/api/chatbot`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      return data.respuesta;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function handleSend(texto, imgs) {
    const userMsg = {
      id: Date.now(),
      from: "user",
      text: texto || "",
      imagePreviews: imgs.map((i) => i.preview),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setImagenes([]);

    // Con imágenes → llama a la IA
    if (imgs.length > 0) {
      setLoading(true);
      try {
        const respuesta = await callAI(texto, imgs);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            from: "bot",
            text: respuesta,
            isAI: true,
            opciones: ["📸 Analizar otro mueble", "Ir a Cotización"],
          },
        ]);
      } catch (err) {
        const esTimeout = err.name === "AbortError";
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            from: "bot",
            text: esTimeout
              ? "La respuesta tardó demasiado. Verifica que el servidor esté activo e intenta de nuevo."
              : "No pude conectarme al servidor en este momento.",
            opciones: ["📸 Analizar manchas con IA", "Ir a Cotización"],
          },
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Solo texto → respuesta local inmediata
    const { text, opciones } = respuestaLocal(texto);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "bot", text, opciones },
    ]);
  }

  function handleInput(e) {
    e.preventDefault();
    if (!inputVal.trim() && imagenes.length === 0) return;
    handleSend(inputVal.trim(), imagenes);
  }

  function handleOptionClick(op) {
    if (op === "Ir a Cotización") {
      window.location.href = "/cotizacion";
      return;
    }
    if (op === "📸 Analizar manchas con IA" || op === "📸 Analizar otro mueble") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "user", text: op },
        {
          id: Date.now() + 1,
          from: "bot",
          text: "Usa el botón 📷 para adjuntar fotos del mueble y cuéntame:\n\n- **¿Qué tipo de mueble?** (sofá, sillón, colchón…)\n- **¿Qué tamaño?** (2 puestos, 3 puestos, etc.)\n- **¿Qué manchas y hace cuánto?**",
        },
      ]);
      return;
    }
    if (op === "¿Algo más en lo que pueda ayudarte?") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          from: "bot",
          text: "Claro, ¿en qué más te puedo ayudar?",
          opciones: ["📸 Analizar manchas con IA", ...FAQ_LISTA],
        },
      ]);
      return;
    }
    // FAQ u otras opciones → respuesta local
    const faq = FAQS.find((f) => f.pregunta === op);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: op },
      {
        id: Date.now() + 1,
        from: "bot",
        text: faq ? faq.respuesta : respuestaLocal(op).text,
        opciones: ["¿Algo más en lo que pueda ayudarte?", "Ir a Cotización"],
      },
    ]);
  }

  function handleFileChange(e) {
    const slots = 3 - imagenes.length;
    if (slots <= 0) return;
    const newFiles = Array.from(e.target.files).slice(0, slots);
    setImagenes((prev) =>
      [...prev, ...newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }))].slice(0, 3)
    );
    e.target.value = "";
  }

  function removeImage(idx) {
    setImagenes((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function resetChat() {
    imagenes.forEach((img) => URL.revokeObjectURL(img.preview));
    setMessages([WELCOME]);
    setInputVal("");
    setImagenes([]);
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.55); opacity: 0.45; }
          40%            { transform: scale(1);    opacity: 1;    }
        }
      `}</style>

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Asistente virtual"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
          border: "none", boxShadow: "0 4px 20px rgba(22,163,74,0.45)",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "transform .2s, box-shadow .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(22,163,74,0.55)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.45)"; }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M4 6C4 4.9 4.9 4 6 4H26C27.1 4 28 4.9 28 6V20C28 21.1 27.1 22 26 22H10L4 28V6Z" fill="white" fillOpacity="0.95" />
            <circle cx="16" cy="13" r="1.4" fill="#16a34a" />
            <circle cx="21" cy="13" r="1.4" fill="#16a34a" />
            <circle cx="11" cy="13" r="1.4" fill="#16a34a" />
          </svg>
        )}
      </button>

      {/* Panel del chat */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9998,
          width: 370, maxHeight: 560, borderRadius: 18,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)", display: "flex",
          flexDirection: "column", overflow: "hidden", background: "#fff",
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            padding: "14px 18px", display: "flex", alignItems: "center",
            gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>🧹</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                Asistente Servicio a tu Mano
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                IA · Análisis de manchas · Precios
              </div>
            </div>
            <button onClick={resetChat} title="Reiniciar chat" style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: 8, padding: "4px 8px", cursor: "pointer",
              color: "#fff", fontSize: 11,
            }}>↺ Reiniciar</button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 6px",
            display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc",
          }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                {/* Imágenes del usuario */}
                {msg.from === "user" && msg.imagePreviews?.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 5, marginBottom: msg.text ? 5 : 0, flexWrap: "wrap" }}>
                    {msg.imagePreviews.map((src, i) => (
                      <img key={i} src={src} alt="adjunto" style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "2px solid #16a34a" }} />
                    ))}
                  </div>
                )}

                {/* Burbuja */}
                {msg.text && (
                  <div style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "87%", padding: "9px 13px",
                      borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.from === "user" ? "#16a34a" : "#fff",
                      color: msg.from === "user" ? "#fff" : "#1e293b",
                      fontSize: 13, lineHeight: 1.55,
                      boxShadow: msg.from === "bot" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    }}>
                      {parseMarkdown(msg.text)}
                      {msg.isAI && (
                        <div style={{
                          marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4,
                          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20,
                          padding: "2px 8px", fontSize: 10, color: "#15803d", fontWeight: 600,
                        }}>✨ Análisis con IA</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Opciones */}
                {msg.from === "bot" && msg.opciones && (
                  <div style={{ marginTop: 7, display: "flex", flexDirection: "column", gap: 5 }}>
                    {msg.opciones.map((op) => (
                      <button key={op} onClick={() => handleOptionClick(op)} style={{
                        background: "#fff", border: "1.5px solid #16a34a", borderRadius: 10,
                        padding: "6px 11px", fontSize: 12, color: "#16a34a", cursor: "pointer",
                        textAlign: "left", fontWeight: 500, transition: "background .15s",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                      >{op}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Cargando (solo para análisis de imágenes) */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  background: "#fff", borderRadius: "16px 16px 16px 4px",
                  padding: "10px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex", gap: 5, alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: 8, height: 8, background: "#16a34a", borderRadius: "50%",
                      display: "inline-block",
                      animation: `dot-pulse 1.4s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>Analizando con IA…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Miniaturas */}
          {imagenes.length > 0 && (
            <div style={{
              padding: "8px 12px 4px", display: "flex", gap: 7, alignItems: "center",
              borderTop: "1px solid #e2e8f0", background: "#fff", flexShrink: 0,
            }}>
              {imagenes.map((img, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img src={img.preview} alt={img.name} style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8, border: "2px solid #16a34a" }} />
                  <button onClick={() => removeImage(idx)} style={{
                    position: "absolute", top: -6, right: -6, background: "#ef4444",
                    border: "none", borderRadius: "50%", width: 18, height: 18,
                    cursor: "pointer", color: "white", fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  }}>×</button>
                </div>
              ))}
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{imagenes.length}/3 foto{imagenes.length !== 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleInput} style={{
            display: "flex", borderTop: "1px solid #e2e8f0", padding: "10px 12px",
            gap: 7, background: "#fff", alignItems: "center", flexShrink: 0,
          }}>
            <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleFileChange} style={{ display: "none" }} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              disabled={imagenes.length >= 3 || loading}
              title={imagenes.length >= 3 ? "Máximo 3 fotos" : "Adjuntar foto del mueble"}
              style={{
                background: imagenes.length >= 3 || loading ? "#f1f5f9" : "#f0fdf4",
                border: `1.5px solid ${imagenes.length >= 3 || loading ? "#e2e8f0" : "#16a34a"}`,
                borderRadius: 10, width: 38, height: 38,
                cursor: imagenes.length >= 3 || loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 18, opacity: imagenes.length >= 3 || loading ? 0.5 : 1,
              }}>📷</button>

            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={imagenes.length > 0 ? "Describe el mueble y las manchas…" : "Escribe tu mensaje…"}
              disabled={loading}
              style={{
                flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 10,
                padding: "8px 12px", fontSize: 13, outline: "none",
                fontFamily: "inherit", color: "#1e293b",
                background: loading ? "#f8fafc" : "#fff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />

            <button type="submit"
              disabled={loading || (!inputVal.trim() && imagenes.length === 0)}
              style={{
                background: loading || (!inputVal.trim() && imagenes.length === 0) ? "#86efac" : "#16a34a",
                border: "none", borderRadius: 10, width: 38, height: 38,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: loading || (!inputVal.trim() && imagenes.length === 0) ? "not-allowed" : "pointer",
                flexShrink: 0,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
