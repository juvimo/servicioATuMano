import { useState } from "react";
import { Icon } from "./icons";

/* ── Badge estado cotización ── */
export function BadgeEstado({ estado }) {
  const cfg = {
    Pendiente:  { bg: "#fef9c3", color: "#854d0e", label: "⏳ Pendiente"  },
    Confirmada: { bg: "#dcfce7", color: "#15803d", label: "✓ Confirmada" },
    Atendida:   { bg: "#dbeafe", color: "#1d4ed8", label: "✔ Atendida"  },
  };
  const c = cfg[estado] || cfg.Pendiente;
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 8, padding: "2px 10px", fontSize: ".75rem", fontWeight: 700 }}>
      {c.label}
    </span>
  );
}

/* ── Modal genérico ── */
export function Modal({ titulo, onClose, children }) {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
      <div style={{ background:"#fff",borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
          <h5 style={{ fontWeight:800,color:"#0f172a",margin:0 }}>{titulo}</h5>
          <button onClick={onClose} style={{ border:"none",background:"none",fontSize:"1.4rem",cursor:"pointer",color:"#94a3b8",lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Tabla con búsqueda + export ── */
export function TablaBase({ titulo, datos, columnas, onExport, onAdd, addLabel, renderFila, busquedaKey }) {
  const [busq, setBusq] = useState("");
  const filtrados = busq
    ? datos.filter(d => (d[busquedaKey] || "").toLowerCase().includes(busq.toLowerCase()))
    : datos;

  return (
    <div className="dash-card">
      <div className="dash-card-header" style={{ flexWrap:"wrap", gap:"0.5rem" }}>
        <h5>{titulo} <span style={{ fontWeight:400,color:"#94a3b8",fontSize:".85rem" }}>({filtrados.length})</span></h5>
        <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8" }}>{Icon.search}</span>
            <input
              value={busq} onChange={e => setBusq(e.target.value)}
              placeholder="Buscar..."
              style={{ paddingLeft:32,paddingRight:12,height:36,borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:".85rem",outline:"none",width:180 }}
            />
          </div>
          <button className="btn btn-sm" onClick={onExport}
            style={{ borderRadius:10,border:"1.5px solid #16a34a",background:"#f0fdf4",color:"#15803d",display:"flex",alignItems:"center",gap:6,fontWeight:700,fontSize:".82rem" }}>
            {Icon.excel} Exportar Excel
          </button>
          {onAdd && (
            <button className="btn-green btn btn-sm" onClick={onAdd} style={{ borderRadius:10,display:"flex",alignItems:"center",gap:5,fontSize:".85rem" }}>
              {Icon.add} {addLabel}
            </button>
          )}
        </div>
      </div>
      <div className="dash-card-body" style={{ overflowX:"auto" }}>
        <table className="table table-borderless" style={{ minWidth:600 }}>
          <thead>
            <tr>{columnas.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.length === 0
              ? <tr><td colSpan={columnas.length} style={{ textAlign:"center",color:"#94a3b8",padding:"2rem" }}>No hay registros.</td></tr>
              : filtrados.map(renderFila)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
