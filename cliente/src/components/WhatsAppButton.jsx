import { useState } from "react";

const WA_ICON = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.004 2C6.477 2 2 6.477 2 12.004a9.96 9.96 0 001.407 5.136L2 22l4.98-1.384A9.964 9.964 0 0012.004 22C17.531 22 22 17.523 22 12.004 22 6.477 17.531 2 12.004 2z" />
  </svg>
);

const WA_ICON_SM = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.004 2C6.477 2 2 6.477 2 12.004a9.96 9.96 0 001.407 5.136L2 22l4.98-1.384A9.964 9.964 0 0012.004 22C17.531 22 22 17.523 22 12.004 22 6.477 17.531 2 12.004 2z" />
  </svg>
);

const MENSAJE = encodeURIComponent(
  "Hola! Me gustaría solicitar una cotización para un servicio de limpieza a vapor. 🙌"
);

const NUMEROS = [
  { label: "Juan Pablo", num: "3212196255", display: "321 219 6255" },
  { label: "Sandra Milena", num: "3125276445", display: "312 527 6445" },
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      position: "fixed",
      bottom: "96px",
      right: "24px",
      zIndex: 9000,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "10px",
    }}>
      {open && (
        <div style={{
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 8px 40px rgba(0,0,0,.18)",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "230px",
          border: "1px solid #e2e8f0",
          animation: "waPopIn .18s ease",
        }}>
          <p style={{
            margin: "0 0 4px",
            fontSize: ".72rem",
            color: "#64748b",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
          }}>
            Escríbenos por WhatsApp
          </p>

          {NUMEROS.map(({ label, num, display }) => (
            <a
              key={num}
              href={`https://wa.me/57${num}?text=${MENSAJE}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                background: "#f0fdf4",
                borderRadius: "12px",
                textDecoration: "none",
                color: "#15803d",
                fontWeight: 600,
                fontSize: ".88rem",
                border: "1px solid #bbf7d0",
                transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
              onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
            >
              <span style={{ color: "#22c55e", flexShrink: 0 }}>{WA_ICON_SM}</span>
              <div style={{ lineHeight: 1.3 }}>
                <span style={{ display: "block", fontSize: ".7rem", color: "#64748b", fontWeight: 500 }}>
                  {label}
                </span>
                {display}
              </div>
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Contactar por WhatsApp"
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "#25d366",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,.5)",
          transition: "transform .2s, box-shadow .2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,211,102,.65)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.5)";
        }}
      >
        {WA_ICON}
      </button>

      <style>{`
        @keyframes waPopIn {
          from { opacity: 0; transform: translateY(8px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
