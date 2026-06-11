import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Datos: cada slide tiene imagen antes/después + calificación
   Reemplaza las URLs de imágenes con las tuyas cuando las tengas.
   ───────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    servicio: "Limpieza Residencial",
    descripcion: "Transformamos cada rincón de tu hogar.",
    antes: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    despues: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    calificacion: 4.9,
    reseñas: 128,
    color: "#16a34a",
  },
  {
    id: 2,
    servicio: "Limpieza Comercial",
    descripcion: "Espacios de trabajo impecables todos los días.",
    antes: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&q=80",
    despues: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    calificacion: 4.8,
    reseñas: 95,
    color: "#0ea5e9",
  },
  {
    id: 3,
    servicio: "Limpieza Profunda",
    descripcion: "Para los espacios que necesitan atención especial.",
    antes: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
    despues: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    calificacion: 4.9,
    reseñas: 74,
    color: "#f59e0b",
  },
  {
    id: 4,
    servicio: "Limpieza Post-Obra",
    descripcion: "Dejamos tu obra lista para habitar.",
    antes: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    despues: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
    calificacion: 4.7,
    reseñas: 52,
    color: "#8b5cf6",
  },
];

/* ── Estrellitas ─────────────────────────────────────────────── */
function Estrellas({ valor }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: "1rem", letterSpacing: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= Math.round(valor) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

/* ── Slider antes/después ────────────────────────────────────── */
function SliderAntesDepues({ antes, despues, activo }) {
  const [pos, setPos] = useState(50);
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef(null);

  // Reset position when slide changes
  useEffect(() => { setPos(50); }, [activo]);

  const mover = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => arrastrando && mover(e.clientX)}
      onMouseUp={() => setArrastrando(false)}
      onMouseLeave={() => setArrastrando(false)}
      onTouchMove={(e) => mover(e.touches[0].clientX)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/10",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "col-resize",
        userSelect: "none",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}
    >
      {/* DESPUÉS (fondo completo) */}
      <img
        src={despues}
        alt="Después"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* ANTES (clip izquierdo) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      >
        <img
          src={antes}
          alt="Antes"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Etiquetas */}
      <span style={labelStyle("left")}>ANTES</span>
      <span style={labelStyle("right")}>DESPUÉS</span>

      {/* Divisor */}
      <div
        onMouseDown={() => setArrastrando(true)}
        onTouchStart={() => setArrastrando(true)}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 3,
          background: "#fff",
          transform: "translateX(-50%)",
          cursor: "col-resize",
          zIndex: 10,
        }}
      >
        {/* Handle circular */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#334155",
          }}
        >
          ⟺
        </div>
      </div>
    </div>
  );
}

function labelStyle(side) {
  return {
    position: "absolute",
    top: 12,
    [side]: 12,
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: 1.5,
    padding: "4px 10px",
    borderRadius: 20,
    zIndex: 5,
    backdropFilter: "blur(4px)",
  };
}

/* ── Componente principal ────────────────────────────────────── */
export default function CarruselAntesDepues() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const intervalRef = useRef(null);

  const total = SLIDES.length;

  const irA = (idx) => setActual((idx + total) % total);

  // Autoplay cada 5 s
  useEffect(() => {
    if (!pausado) {
      intervalRef.current = setInterval(() => {
        setActual((prev) => (prev + 1) % total);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [pausado, total]);

  const slide = SLIDES[actual];

  return (
    <section
      className="py-5"
      style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #f8fafc 100%)" }}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="container">

        {/* Encabezado */}
        <div className="text-center mb-4">
          <span
            style={{
              display: "inline-block",
              background: "#dcfce7",
              color: "#16a34a",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: 2,
              padding: "5px 14px",
              borderRadius: 20,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Resultados reales
          </span>
          <h2 className="fw-bold mb-1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            Antes &amp; Después
          </h2>
          <p className="text-muted">
            Desliza para comparar — nuestros clientes ya lo comprobaron.
          </p>
        </div>

        <div className="row align-items-center g-4">

          {/* Slider */}
          <div className="col-lg-7">
            <SliderAntesDepues
              antes={slide.antes}
              despues={slide.despues}
              activo={actual}
            />

            {/* Puntos de navegación */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => irA(i)}
                  style={{
                    width: i === actual ? 28 : 10,
                    height: 10,
                    borderRadius: 5,
                    border: "none",
                    background: i === actual ? slide.color : "#cbd5e1",
                    transition: "all 0.35s ease",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Info lateral */}
          <div className="col-lg-5">
            {/* Tarjeta del servicio activo */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "28px 28px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
                borderTop: `4px solid ${slide.color}`,
                transition: "border-color 0.4s",
              }}
            >
              <h4 className="fw-bold mb-1" style={{ color: slide.color, transition: "color 0.4s" }}>
                {slide.servicio}
              </h4>
              <p className="text-muted mb-3">{slide.descripcion}</p>

              {/* Calificación */}
              <div className="d-flex align-items-center gap-2 mb-4">
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a" }}>
                  {slide.calificacion}
                </span>
                <div>
                  <Estrellas valor={slide.calificacion} />
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {slide.reseñas} reseñas verificadas
                  </div>
                </div>
              </div>

              {/* Barra de calificación */}
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 6 }}>
                Satisfacción del cliente
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(slide.calificacion / 5) * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${slide.color}, ${slide.color}cc)`,
                    borderRadius: 8,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <div style={{ textAlign: "right", fontSize: "0.78rem", color: "#64748b", marginTop: 4 }}>
                {((slide.calificacion / 5) * 100).toFixed(0)}%
              </div>
            </div>

            {/* Lista mini de todos los servicios */}
            <div className="mt-3 d-flex flex-column gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => irA(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: `1.5px solid ${i === actual ? s.color : "#e2e8f0"}`,
                    background: i === actual ? `${s.color}10` : "#fff",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.88rem", color: i === actual ? s.color : "#334155" }}>
                    {s.servicio}
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#f59e0b" }}>★</span> {s.calificacion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flechas de navegación */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            onClick={() => irA(actual - 1)}
            style={flechaStyle}
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => irA(actual + 1)}
            style={flechaStyle}
            aria-label="Siguiente"
          >
            →
          </button>
        </div>

      </div>
    </section>
  );
}

const flechaStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "1.5px solid #e2e8f0",
  background: "#fff",
  cursor: "pointer",
  fontSize: "1.1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  transition: "all 0.2s",
};
