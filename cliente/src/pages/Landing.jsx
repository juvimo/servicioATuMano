import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import logo  from "../assets/logo.png";
import logo3 from "../assets/logo3.jpg";
import { Link } from "react-router-dom";
import CarruselAntesDepues from "../components/CarruselAntesDepues";

/* ── SVG aspiradora robot ─── */
const RobotVacuum = () => (
  <svg width="110" height="82" viewBox="0 0 110 82" fill="none" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,.55))" }}>
    {/* sombra suelo */}
    <ellipse cx="55" cy="80" rx="46" ry="5" fill="rgba(0,0,0,.28)" />
    {/* cuerpo exterior */}
    <circle cx="55" cy="40" r="38" fill="#dbeafe" fillOpacity=".92" />
    <circle cx="55" cy="40" r="32" fill="#0ea5e9" />
    {/* cuerpo interior */}
    <circle cx="55" cy="40" r="22" fill="#0369a1" />
    <circle cx="55" cy="40" r="12" fill="rgba(255,255,255,.18)" />
    <circle cx="55" cy="40" r="5"  fill="rgba(255,255,255,.55)" />
    {/* LED de estado */}
    <circle cx="55" cy="10" r="4.5" fill="#38bdf8" />
    <circle cx="55" cy="10" r="2.2" fill="#fff" fillOpacity=".8" />
    {/* sensores laterales */}
    <rect x="10" y="36" width="10" height="7" rx="3.5" fill="rgba(255,255,255,.35)" />
    <rect x="90" y="36" width="10" height="7" rx="3.5" fill="rgba(255,255,255,.35)" />
    {/* barra de cepillos */}
    <rect x="8"  y="72" width="94" height="7" rx="3.5" fill="rgba(255,255,255,.45)" />
    <line x1="18"  y1="72" x2="18"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    <line x1="30"  y1="72" x2="30"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    <line x1="42"  y1="72" x2="42"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    <line x1="55"  y1="72" x2="55"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    <line x1="68"  y1="72" x2="68"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    <line x1="80"  y1="72" x2="80"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    <line x1="92"  y1="72" x2="92"  y2="79" stroke="rgba(14,165,233,.8)" strokeWidth="2" strokeLinecap="round" />
    {/* boca de succión delantera (izquierda, dirección del movimiento) */}
    <ellipse cx="17" cy="40" rx="9" ry="6" fill="rgba(14,165,233,.5)" />
    {/* ondas de succión */}
    <path d="M5 37 Q0 40 5 43"  stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M2 33 Q-5 40 2 47" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

/* ── Iconos SVG (reemplazan emojis simples) ───────────────── */
const IconPhone = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.41 9a19.79 19.79 0 01-3.07-8.67A2 2 0 012.33 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IconEmail = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLocation = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ── Imágenes del proyecto ─ */
const IMG = {
  residencial: "/img/3.jpeg",
  comercial:   "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",
  profunda:    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&q=80",
  postObra:    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80",
  paso1:       "/img/7.png",
  paso2:       "/img/8.png",
  paso3:       "/img/9.png",
};

