import { useEffect, useRef, useState } from 'react';
import { hero } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';

/**
 * Fondo del hero: tres clips verticales en fila.
 * En Trujillo, los 3 clips corresponden a la toma panoramica completa de f1.mp4
 * dividida en 3 columnas y sincronizada en tiempo real.
 */

/** Conexion lenta o ahorro de datos activo: no vale la pena bajar 2 MB de video. */
function conexionAhorra() {
  const c = navigator.connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? '');
}

export default function HeroWall({ sede = 'piura' }) {
  const wallRef = useRef(null);
  const videosRef = useRef([]);
  const [conVideo, setConVideo] = useState(false);
  const [activo, setActivo] = useState(0);

  const paneles = contenidoDeSede(sede)?.hero?.paneles ?? hero.paneles;

  useEffect(() => {
    const reducido =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || conexionAhorra()) return;
    setConVideo(true);
  }, []);

  // Al cambiar de sede, resetea el índice activo en móvil y reinicia reproducción
  useEffect(() => {
    setActivo(0);
  }, [sede]);

  // Sincronización continua de los tres paneles (en Trujillo donde forman una sola toma continua)
  useEffect(() => {
    if (!conVideo || sede !== 'trujillo') return;

    const syncVideos = () => {
      const v0 = videosRef.current[0];
      if (!v0 || v0.paused) return;
      const t = v0.currentTime;

      for (let j = 1; j < videosRef.current.length; j++) {
        const vj = videosRef.current[j];
        if (vj && Math.abs(vj.currentTime - t) > 0.12) {
          vj.currentTime = t;
        }
      }
    };

    const interval = setInterval(syncVideos, 500);
    return () => clearInterval(interval);
  }, [conVideo, sede]);

  // Pausa fuera de viewport.
  useEffect(() => {
    if (!conVideo) return;
    const el = wallRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        for (const v of videosRef.current) {
          if (!v) continue;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [conVideo]);

  // Al cambiar de toma en movil, el clip que entra arranca desde el principio.
  function elegir(i) {
    setActivo(i);
    const v = videosRef.current[i];
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }

  return (
    <div className="hero__wall" ref={wallRef}>
      {paneles.map((panel, i) => (
        <a
          key={panel.id}
          className={i === activo ? 'hero__panel is-activo' : 'hero__panel'}
          href="#bitacora"
          aria-label={`${panel.tag} en ${panel.lugar}. Ver la bitácora de obra`}
        >
          {conVideo ? (
            <video
              ref={(el) => (videosRef.current[i] = el)}
              src={panel.video}
              poster={panel.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : (
            <img src={panel.poster} alt={panel.alt} loading="eager" decoding="async" />
          )}

          <span className="hero__panel-tag">
            {panel.tag}
            <b>{panel.lugar}</b>
          </span>
        </a>
      ))}

      {/* Selector de toma. Solo se ve en movil (lo oculta el CSS). */}
      <div className="hero__selector" role="group" aria-label="Elegir toma de obra">
        {paneles.map((panel, i) => (
          <button
            key={panel.id}
            type="button"
            className={i === activo ? 'hero__punto is-activo' : 'hero__punto'}
            aria-label={`Ver ${panel.tag} en ${panel.lugar}`}
            aria-pressed={i === activo}
            onClick={() => elegir(i)}
          />
        ))}
      </div>
    </div>
  );
}
