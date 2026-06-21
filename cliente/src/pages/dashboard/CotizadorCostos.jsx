import { useState } from "react";

/* ═══════════════════════════════════════
   COTIZADOR DE COSTOS FLOTANTE
═══════════════════════════════════════ */
const SERVICIOS_VAPOR = [
  { nombre:"Sofá 2 puestos",          precio:85000  },
  { nombre:"Sofá 3 puestos",          precio:120000 },
  { nombre:"Sofá esquinero / L",      precio:190000 },
  { nombre:"Sillón / Poltrona",       precio:55000  },
  { nombre:"Silla comedor (c/u)",     precio:28000  },
  { nombre:"Colchón sencillo",        precio:65000  },
  { nombre:"Colchón doble/queen",     precio:95000  },
  { nombre:"Colchón king",            precio:120000 },
  { nombre:"Tapete hasta 4 m²",       precio:85000  },
  { nombre:"Tapete 4–10 m²",          precio:160000 },
  { nombre:"Automóvil sedán",         precio:190000 },
  { nombre:"SUV / Camioneta",         precio:270000 },
  { nombre:"Limpieza residencial",    precio:300000 },
  { nombre:"Limpieza comercial",      precio:450000 },
  { nombre:"Baño individual",         precio:60000  },
];
const fmtCOP2 = n => "$" + Number(n).toLocaleString("es-CO");

