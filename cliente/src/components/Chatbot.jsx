import { useState, useRef, useEffect } from "react";
import { BASE as API_URL } from "../api/config";
import logoEmpresa from "../assets/logo.png";

const SUGERENCIAS = [
  "💰 ¿Cuánto cuesta limpiar un sofá?",
  "🚗 ¿Cuánto vale la tapicería de un carro?",
  "🏠 Limpieza residencial, ¿cuánto sale?",
  "📸 Analizar manchas con IA",
  "📋 ¿Qué servicios ofrecen?",
  "📍 ¿Dónde atienden?",
];

const WELCOME = {
  id: 0,
  from: "bot",
  text: "¡Hola! 👋 Soy el asistente de **Servicio a tu Mano**.\n\nPuedo cotizarte cualquier servicio, analizar manchas con IA y responder tus dudas. ¿En qué te ayudo?",
  opciones: SUGERENCIAS,
};

function parseResponse(raw) {
  let text = raw;
  let opciones = null;

  const opMatch = text.match(/##OPCIONES:([^#]+)##/);
  if (opMatch) {
    opciones = opMatch[1].split("|").map(s => s.trim()).filter(Boolean);
    text = text.replace(/##OPCIONES:[^#]+##/, "").trim();
  }

  if (text.includes("##FAQ##")) {
    opciones = SUGERENCIAS;
    text = text.replace(/##FAQ##/g, "").trim();
  }

  return { text, opciones };
}

function parseMarkdown(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("- ");
    const numbered = trimmed.match(/^(\d+)\.\s(.+)/);
    const raw = isBullet ? trimmed.slice(2) : numbered ? numbered[2] : trimmed;
    const parts = raw.split(/\*\*(.*?)\*\*/g).map((p, j) =>
      j % 2 === 1 ? <strong key={j}>{p}</strong> : p
    );
    if (isBullet) return (
      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
        <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>•</span>
        <span>{parts}</span>
      </div>
    );
    if (numbered) return (
      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
        <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0, minWidth: 16 }}>{numbered[1]}.</span>
        <span>{parts}</span>
      </div>
    );
    return <div key={i} style={{ marginBottom: 3 }}>{parts}</div>;
  });
}

