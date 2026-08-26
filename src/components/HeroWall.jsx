import { useEffect, useRef, useState } from 'react';
import { hero } from '../data/site';

/**
 * Fondo del hero: tres clips verticales en fila.
 *
 * Decisiones que conviene no deshacer:
 *
 * - Los videos solo se montan si el usuario no pidio menos movimiento y no
 *   viene con ahorro de datos. Si no, quedan los `poster`, que ya son la
 *   imagen de fondo: no hace falta un estado de fallo aparte.
 * - Se pausan al salir de viewport. Un video reproduciendose fuera de pantalla
 *   sigue decodificando y gastando bateria para nada.
 * - Cada panel es un enlace a la bitacora. El efecto de hover promete que algo
 *   pasa al pulsar; si no llevara a ningun sitio seria una afordancia falsa.
 * - En movil no caben tres tiras de 100px, asi que se ve una sola y los puntos
 *   de abajo cambian de toma. Esos puntos NO se pintan en escritorio: alli se
 *   ven las tres a la vez y no habria nada que elegir.
 */

/** Conexion lenta o ahorro de datos activo: no vale la pena bajar 2 MB de video. */
function conexionAhorra() {
  const c = navigator.connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? '');
}

export default function HeroWall() {
  const wallRef = useRef(null);
  const videosRef = useRef([]);
  const [conVideo, setConVideo] = useState(false);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const reducido =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || conexionAhorra()) return;
    setConVideo(true);
  }, []);

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
            // play() rechaza si el navegador bloquea el autoplay; sin el catch
            // sale una promesa no capturada en consola.
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
  // Sin esto reaparece congelado donde se quedo al ocultarse.
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
      {hero.paneles.map((panel, i) => (
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
        {hero.paneles.map((panel, i) => (
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