export function CotizadorCostos({ onClose }) {
  const [items,    setItems]    = useState([]);
  const [desc,     setDesc]     = useState(0);
  const [iva,      setIva]      = useState(false);
  const [copiado,  setCopiado]  = useState(false);

  const subtotal  = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const descuento = subtotal * (desc / 100);
  const baseIva   = subtotal - descuento;
  const ivaVal    = iva ? baseIva * 0.19 : 0;
  const total     = baseIva + ivaVal;

  const agregar = (srv) => {
    setItems(prev => {
      const ex = prev.find(i => i.nombre === srv.nombre);
      return ex
        ? prev.map(i => i.nombre === srv.nombre ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...srv, qty: 1 }];
    });
  };

  const copiar = () => {
    const lineas = items.map(i => `• ${i.nombre} x${i.qty}: ${fmtCOP2(i.precio * i.qty)}`).join("\n");
    const txt = `COTIZACIÓN - Servicio a tu Mano\n${lineas}\nSubtotal: ${fmtCOP2(subtotal)}${desc ? `\nDescuento ${desc}%: -${fmtCOP2(descuento)}` : ""}${iva ? `\nIVA 19%: ${fmtCOP2(ivaVal)}` : ""}\nTOTAL: ${fmtCOP2(total)}\n\nJuan Pablo: 321 219 6255 | Sandra: 312 527 6445`;
    navigator.clipboard.writeText(txt).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 2000); });
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13 }}>
      <div style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>💰 Cotizador de Costos</span>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", padding:"2px 8px", fontSize:14 }}>×</button>
      </div>
      <div style={{ padding:"10px 12px", maxHeight:380, overflowY:"auto" }}>
        <p style={{ color:"#64748b", fontSize:11, margin:"0 0 8px" }}>Toca un servicio para añadirlo:</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
          {SERVICIOS_VAPOR.map(s => (
            <button key={s.nombre} onClick={() => agregar(s)} style={{
              background:"#fef3c7", border:"1px solid #fde68a", borderRadius:8,
              padding:"4px 9px", fontSize:11, cursor:"pointer", color:"#92400e", fontWeight:600,
            }}>{s.nombre}</button>
          ))}
        </div>
        {items.length > 0 && (
          <>
            <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:8 }}>
              <thead><tr style={{ background:"#f8fafc" }}>
                <th style={{ padding:"4px 6px", textAlign:"left", fontSize:11, color:"#64748b" }}>Ítem</th>
                <th style={{ padding:"4px 6px", textAlign:"center", fontSize:11, color:"#64748b" }}>Qty</th>
                <th style={{ padding:"4px 6px", textAlign:"right", fontSize:11, color:"#64748b" }}>Valor</th>
                <th/>
              </tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.nombre} style={{ borderBottom:"1px solid #f1f5f9" }}>
                    <td style={{ padding:"5px 6px" }}>{i.nombre}</td>
                    <td style={{ textAlign:"center", padding:"5px 6px" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                        <button onClick={() => setItems(p => p.map(x => x.nombre===i.nombre ? {...x,qty:Math.max(1,x.qty-1)} : x))} style={{ width:20,height:20,borderRadius:4,border:"1px solid #e2e8f0",background:"#f1f5f9",cursor:"pointer",fontSize:13,lineHeight:1 }}>−</button>
                        <span style={{ fontWeight:700 }}>{i.qty}</span>
                        <button onClick={() => agregar(i)} style={{ width:20,height:20,borderRadius:4,border:"1px solid #e2e8f0",background:"#f1f5f9",cursor:"pointer",fontSize:13,lineHeight:1 }}>+</button>
                      </div>
                    </td>
                    <td style={{ textAlign:"right", fontWeight:700, color:"#0f172a", padding:"5px 6px" }}>{fmtCOP2(i.precio*i.qty)}</td>
                    <td style={{ padding:"5px 6px" }}>
                      <button onClick={() => setItems(p => p.filter(x => x.nombre!==i.nombre))} style={{ background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,lineHeight:1 }}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center", flexWrap:"wrap" }}>
              <label style={{ fontSize:11, color:"#64748b", display:"flex", alignItems:"center", gap:4 }}>
                Descuento %:
                <input type="number" min={0} max={100} value={desc} onChange={e=>setDesc(Number(e.target.value))}
                  style={{ width:52,borderRadius:7,border:"1.5px solid #e2e8f0",padding:"3px 6px",fontSize:12,outline:"none" }} />
              </label>
              <label style={{ fontSize:11, color:"#64748b", display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>
                <input type="checkbox" checked={iva} onChange={e=>setIva(e.target.checked)} /> IVA 19%
              </label>
            </div>
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"8px 12px", marginBottom:8, fontSize:12 }}>
              {desc > 0 && <div style={{ display:"flex",justifyContent:"space-between",color:"#64748b" }}><span>Subtotal</span><span>{fmtCOP2(subtotal)}</span></div>}
              {desc > 0 && <div style={{ display:"flex",justifyContent:"space-between",color:"#dc2626" }}><span>Descuento {desc}%</span><span>-{fmtCOP2(descuento)}</span></div>}
              {iva && <div style={{ display:"flex",justifyContent:"space-between",color:"#64748b" }}><span>IVA 19%</span><span>{fmtCOP2(ivaVal)}</span></div>}
              <div style={{ display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:14,color:"#0f172a",borderTop:"1px solid #e2e8f0",marginTop:4,paddingTop:4 }}>
                <span>TOTAL</span><span style={{ color:"#d97706" }}>{fmtCOP2(total)}</span>
              </div>
            </div>
            <button onClick={copiar} style={{
              width:"100%", borderRadius:10, border:"none", padding:"8px",
              background: copiado ? "#16a34a" : "#f59e0b", color:"#fff",
              fontWeight:700, cursor:"pointer", fontSize:13, transition:"background .2s",
            }}>{copiado ? "✅ ¡Copiado!" : "📋 Copiar cotización"}</button>
            <button onClick={() => setItems([])} style={{ width:"100%",marginTop:5,borderRadius:10,border:"1px solid #e2e8f0",padding:"6px",background:"#fff",color:"#94a3b8",cursor:"pointer",fontSize:12 }}>Limpiar</button>
          </>
        )}
        {items.length === 0 && (
          <div style={{ textAlign:"center",color:"#94a3b8",padding:"20px 0",fontSize:12 }}>
            Selecciona servicios arriba para cotizar
          </div>
        )}
      </div>
    </div>
  );
}