export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [historial, setHistorial] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading]   = useState(false);
  const bottomRef   = useRef(null);
  const fileInputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function checkSize() { setIsMobile(window.innerWidth <= 480); }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  async function callAI(mensaje, imgs, hist) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const formData = new FormData();
    formData.append("mensaje", mensaje || "");
    formData.append("historial", JSON.stringify(hist.slice(-20)));
    imgs.forEach(img => formData.append("imagenes", img.file));
    try {
      const res = await fetch(`${API_URL}/api/chatbot`, {
        method: "POST", body: formData, signal: controller.signal,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }
      return (await res.json()).respuesta;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function handleSend(texto, imgs) {
    if (!texto.trim() && imgs.length === 0) return;

    const userText = texto.trim();
    setMessages(prev => [...prev, {
      id: Date.now(), from: "user",
      text: userText,
      imagePreviews: imgs.map(i => i.preview),
    }]);
    setInputVal("");
    setImagenes([]);
    setLoading(true);

    const newHist = [...historial, { role: "user", content: userText || "Analiza estas imágenes" }];

    try {
      const raw = await callAI(userText, imgs, newHist);
      const { text, opciones } = parseResponse(raw);
      setHistorial([...newHist, { role: "assistant", content: raw }]);
      setMessages(prev => [...prev, {
        id: Date.now(), from: "bot", text, isAI: true,
        opciones: opciones || ["💰 Cotizar otro servicio", "📸 Analizar manchas", "📍 ¿Dónde atienden?"],
      }]);
    } catch (err) {
      const esTimeout = err.name === "AbortError";
      setMessages(prev => [...prev, {
        id: Date.now(), from: "bot",
        text: esTimeout
          ? "La respuesta tardó demasiado. Verifica que el servidor esté activo."
          : `No pude conectarme: ${err.message}`,
        opciones: ["🔄 Intentar de nuevo", "Ir a Cotización"],
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e) {
    e.preventDefault();
    if (loading || (!inputVal.trim() && imagenes.length === 0)) return;
    handleSend(inputVal.trim(), imagenes);
  }

  function handleOptionClick(op) {
    if (op === "Ir a Cotización") { window.location.href = "/cotizacion"; return; }
    if (op === "🔄 Intentar de nuevo") {
      const lastUser = [...messages].reverse().find(m => m.from === "user");
      if (lastUser) handleSend(lastUser.text, []);
      return;
    }
    if (op === "📸 Analizar manchas" || op === "📸 Analizar manchas con IA") {
      setMessages(prev => [...prev,
        { id: Date.now(), from: "user", text: op },
        { id: Date.now() + 1, from: "bot",
          text: "Usa el botón 📷 para adjuntar fotos del mueble y cuéntame:\n\n- **¿Qué tipo de mueble?** (sofá, colchón, tapete, auto…)\n- **¿Qué manchas y desde hace cuánto?**\n- **¿Material?** (tela, cuero, microfibra…)",
          opciones: ["💰 Dame precios directamente"],
        },
      ]);
      return;
    }
    handleSend(op, []);
  }

  function handleFileChange(e) {
    const slots = 3 - imagenes.length;
    if (slots <= 0) return;
    const newFiles = Array.from(e.target.files).slice(0, slots);
    setImagenes(prev => [...prev, ...newFiles.map(file => ({
      file, preview: URL.createObjectURL(file), name: file.name,
    }))].slice(0, 3));
    e.target.value = "";
  }

  function removeImage(idx) {
    setImagenes(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function resetChat() {
    imagenes.forEach(img => URL.revokeObjectURL(img.preview));
    setMessages([WELCOME]);
    setHistorial([]);
    setInputVal("");
    setImagenes([]);
    setLoading(false);
  }

return (
    <>
      <style>{`
        @keyframes dot-pulse {
          0%,80%,100% { transform:scale(0.55); opacity:0.45; }
          40%          { transform:scale(1);    opacity:1;    }
        }
        @keyframes chat-in {
          from { opacity:0; transform:translateY(18px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
      `}</style>

      {/* ── Botón flotante ── */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Asistente virtual"
        style={{
          position:"fixed",
          bottom: isMobile ? 16 : 28,
          right: isMobile ? 16 : 28,
          zIndex:9999,
          width:56, height:56, borderRadius:"50%",
          background: open
            ? "linear-gradient(135deg,#0284c7,#075985)"
            : "linear-gradient(135deg,#0ea5e9,#0284c7)",
          border:"none", boxShadow:"0 4px 20px rgba(14,165,233,.45)",
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", transition:"all .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M4 6C4 4.9 4.9 4 6 4H26C27.1 4 28 4.9 28 6V20C28 21.1 27.1 22 26 22H10L4 28V6Z" fill="white" fillOpacity=".95"/>
            <circle cx="16" cy="13" r="1.4" fill="#0ea5e9"/>
            <circle cx="21" cy="13" r="1.4" fill="#0ea5e9"/>
            <circle cx="11" cy="13" r="1.4" fill="#0ea5e9"/>
          </svg>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position:"fixed",
          bottom: isMobile ? 0 : 96,
          right: isMobile ? 0 : 28,
          left: isMobile ? 0 : "auto",
          top: isMobile ? 0 : "auto",
          width: isMobile ? "100%" : 370,
          maxHeight: isMobile ? "100%" : "min(590px, calc(100vh - 120px))",
          height: isMobile ? "100%" : "auto",
          zIndex:9998, borderRadius: isMobile ? 0 : 20,
          boxShadow:"0 8px 48px rgba(0,0,0,.2)", display:"flex",
          flexDirection:"column", overflow:"hidden", background:"#fff",
          fontFamily:"'Inter','Segoe UI',sans-serif",
          animation:"chat-in .22s ease",
        }}>

          {/* Header */}
          <div style={{
            background:"linear-gradient(135deg,#0ea5e9,#0284c7)",
            padding:"14px 18px", display:"flex", alignItems:"center",
            gap:10, flexShrink:0,
          }}>
            <div style={{
              width:38, height:38, borderRadius:"50%",
              background:"#fff", display:"flex",
              alignItems:"center", justifyContent:"center",
              flexShrink:0, overflow:"hidden",
            }}>
              <img src={logoEmpresa} alt="Logo" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, lineHeight:1.2 }}>
                Asistente IA · Servicio a tu Mano
              </div>
              <div style={{ color:"rgba(255,255,255,.8)", fontSize:11, display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                <span style={{ width:6, height:6, background:"#38bdf8", borderRadius:"50%", display:"inline-block" }}/>
                En línea · Cotizaciones · Análisis de manchas
              </div>
            </div>
            <button onClick={resetChat} title="Reiniciar" style={{
              background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)",
              borderRadius:8, padding:"4px 9px", cursor:"pointer",
              color:"#fff", fontSize:11, fontWeight:600,
            }}>↺</button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex:1, overflowY:"auto", padding:"14px 12px 6px",
            display:"flex", flexDirection:"column", gap:10, background:"#f8fafc",
          }}>
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.from === "user" && msg.imagePreviews?.length > 0 && (
                  <div style={{ display:"flex", justifyContent:"flex-end", gap:5, marginBottom: msg.text ? 5 : 0, flexWrap:"wrap" }}>
                    {msg.imagePreviews.map((src, i) => (
                      <img key={i} src={src} alt="adjunto" style={{ width:90, height:90, objectFit:"cover", borderRadius:10, border:"2px solid #0ea5e9" }}/>
                    ))}
                  </div>
                )}

                {msg.text && (
                  <div style={{ display:"flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth:"88%", padding:"9px 13px",
                      borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.from === "user" ? "#0ea5e9" : "#fff",
                      color: msg.from === "user" ? "#fff" : "#1e293b",
                      fontSize:13, lineHeight:1.6,
                      boxShadow: msg.from === "bot" ? "0 1px 4px rgba(0,0,0,.08)" : "none",
                    }}>
                      {parseMarkdown(msg.text)}
                      {msg.isAI && msg.from === "bot" && (
                        <div style={{
                          marginTop:7, display:"inline-flex", alignItems:"center", gap:4,
                          background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:20,
                          padding:"2px 8px", fontSize:10, color:"#0284c7", fontWeight:600,
                        }}>✨ Claude IA</div>
                      )}
                    </div>
                  </div>
                )}

                {msg.from === "bot" && msg.opciones && (
                  <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:4 }}>
                    {msg.opciones.map(op => (
                      <button key={op} onClick={() => handleOptionClick(op)} style={{
                        background:"#fff", border:"1.5px solid #bae6fd",
                        borderRadius:10, padding:"6px 11px", fontSize:12,
                        color:"#0284c7", cursor:"pointer", textAlign:"left",
                        fontWeight:500, transition:"all .15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background="#e0f2fe"; e.currentTarget.style.borderColor="#0ea5e9"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#bae6fd"; }}
                      >{op}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{
                  background:"#fff", borderRadius:"16px 16px 16px 4px",
                  padding:"10px 16px", boxShadow:"0 1px 4px rgba(0,0,0,.08)",
                  display:"flex", gap:5, alignItems:"center",
                }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width:8, height:8, background:"#0ea5e9", borderRadius:"50%",
                      display:"inline-block",
                      animation:`dot-pulse 1.4s ease-in-out ${i*.18}s infinite`,
                    }}/>
                  ))}
                </div>
                <span style={{ fontSize:11, color:"#94a3b8" }}>Consultando IA…</span>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Miniaturas */}
          {imagenes.length > 0 && (
            <div style={{
              padding:"8px 12px 4px", display:"flex", gap:7, alignItems:"center",
              borderTop:"1px solid #e2e8f0", background:"#fff", flexShrink:0,
            }}>
              {imagenes.map((img, idx) => (
                <div key={idx} style={{ position:"relative" }}>
                  <img src={img.preview} alt={img.name} style={{ width:54, height:54, objectFit:"cover", borderRadius:8, border:"2px solid #0ea5e9" }}/>
                  <button onClick={() => removeImage(idx)} style={{
                    position:"absolute", top:-6, right:-6, background:"#ef4444",
                    border:"none", borderRadius:"50%", width:18, height:18,
                    cursor:"pointer", color:"white", fontSize:12,
                    display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                  }}>×</button>
                </div>
              ))}
              <span style={{ fontSize:11, color:"#94a3b8" }}>{imagenes.length}/3 foto{imagenes.length !== 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleInput} style={{
            display:"flex", borderTop:"1px solid #e2e8f0", padding:"10px 12px",
            gap:7, background:"#fff", alignItems:"center", flexShrink:0,
          }}>
            <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleFileChange} style={{ display:"none" }}/>
            <button type="button" onClick={() => fileInputRef.current?.click()}
              disabled={imagenes.length >= 3 || loading}
              title={imagenes.length >= 3 ? "Máximo 3 fotos" : "Adjuntar foto"}
              style={{
                background: imagenes.length >= 3 || loading ? "#f1f5f9" : "#f0f9ff",
                border:`1.5px solid ${imagenes.length >= 3 || loading ? "#e2e8f0" : "#0ea5e9"}`,
                borderRadius:10, width:38, height:38,
                cursor: imagenes.length >= 3 || loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, fontSize:18, opacity: imagenes.length >= 3 || loading ? 0.5 : 1,
              }}>📷</button>

            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={imagenes.length > 0 ? "Describe el mueble y las manchas…" : "¿En qué te puedo ayudar?"}
              disabled={loading}
              style={{
                flex:1, border:"1.5px solid #e2e8f0", borderRadius:10,
                padding:"8px 12px", fontSize:13, outline:"none",
                fontFamily:"inherit", color:"#1e293b",
                background: loading ? "#f8fafc" : "#fff",
              }}
              onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
              onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
            />

            <button type="submit"
              disabled={loading || (!inputVal.trim() && imagenes.length === 0)}
              style={{
                background: loading || (!inputVal.trim() && imagenes.length === 0) ? "#7dd3fc" : "#0ea5e9",
                border:"none", borderRadius:10, width:38, height:38,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor: loading || (!inputVal.trim() && imagenes.length === 0) ? "not-allowed" : "pointer",
                flexShrink:0, transition:"background .15s",
              }}>
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