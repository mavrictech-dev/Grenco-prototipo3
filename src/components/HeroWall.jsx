import { useEffect, useRef, useState, useCallback } from 'react';
import { hero } from '../data/site';
import { contenidoDeSede } from '../data/sede-contenido';

/** Conexion lenta o ahorro de datos activo: no vale la pena bajar video */
function conexionAhorra() {
  const c = navigator.connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? '');
}

const DURACION_PARTE_MS = 8000;

export default function HeroWall({ sede = 'piura' }) {
  const wallRef = useRef(null);
  const videosRef = useRef([]);
  const timerRef = useRef(null);
  const isVisibleRef = useRef(true);

  const [conVideo, setConVideo] = useState(false);
  const [activo, setActivo] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const paneles = contenidoDeSede(sede)?.hero?.paneles ?? hero.paneles;
  const esFull = sede === 'piura'; // Piura se muestra completo (sin cortes de tríptico)

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

  // Función para avanzar a la siguiente parte de 8s
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

  // Temporizador de 8 segundos para auto-avance continuo en Piura
  useEffect(() => {
    if (!esFull) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (isVisibleRef.current && document.visibilityState === 'visible') {
        siguiente();
      }
    }, DURACION_PARTE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [esFull, siguiente, cycleKey]);

  // Al cambiar 'activo' en modo completo, arranca el video activo
  useEffect(() => {
    if (!conVideo || !esFull) return;

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
  }, [activo, conVideo, esFull, paneles]);

  // Sincronización continua de los paneles en Trujillo (toma continua dividida)
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

  // Pausa fuera de viewport para ahorrar batería y CPU
  useEffect(() => {
    if (!conVideo) return;
    const el = wallRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (esFull) {
          const vActivo = videosRef.current[activo];
          if (vActivo) {
            if (entry.isIntersecting) {
              vActivo.play().catch(() => {});
            } else {
              vActivo.pause();
            }
          }
        } else {
          for (const v of videosRef.current) {
            if (!v) continue;
            if (entry.isIntersecting) {
              v.play().catch(() => {});
            } else {
              v.pause();
            }
          }
        }
      },
      { threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [conVideo, esFull, activo]);

  // Si es Piura: renderizado completo panorámico (sin tríptico)
  if (esFull) {
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

        {/* Navegador de capítulos de 8 segundos con indicador de progreso continuo */}
        <div className="hero__full-nav" role="tablist" aria-label="Partes de la toma aérea">
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
                aria-label={`Parte ${i + 1} de 4: ${panel.tag} en ${panel.lugar}`}
              >
                <div className="hero__full-bar">
                  {isCurrent && (
                    <div
                      key={`prog-${activo}-${cycleKey}`}
                      className="hero__full-progress"
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
      </div>
    );
  }

  // Si es Trujillo: mantiene el formato tríptico sincronizado
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