function Landing() {
  const usuario = (() => {
    try { return JSON.parse(sessionStorage.getItem("usuario")); } catch { return null; }
  })();

  const [showIntro, setShowIntro] = useState(() => {
    if (sessionStorage.getItem("introShown")) return false;
    sessionStorage.setItem("introShown", "1");
    return true;
  });
  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => setShowIntro(false), 2750);
    return () => clearTimeout(t);
  }, [showIntro]);

  /* Scroll a sección pendiente al volver desde otra página */
  useEffect(() => {
    const target = sessionStorage.getItem("pendingScroll");
    if (!target) return;
    sessionStorage.removeItem("pendingScroll");
    const t = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ══ INTRO ══ */}
      {showIntro && (
        <div className="intro-wrap">
          <div className="intro-brand">
            <img src={logo} className="intro-logo-img" alt="logo" />
            <h2 className="intro-title">Servicio a tu Mano</h2>
            <p className="intro-sub">Limpieza profesional a vapor</p>
          </div>

          {/* Aspiradora animada */}
          <div className="intro-vac-row">
            <div className="intro-trail" />
            <div className="intro-glow" />
            <div className="intro-vac">
              <RobotVacuum />
              <div className="intro-bubble ib1" />
              <div className="intro-bubble ib2" />
              <div className="intro-bubble ib3" />
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* ═══════════════════════════════════════
          HERO — OCÉANO PROFUNDO
      ═══════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* ── Niebla base ── */}
        <div className="steam-mist" />

        {/* ── Columnas de vapor ascendente ── */}
        <div className="steam-wrap">
          <div className="steam-puff sp1" /><div className="steam-puff sp2" />
          <div className="steam-puff sp3" /><div className="steam-puff sp4" />
          <div className="steam-puff sp5" /><div className="steam-puff sp6" />
          <div className="steam-puff sp7" /><div className="steam-puff sp8" />
          <div className="steam-puff sp9" /><div className="steam-puff sp10" />
          {/* Gotitas de limpieza */}
          <div className="steam-drop sd1" /><div className="steam-drop sd2" />
          <div className="steam-drop sd3" /><div className="steam-drop sd4" />
          <div className="steam-drop sd5" /><div className="steam-drop sd6" />
          <div className="steam-drop sd7" /><div className="steam-drop sd8" />
        </div>

        {/* Aspiradora deslizante permanente en el hero */}
        <div className="hero-vac-slide" aria-hidden="true">
          <div className="hero-vac-runner">
            <RobotVacuum />
          </div>
        </div>

        <div className="container hero-container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Servicio a Domicilio · Tecnología a Vapor
              </div>

              <h1 className="hero-title">
                Limpieza<br />
                <span>Profesional</span><br />
                a Vapor
              </h1>

              <p className="hero-subtitle">
                Eliminamos el 99.9 % de bacterias y gérmenes con vapor de alta
                temperatura. Sin químicos. Sin residuos. Tu hogar transformado
                desde el primer servicio.
              </p>

              <div className="hero-actions">
                <Link to="/cotizacion" className="btn-hero-primary">
                  Solicitar Cotización <span>→</span>
                </Link>
                <a href="#servicios" className="btn-hero-ghost">Ver Servicios</a>
              </div>

              <div className="hero-chips">
                {[
                  { n: "500+",   l: "Hogares" },
                  { n: "98 %",   l: "Satisfacción" },
                  { n: "5 años", l: "Experiencia" },
                ].map(s => (
                  <div className="hero-chip" key={s.l}>
                    <strong>{s.n}</strong>
                    <span>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-img-wrap">
                <video
                  src="/videos/intro-servicio.mp4"
                  className="hero-img"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ maxHeight: "520px" }}
                />

                <div className="hero-badge-float hero-badge-float-1">
                  <div className="hbf-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Tecnología a Vapor</strong>
                    <span>100 % Sin Químicos</span>
                  </div>
                </div>

                <div className="hero-badge-float hero-badge-float-2">
                  <div className="hbf-icon">
                    <IconStar />
                    <IconStar />
                    <IconStar />
                  </div>
                  <div>
                    <strong>4.9 / 5</strong>
                    <span>Calificación promedio</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CARRUSEL ANTES & DESPUÉS
      ═══════════════════════════════════════ */}
      <CarruselAntesDepues />

      {/* ═══════════════════════════════════════
          CÓMO FUNCIONA — con fotos reales
      ═══════════════════════════════════════ */}
      <section className="how-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Proceso</span>
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="section-sub">En 3 simples pasos, tu espacio queda impecable.</p>
          </div>
          <div className="row g-4">
            {[
              {
                n: "01", img: IMG.paso1,
                t: "Solicita tu Cotización",
                d: "Cuéntanos qué necesitas. Te enviamos un presupuesto personalizado gratis, sin compromisos.",
              },
              {
                n: "02", img: IMG.paso2,
                t: "Agenda tu Visita",
                d: "Elige el día y hora que más te convenga. Nuestro equipo llegará puntual y completamente equipado.",
              },
              {
                n: "03", img: IMG.paso3,
                t: "Disfruta el Resultado",
                d: "Vapor de alta temperatura, resultados visibles. Tú solo disfrutas el espacio impecable.",
              },
            ].map(s => (
              <div className="col-md-4" key={s.n}>
                <div className="how-card-full">
                  <img src={s.img} alt={s.t} className="how-card-full-img" />
                  <div className="how-card-full-overlay">
                    <span className="how-card-step-badge">Paso {s.n}</span>
                    <h5 className="how-card-full-title">{s.t}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICIOS — con imágenes reales
      ═══════════════════════════════════════ */}
      <section id="servicios" className="services-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Servicios</span>
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-sub">Soluciones a vapor para cada rincón de tu espacio.</p>
          </div>
          <div className="row g-4">
            {[
              { img: IMG.residencial, gradient:"teal",   title:"Vapor de Muebles y Sofás",      desc:"Vapor a 180 °C elimina ácaros, manchas y bacterias en sofás, sillones y tapizados." },
              { img: IMG.comercial,   gradient:"blue",   title:"Limpieza de Colchones",         desc:"Eliminamos el 99.9 % de ácaros, hongos y gérmenes. Secado en 3–5 horas." },
              { img: IMG.profunda,    gradient:"violet", title:"Alfombras y Tapetes a Vapor",   desc:"Extracción profunda de polvo, manchas y bacterias. Colores restaurados." },
              { img: IMG.postObra,    gradient:"gold",   title:"Tapicería de Automóviles",      desc:"Interior de vehículos libre de olores, manchas y bacterias. Asientos y moqueta." },
              { img: IMG.residencial, gradient:"teal",   title:"Limpieza Residencial a Vapor",  desc:"Toda tu casa con vapor industrial. Sin químicos agresivos, sin residuos." },
              { img: IMG.comercial,   gradient:"blue",   title:"Desinfección Comercial",        desc:"Restaurantes, hoteles y oficinas. Cumplimos normas sanitarias." },
              { img: IMG.profunda,    gradient:"violet", title:"Limpieza Post-Obra",            desc:"Polvo de cemento, pintura y residuos eliminados. Tu espacio listo para habitar." },
              { img: IMG.postObra,    gradient:"gold",   title:"Baños a Vapor Profundo",        desc:"Hongos, sarro y bacterias en juntas y azulejos. Resultado visible desde el primer día." },
            ].map(s => (
              <div className="col-sm-6 col-lg-3" key={s.title}>
                <div className={`service-card service-card-${s.gradient}`}>
                  <div className="service-card-img-wrap">
                    <img src={s.img} alt={s.title} className="service-card-img" />
                  </div>
                  <div className="service-card-body">
                    <h5>{s.title}</h5>
                    <p>{s.desc}</p>
                    <Link to="/cotizacion" className="service-link">Cotizar →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          POR QUÉ ELEGIRNOS
      ═══════════════════════════════════════ */}
      <section id="nosotros" className="why-section">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-5 order-lg-2">
              <div style={{ borderRadius:28, overflow:"hidden", boxShadow:"0 40px 80px rgba(14,165,233,.1)", border:"1.5px solid #dbeafe", maxHeight:460 }}>
                <video
                  src="/videos/8.mp4"
                  autoPlay muted loop playsInline
                  preload="auto"
                  style={{ width:"100%", height:"100%", maxHeight:460, objectFit:"cover", display:"block" }}
                />
              </div>
            </div>

            <div className="col-lg-7 order-lg-1">
              <span className="section-badge">¿Por qué nosotros?</span>
              <h2 className="section-title">
                La diferencia del vapor<br />
                se siente desde el primer día
              </h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 520 }}>
                No solo limpiamos — desinfectamos. El vapor elimina bacterias, ácaros y
                alérgenos sin dejar residuos químicos en tu hogar.
              </p>
              <div className="row g-3">
                {[
                  { title: "Personal certificado",     desc: "Verificado y capacitado en técnicas de limpieza a vapor." },
                  { title: "Sin químicos agresivos",   desc: "Solo agua convertida en vapor. Seguro para niños y mascotas." },
                  { title: "Horarios flexibles",       desc: "Servicio disponible 6 días a la semana según tu agenda." },
                  { title: "Garantía de satisfacción", desc: "Si algo no te convenció, regresamos sin costo adicional." },
                ].map(f => (
                  <div className="col-sm-6" key={f.title}>
                    <div className="why-feature">
                      <div className="why-check-icon"><IconCheck /></div>
                      <div>
                        <h6>{f.title}</h6>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACTO — con iconos SVG
      ═══════════════════════════════════════ */}
      <section id="contacto" className="contact-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Contacto</span>
            <h2 className="section-title">Estamos listos para ayudarte</h2>
            <p className="section-sub">Escríbenos, llámanos o visítanos cuando quieras.</p>
          </div>
          <div className="row g-4 mb-5">
            {[
              { Icon: IconPhone,    t: "Teléfono",  v: "321 2196255 / 312 5276445",       sub: "Lun–Vie 8AM–6PM" },
              { Icon: IconEmail,    t: "Email",      v: "info@servicioatumano.com", sub: "Respuesta en 24 h" },
              { Icon: IconLocation, t: "Ubicación", v: "Domicilio-Alrededores de Cundinamarcar",             sub: "Servicio a domicilio" },
            ].map(c => (
              <div className="col-md-4" key={c.t}>
                <div className="contact-card">
                  <div className="contact-icon">
                    <c.Icon />
                  </div>
                  <h6>{c.t}</h6>
                  <p className="contact-val">{c.v}</p>
                  <p className="contact-sub">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/cotizacion" className="btn-cta-solid">
              Solicitar Cotización Ahora →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-glow-1" />
        <div className="cta-glow-2" />
        <div className="steam-mist" />
        <div className="steam-wrap">
          <div className="steam-puff sp1" /><div className="steam-puff sp2" />
          <div className="steam-puff sp3" /><div className="steam-puff sp4" />
          <div className="steam-puff sp5" /><div className="steam-puff sp6" />
          <div className="steam-puff sp7" />
          <div className="steam-drop sd2" /><div className="steam-drop sd4" />
          <div className="steam-drop sd6" /><div className="steam-drop sd8" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 3 }}>
          <h2>Tu hogar merece lo mejor</h2>
          <p>Solicita tu cotización gratuita hoy. Sin compromisos, sin letra pequeña.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/cotizacion" className="btn-cta-white">Solicitar Cotización</Link>
            {(!usuario || usuario.rol !== "cliente") && (
              <Link to="/login" className="btn-cta-outline-white">Acceso Clientes</Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="footer">
        <div className="container">
          <div className="row g-4">

            <div className="col-md-4">
              <h5>Servicio a tu Mano</h5>
              <p>
                Tu aliado de confianza en limpieza profesional a vapor. Calidad,
                eficiencia y satisfacción garantizada en cada visita.
              </p>
              <div className="footer-social">
                {/* SVG social icons */}
                <a href="#" title="Facebook" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
                <a href="#" title="Instagram" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" title="WhatsApp" aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12.004 2C6.477 2 2 6.477 2 12.004a9.96 9.96 0 001.407 5.136L2 22l4.98-1.384A9.964 9.964 0 0012.004 22C17.531 22 22 17.523 22 12.004 22 6.477 17.531 2 12.004 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h5>Navegación</h5>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/cotizacion">Cotización</Link></li>
              </ul>
            </div>

            <div className="col-6 col-md-3">
              <h5>Servicios</h5>
              <ul>
                <li><Link to="/cotizacion">Limpieza Residencial</Link></li>
                <li><Link to="/cotizacion">Limpieza Comercial</Link></li>
                <li><Link to="/cotizacion">Limpieza Profunda</Link></li>
                <li><Link to="/cotizacion">Tapicería y Muebles</Link></li>
                <li><Link to="/cotizacion">Tapetes y Pisos</Link></li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5>Contacto</h5>
              <p style={{ marginBottom: ".4rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <IconPhone /> +1 (555) 123-4567
              </p>
              <p style={{ marginBottom: ".4rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <IconEmail /> info@servicioatumano.com
              </p>
              <p style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <IconLocation /> Ciudad, País
              </p>
              <h5>Horarios</h5>
              <p style={{ marginBottom: ".3rem" }}>Lun – Vie: 8AM – 6PM</p>
              <p>Sábado: 9AM – 4PM</p>
            </div>

          </div>
          <hr />
          <p className="footer-copy">© 2026 Servicio a tu Mano. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default Landing;
