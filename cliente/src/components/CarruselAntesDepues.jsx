import { useState, useEffect, useRef, useCallback } from "react";

const VIDEOS = [
  {
    id: 1, src: "/videos/1.mp4", servicio: "Limpieza Residencial", color: "#14b8a6",
    frase: "\"Quedé sin palabras. Mi sala volvió a ser nueva.\"",
    autor: "María G. — Bogotá",
  },
  {
    id: 2, src: "/videos/2.mp4", servicio: "Limpieza de Muebles", color: "#be185d",
    frase: "\"El sofá parecía de tienda. No lo podía creer.\"",
    autor: "Carlos M. — Medellín",
  },
  {
    id: 3, src: "/videos/3.mp4", servicio: "Limpieza Comercial", color: "#0ea5e9",
    frase: "\"Nuestros clientes notan la diferencia al entrar.\"",
    autor: "Restaurante El Patio",
  },
  {
    id: 4, src: "/videos/4.mp4", servicio: "Limpieza Profunda", color: "#a855f7",
    frase: "\"Años de suciedad desaparecieron en una sola visita.\"",
    autor: "Sandra R. — Cali",
  },
  {
    id: 5, src: "/videos/5.mp4", servicio: "Limpieza a Vapor", color: "#0891b2",
    frase: "\"Sin químicos y mi bebé puede gatear tranquilo.\"",
    autor: "Daniela V. — Barranquilla",
  },
  {
    id: 6, src: "/videos/6.mp4", servicio: "Limpieza Post-Obra", color: "#f59e0b",
    frase: "\"Entregaron el apartamento impecable, antes del plazo.\"",
    autor: "Constructora Nova",
  },
  {
    id: 7, src: "/videos/7.mp4", servicio: "Limpieza de Alfombras", color: "#16a34a",
    frase: "\"Pensaba reemplazarla. Ahora luce mejor que cuando la compré.\"",
    autor: "Julián T. — Pereira",
  },
];

const DURACION = 5000;

