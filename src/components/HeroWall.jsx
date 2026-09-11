import { useEffect, useRef, useState, useCallback } from 'react';
import { hero } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';

/** Conexion lenta o ahorro de datos activo: no vale la pena bajar video */
function conexionAhorra() {
  const c = navigator.connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? '');
}

const DURACION_PARTE_MS = 14000;

export default function HeroWall({ sede = 'piura' }) {
  const wallRef = useRef(null);
  const videosRef = useRef([]);
  const timerRef = useRef(null);
  const isVisibleRef = useRef(true);

  const [conVideo, setConVideo] = useState(false);
  const [activo, setActivo] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const paneles = contenidoDeSede(sede)?.hero?.paneles ?? hero.paneles;
  const tieneMultiplesPartes = paneles.length > 1;

  useEffect(() => {
    const reducido =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || conexionAhorra()) return;
    setConVideo(true);
  }, []);

  // Al cambiar de sede, resetea el índice activo
  useEffect(() => {
    setActivo(0);
    setCycleKey((k) => k + 1);
  }, [sede]);

  // Función para avanzar a la siguiente parte
  const siguiente = useCallback(() => {
    setActivo((prev) => (prev + 1) % paneles.length);
    setCycleKey((k) => k + 1);
  }, [paneles.length]);

  // Selección manual de una parte
  const elegir = useCallback((i) => {
    setActivo(i);
    setCycleKey((k) => k + 1);
    const v = videosRef.current[i];
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, []);

  // Temporizador de 14 segundos para auto-avance continuo si hay múltiples partes
  useEffect(() => {
    if (!tieneMultiplesPartes) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (isVisibleRef.current && document.visibilityState === 'visible') {
        siguiente();
      }
    }, DURACION_PARTE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tieneMultiplesPartes, siguiente, cycleKey]);

  // Al cambiar 'activo', reproduce el video activo
  useEffect(() => {
    if (!conVideo) return;

    paneles.forEach((_, idx) => {
      const v = videosRef.current[idx];
      if (!v) return;
      if (idx === activo) {
        v.currentTime = 0;
        if (isVisibleRef.current) {
          v.play().catch(() => {});
        }
      } else {
        v.pause();
      }
    });
  }, [activo, conVideo, paneles]);

  // Pausa fuera de viewport para ahorrar batería y CPU
  useEffect(() => {
    if (!conVideo) return;
    const el = wallRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const vActivo = videosRef.current[activo];
        if (vActivo) {
          if (entry.isIntersecting) {
            vActivo.play().catch(() => {});
          } else {
            vActivo.pause();
          }
        }
      },
      { threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [conVideo, activo]);

  return (
    <div className="hero__wall hero__wall--full" ref={wallRef}>
      {paneles.map((panel, i) => {
        const isCurrent = i === activo;
        return (
          <div
            key={panel.id}
            className={`hero__full-slide ${isCurrent ? 'is-active' : ''}`}
            aria-hidden={!isCurrent}
          >
            {conVideo ? (
              <video
                ref={(el) => (videosRef.current[i] = el)}
                src={panel.video}
                poster={panel.poster}
                autoPlay={isCurrent}
                loop={!tieneMultiplesPartes}
                muted
                playsInline
                preload={i === 0 || isCurrent ? 'auto' : 'metadata'}
                tabIndex={-1}
                aria-hidden="true"
              />
            ) : (
              <img
                src={panel.poster}
                alt={panel.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            )}
          </div>
        );
      })}

      {/* Navegador de capítulos de 14 segundos (solo si hay más de 1 panel) */}
      {tieneMultiplesPartes && (
        <div className="hero__full-nav" role="tablist" aria-label="Partes de la toma de obra">
          {paneles.map((panel, i) => {
            const isCurrent = i === activo;
            return (
              <button
                key={panel.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                className={`hero__full-tab ${isCurrent ? 'is-active' : ''}`}
                onClick={() => elegir(i)}
                aria-label={`Parte ${i + 1} de ${paneles.length}: ${panel.tag} en ${panel.lugar}`}
              >
                <div className="hero__full-bar">
                  {isCurrent && (
                    <div
                      key={`prog-${activo}-${cycleKey}`}
                      className="hero__full-progress"
                      style={{ animationDuration: `${DURACION_PARTE_MS}ms` }}
                    />
                  )}
                </div>
                <div className="hero__full-label">
                  <span className="hero__full-index">0{i + 1}</span>
                  <span className="hero__full-tag">{panel.tag}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
