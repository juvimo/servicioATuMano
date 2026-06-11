import { useState, useRef, useEffect } from "react";

const FAQS = [
  {
    pregunta: "¿Qué servicios ofrecen?",
    respuesta:
      "Ofrecemos Limpieza Residencial, Limpieza Comercial, Limpieza Profunda y Limpieza Post-Obra. Cada servicio está pensado para dejar tu espacio impecable.",
  },
  {
    pregunta: "¿Cómo solicito una cotización?",
    respuesta:
      "Puedes solicitar tu cotización directamente en nuestra sección de Cotización. Solo ingresa los detalles de tu espacio y nos contactaremos contigo.",
  },
  {
    pregunta: "¿En qué zonas trabajan?",
    respuesta:
      "Atendemos en Mosquera, Madrid, Funza y municipios cercanos de Cundinamarca. Si tienes dudas sobre tu zona, escríbenos.",
  },
  {
    pregunta: "¿Cuáles son sus horarios?",
    respuesta:
      "Trabajamos de lunes a sábado de 7:00 a.m. a 6:00 p.m. Para casos especiales podemos coordinar otros horarios.",
  },
  {
    pregunta: "¿El personal está capacitado?",
    respuesta:
      "Sí, todo nuestro equipo está capacitado, es de confianza y cuenta con los productos adecuados para cada tipo de limpieza.",
  },
];

const WELCOME = {
  id: 0,
  from: "bot",
  text: "¡Hola! 👋 Soy el asistente de **Servicio a tu Mano**. ¿En qué puedo ayudarte hoy?",
  opciones: FAQS.map((f) => f.pregunta),
};

function parseText(text) {
  // bold **texto**
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i}>{p}</strong> : p
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [inputVal, setInputVal] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleOption(pregunta) {
    const faq = FAQS.find((f) => f.pregunta === pregunta);
    const userMsg = { id: Date.now(), from: "user", text: pregunta };
    const botMsg = {
      id: Date.now() + 1,
      from: "bot",
      text: faq
        ? faq.respuesta
        : "Lo siento, no tengo información sobre eso. ¿Puedo ayudarte con otra consulta?",
      opciones: ["Ver todas las preguntas", "Ir a Cotización"],
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  }

  function handleInput(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal.trim();
    setInputVal("");
    const userMsg = { id: Date.now(), from: "user", text };

    // simple keyword match
    const match = FAQS.find((f) =>
      f.respuesta.toLowerCase().includes(text.toLowerCase()) ||
      f.pregunta.toLowerCase().includes(text.toLowerCase())
    );

    const botMsg = {
      id: Date.now() + 1,
      from: "bot",
      text: match
        ? match.respuesta
        : "No encontré una respuesta exacta, pero puedo ayudarte con estas opciones:",
      opciones: match
        ? ["Ver todas las preguntas"]
        : FAQS.map((f) => f.pregunta),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  }

  function handleSpecial(op) {
    if (op === "Ver todas las preguntas") {
      const botMsg = {
        id: Date.now(),
        from: "bot",
        text: "Claro, estas son las preguntas frecuentes:",
        opciones: FAQS.map((f) => f.pregunta),
      };
      setMessages((prev) => [...prev, botMsg]);
    } else if (op === "Ir a Cotización") {
      window.location.href = "/cotizacion";
    }
  }

  function handleOptionClick(op) {
    if (op === "Ver todas las preguntas" || op === "Ir a Cotización") {
      handleSpecial(op);
    } else {
      handleOption(op);
    }
  }

  function resetChat() {
    setMessages([WELCOME]);
  }

  return (
    <>
      {/* ── BOTÓN FLOTANTE ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Asistente virtual"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
          border: "none",
          boxShadow: "0 4px 20px rgba(22,163,74,0.45)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform .2s, box-shadow .2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(22,163,74,0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.45)";
        }}
      >
        {open ? (
          /* X para cerrar */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          /* Ícono burbuja de chat con estrella de servicio */
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M4 6C4 4.9 4.9 4 6 4H26C27.1 4 28 4.9 28 6V20C28 21.1 27.1 22 26 22H10L4 28V6Z" fill="white" fillOpacity="0.95"/>
            <circle cx="16" cy="13" r="1.4" fill="#16a34a"/>
            <circle cx="21" cy="13" r="1.4" fill="#16a34a"/>
            <circle cx="11" cy="13" r="1.4" fill="#16a34a"/>
          </svg>
        )}
      </button>

      {/* ── PANEL DEL CHAT ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 28,
            zIndex: 9998,
            width: 340,
            maxHeight: 500,
            borderRadius: 18,
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#fff",
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🧹
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                Asistente Servicio a tu Mano
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                Responde al instante
              </div>
            </div>
            <button
              onClick={resetChat}
              title="Reiniciar chat"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                padding: "4px 8px",
                cursor: "pointer",
                color: "#fff",
                fontSize: 11,
              }}
            >
              ↺ Reiniciar
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 14px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "#f8fafc",
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "9px 13px",
                      borderRadius:
                        msg.from === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      background: msg.from === "user" ? "#16a34a" : "#fff",
                      color: msg.from === "user" ? "#fff" : "#1e293b",
                      fontSize: 13,
                      lineHeight: 1.5,
                      boxShadow:
                        msg.from === "bot"
                          ? "0 1px 4px rgba(0,0,0,0.08)"
                          : "none",
                    }}
                  >
                    {parseText(msg.text)}
                  </div>
                </div>

                {/* Opciones rápidas */}
                {msg.from === "bot" && msg.opciones && (
                  <div
                    style={{
                      marginTop: 7,
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    {msg.opciones.map((op) => (
                      <button
                        key={op}
                        onClick={() => handleOptionClick(op)}
                        style={{
                          background: "#fff",
                          border: "1.5px solid #16a34a",
                          borderRadius: 10,
                          padding: "6px 11px",
                          fontSize: 12,
                          color: "#16a34a",
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight: 500,
                          transition: "background .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#dcfce7")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#fff")
                        }
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleInput}
            style={{
              display: "flex",
              borderTop: "1px solid #e2e8f0",
              padding: "10px 12px",
              gap: 8,
              background: "#fff",
            }}
          >
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{
                flex: 1,
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
                color: "#1e293b",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <button
              type="submit"
              style={{
                background: "#16a34a",
                border: "none",
                borderRadius: 10,
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