export default function CarruselResultados() {
  const [actual, setActual]     = useState(0);
  const [saliendo, setSaliendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [pausado, setPausado]   = useState(false);
  const videoRef   = useRef(null);
  const timerRef   = useRef(null);
  const progrRef   = useRef(null);
  const inicioRef  = useRef(null);
  const acumRef    = useRef(0);
  const total      = VIDEOS.length;

  const irA = useCallback((idx) => {
    setSaliendo(true);
    setProgreso(0);
    acumRef.current = 0;
    setTimeout(() => {
      setActual((idx + total) % total);
      setSaliendo(false);
    }, 450);
  }, [total]);

  /* ── Auto-avance ── */
  const arrancarTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(progrRef.current);
    inicioRef.current = performance.now();

    timerRef.current = setTimeout(() => {
      setActual(prev => {
        const next = (prev + 1) % total;
        setSaliendo(true);
        setProgreso(0);
        acumRef.current = 0;
        setTimeout(() => setSaliendo(false), 450);
        return next;
      });
    }, DURACION);

    progrRef.current = setInterval(() => {
      const elapsed = acumRef.current + (performance.now() - inicioRef.current);
      setProgreso(Math.min((elapsed / DURACION) * 100, 100));
    }, 30);
  }, [total]);

  const detenerTimer = useCallback(() => {
    acumRef.current += performance.now() - (inicioRef.current ?? performance.now());
    clearTimeout(timerRef.current);
    clearInterval(progrRef.current);
  }, []);

  useEffect(() => {
    if (!pausado) arrancarTimer();
    return detenerTimer;
  }, [actual, pausado, arrancarTimer, detenerTimer]);

  /* ── Reproducir video al cambiar slide ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [actual]);

  const v = VIDEOS[actual];

  return (
    <section
      style={{ background: "#f8fafc", padding: "4rem 0" }}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="container">

        {/* ── Encabezado ── */}
        <div className="text-center mb-4">
          <span className="section-badge">Trabajos realizados</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "#0c1a2e", letterSpacing: "-.025em" }}>
            Nuestros Resultados
          </h2>
          <p style={{ color: "#64748b", marginTop: ".4rem", fontSize: ".9rem" }}>
            Lo que hacemos habla por sí solo.
          </p>
        </div>

        <div className="row g-4 align-items-center">

          {/* ── VIDEO PRINCIPAL ── */}
          <div className="col-12">
            <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div
              style={{ position: "relative", borderRadius: 16, overflow: "hidden",
                boxShadow: `0 0 0 1px ${v.color}33, 0 16px 48px rgba(0,0,0,.18)`,
                transition: "box-shadow .45s ease",
                aspectRatio: "16/9", background: "#000",
              }}
            >
              <video
                ref={videoRef}
                key={actual}
                src={v.src}
                autoPlay muted loop playsInline
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  opacity: saliendo ? 0 : 1,
                  transform: saliendo ? "scale(1.03)" : "scale(1)",
                  transition: "opacity .45s ease, transform .45s ease",
                  display: "block",
                }}
              />

              {/* Overlay degradado inferior */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 50%, transparent 100%)",
                pointerEvents: "none",
              }} />

              {/* Frase / testimonio sobre el video */}
              <div style={{
                position: "absolute", bottom: 20, left: 20, right: 60,
                opacity: saliendo ? 0 : 1,
                transform: saliendo ? "translateY(10px)" : "translateY(0)",
                transition: "opacity .45s ease, transform .45s ease",
              }}>
                {/* Comilla decorativa */}
                <span style={{
                  display: "block", fontSize: "2.8rem", lineHeight: 1,
                  color: v.color, opacity: .7, marginBottom: ".1rem",
                  fontFamily: "Georgia, serif",
                }}>❝</span>
                <p style={{
                  margin: 0, color: "#fff",
                  fontSize: "clamp(.9rem, 1.6vw, 1.1rem)",
                  fontStyle: "italic", fontWeight: 600,
                  lineHeight: 1.5,
                  textShadow: "0 2px 14px rgba(0,0,0,.9)",
                }}>
                  {v.frase.replace(/"/g, "")}
                </p>
                <p style={{
                  margin: ".5rem 0 0", color: v.color,
                  fontSize: ".8rem", fontWeight: 700,
                  letterSpacing: ".05em",
                  textShadow: "0 1px 6px rgba(0,0,0,.7)",
                }}>
                  — {v.autor}
                </p>
              </div>

              {/* Flechas */}
              {[{ d: "←", fn: () => irA(actual - 1), side: "left" },
                { d: "→", fn: () => irA(actual + 1), side: "right" }].map(({ d, fn, side }) => (
                <button key={side} onClick={fn} style={{
                  position: "absolute", top: "50%", [side]: 12,
                  transform: "translateY(-50%)",
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(0,0,0,.55)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,.15)",
                  color: "#fff", fontSize: "1rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background .2s",
                }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.8)"}
                   onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,.55)"}>
                  {d}
                </button>
              ))}

              {/* Barra de progreso */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                background: "rgba(255,255,255,.1)",
              }}>
                <div style={{
                  height: "100%", width: `${progreso}%`,
                  background: v.color,
                  transition: pausado ? "none" : "width .03s linear",
                }} />
              </div>
            </div>

            {/* Puntos de navegación */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              {VIDEOS.map((vid, i) => (
                <button key={i} onClick={() => irA(i)} style={{
                  width: i === actual ? 28 : 8, height: 8,
                  borderRadius: 4, border: "none", padding: 0,
                  background: i === actual ? v.color : "#cbd5e1",
                  transition: "all .35s ease", cursor: "pointer",
                }} aria-label={`Ir al testimonio ${i + 1}`} />
              ))}
            </div>
            </div>{/* maxWidth wrapper */}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .4; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
}
