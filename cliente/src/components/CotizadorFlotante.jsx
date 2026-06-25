import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SERVICIOS_VAPOR = [
  { nombre: "Sofá 2 puestos",        precio: 85000  },
  { nombre: "Sofá 3 puestos",        precio: 120000 },
  { nombre: "Sofá esquinero / L",    precio: 190000 },
  { nombre: "Sillón / Poltrona",     precio: 55000  },
  { nombre: "Silla comedor (c/u)",   precio: 28000  },
  { nombre: "Colchón sencillo",      precio: 65000  },
  { nombre: "Colchón doble/queen",   precio: 95000  },
  { nombre: "Colchón king",          precio: 120000 },
  { nombre: "Tapete hasta 4 m²",     precio: 85000  },
  { nombre: "Tapete 4–10 m²",        precio: 160000 },
  { nombre: "Automóvil sedán",       precio: 190000 },
  { nombre: "SUV / Camioneta",       precio: 270000 },
  { nombre: "Residencial (casa)",    precio: 300000 },
  { nombre: "Comercial (local)",     precio: 450000 },
  { nombre: "Baño individual",       precio: 60000  },
];

const fmt = n => "$" + Number(n).toLocaleString("es-CO");

export default function CotizadorFlotante() {
  const [open,     setOpen]    = useState(false);
  const [items,    setItems]   = useState([]);
  const [desc,     setDesc]    = useState(0);
  const [iva,      setIva]     = useState(false);
  const [copiado,  setCopiado] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 576);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (location.pathname.startsWith("/dashboard")) return null;

  const subtotal  = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const descuento = subtotal * (desc / 100);
  const base      = subtotal - descuento;
  const ivaVal    = iva ? base * 0.19 : 0;
  const total     = base + ivaVal;

  const agregar = (srv) =>
    setItems(prev => {
      const ex = prev.find(i => i.nombre === srv.nombre);
      return ex
        ? prev.map(i => i.nombre === srv.nombre ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...srv, qty: 1 }];
    });

  const copiar = () => {
    const lineas = items.map(i => `• ${i.nombre} x${i.qty}: ${fmt(i.precio * i.qty)}`).join("\n");
    const txt = [
      "COTIZACIÓN – Servicio a tu Mano",
      lineas,
      `Subtotal: ${fmt(subtotal)}`,
      desc  ? `Descuento ${desc}%: −${fmt(descuento)}` : "",
      iva   ? `IVA 19%: ${fmt(ivaVal)}` : "",
      `TOTAL: ${fmt(total)}`,
      "",
      "Juan Pablo: 321 219 6255 | Sandra: 312 527 6445",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(txt).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  };

  return (
    <>
      <style>{`
        @keyframes calc-in {
          from { opacity:0; transform:translateY(14px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
      `}</style>

      {/* ── Botón flotante ── */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Calcular cotización"
        style={{
          position: "fixed",
          bottom: isMobile ? 16 : 28,
          right: isMobile ? 80 : 96,
          zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
          background: open
            ? "linear-gradient(135deg,#b45309,#92400e)"
            : "linear-gradient(135deg,#f59e0b,#d97706)",
          color: "#fff", fontSize: "1.5rem",
          boxShadow: "0 4px 18px rgba(245,158,11,.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: open ? "scale(.92)" : "scale(1)", transition: "all .2s",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = open ? "scale(.92)" : "scale(1)"; }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : "💰"}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 82 : 96,
          right: isMobile ? 8 : 96,
          zIndex: 9998,
          width: isMobile ? "calc(100vw - 16px)" : 370,
          maxWidth: 370,
          borderRadius: 20,
          boxShadow: "0 10px 48px rgba(0,0,0,.28)",
          overflow: "hidden", background: "#fff",
          fontFamily: "'Inter','Segoe UI',sans-serif", fontSize: 13,
          animation: "calc-in .22s ease",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,.2)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
            }}>💰</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                Cotizador de Precios
              </div>
              <div style={{ color: "rgba(255,255,255,.8)", fontSize: 11, marginTop: 2 }}>
                Toca un servicio para añadirlo y calcular
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)",
              borderRadius: 8, padding: "4px 9px", cursor: "pointer",
              color: "#fff", fontSize: 11, fontWeight: 600,
            }}>↺ Limpiar</button>
          </div>

          {/* Cuerpo */}
          <div style={{ padding: "10px 12px", maxHeight: 420, overflowY: "auto", background: "#f8fafc" }}>

            {/* Chips de servicios */}
            <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 8px", fontWeight: 600 }}>
              Selecciona servicios:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
              {SERVICIOS_VAPOR.map(s => (
                <button key={s.nombre} onClick={() => agregar(s)} style={{
                  background: "#fff", border: "1.5px solid #fde68a", borderRadius: 10,
                  padding: "5px 10px", fontSize: 11, cursor: "pointer",
                  color: "#92400e", fontWeight: 600, lineHeight: 1.3,
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef3c7"; e.currentTarget.style.borderColor = "#f59e0b"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fde68a"; }}
                >
                  <span>{s.nombre}</span>
                  <span style={{ color: "#d97706", fontWeight: 700 }}>{fmt(s.precio)}</span>
                </button>
              ))}
            </div>

            {items.length > 0 ? (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, background: "#fff", borderRadius: 10, overflow: "hidden" }}>
                  <thead>
                    <tr style={{ background: "#fffbeb" }}>
                      <th style={{ padding: "5px 8px", textAlign: "left",   fontSize: 11, color: "#92400e", fontWeight: 700 }}>Ítem</th>
                      <th style={{ padding: "5px 8px", textAlign: "center", fontSize: 11, color: "#92400e", fontWeight: 700 }}>Qty</th>
                      <th style={{ padding: "5px 8px", textAlign: "right",  fontSize: 11, color: "#92400e", fontWeight: 700 }}>Valor</th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(i => (
                      <tr key={i.nombre} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "6px 8px", fontSize: 12 }}>{i.nombre}</td>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <button
                              onClick={() => setItems(p => p.map(x => x.nombre === i.nombre ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}
                              style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                            >−</button>
                            <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}>{i.qty}</span>
                            <button
                              onClick={() => agregar(i)}
                              style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                            >+</button>
                          </div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#0f172a", padding: "6px 8px", fontSize: 12 }}>
                          {fmt(i.precio * i.qty)}
                        </td>
                        <td style={{ padding: "6px 4px" }}>
                          <button
                            onClick={() => setItems(p => p.filter(x => x.nombre !== i.nombre))}
                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
                          >×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center", flexWrap: "wrap", background: "#fff", borderRadius: 10, padding: "8px 10px" }}>
                  <label style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
                    Descuento %:
                    <input
                      type="number" min={0} max={100} value={desc}
                      onChange={e => setDesc(Number(e.target.value))}
                      style={{ width: 52, borderRadius: 7, border: "1.5px solid #e2e8f0", padding: "3px 6px", fontSize: 12, outline: "none" }}
                    />
                  </label>
                  <label style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                    <input type="checkbox" checked={iva} onChange={e => setIva(e.target.checked)} style={{ accentColor: "#f59e0b" }} />
                    IVA 19%
                  </label>
                </div>

                <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: "10px 14px", marginBottom: 10, fontSize: 12 }}>
                  {desc > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 3 }}>
                      <span>Subtotal</span><span>{fmt(subtotal)}</span>
                    </div>
                  )}
                  {desc > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#dc2626", marginBottom: 3 }}>
                      <span>Descuento {desc}%</span><span>−{fmt(descuento)}</span>
                    </div>
                  )}
                  {iva && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 3 }}>
                      <span>IVA 19%</span><span>{fmt(ivaVal)}</span>
                    </div>
                  )}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontWeight: 800, fontSize: 15, color: "#0f172a",
                    borderTop: "1.5px solid #fde68a", marginTop: 5, paddingTop: 6,
                  }}>
                    <span>TOTAL</span>
                    <span style={{ color: "#d97706" }}>{fmt(total)}</span>
                  </div>
                </div>

                <button
                  onClick={copiar}
                  style={{
                    width: "100%", borderRadius: 12, border: "none", padding: "9px",
                    background: copiado ? "#16a34a" : "#f59e0b",
                    color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13,
                    transition: "background .2s", marginBottom: 5,
                  }}
                >
                  {copiado ? "✅ ¡Copiado al portapapeles!" : "📋 Copiar cotización"}
                </button>
                <button
                  onClick={() => { setItems([]); setDesc(0); setIva(false); }}
                  style={{ width: "100%", borderRadius: 12, border: "1px solid #e2e8f0", padding: "7px", background: "#fff", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}
                >
                  Limpiar todo
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "24px 0", fontSize: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
                Toca los servicios de arriba para calcular el precio
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
