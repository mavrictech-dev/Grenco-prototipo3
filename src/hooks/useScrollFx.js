import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Efectos ligados al scroll: sombra de la barra, auto-ocultado al bajar, CTA
 * flotante, barra de progreso de lectura y parallax de los elementos [data-px].
 *
 * El listener (pasivo) lleva el estado discreto y el rAF solo interpola el
 * parallax, pausandose con la pestana oculta o si el usuario pidio menos
 * movimiento.
 */
export function useScrollFx() {
  const [navHidden, setNavHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const lastY = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();

    function readScroll() {
      const top = window.scrollY || root.scrollTop || 0;
      const view = window.innerHeight || root.clientHeight;
      const max = Math.max(1, (root.scrollHeight || document.body.scrollHeight) - view);

      root.setAttribute('data-scrolled', top > 24 ? '1' : '0');
      setPastHero(top > view * 0.75);
      // Redondeado a entero: el estado solo cambia 100 veces en toda la pagina
      // en vez de en cada pixel de scroll.
      setProgreso(Math.round(Math.min(1, Math.max(0, top / max)) * 100));

      // Ocultar al bajar, reaparecer al subir. El umbral de 6px evita que el
      // rebote inercial de iOS dispare el toggle.
      const diff = top - lastY.current;
      if (top <= 25) setNavHidden(false);
      else if (diff > 6 && top > 80) setNavHidden(true);
      else if (diff < -6) setNavHidden(false);

      lastY.current = Math.max(0, top);
    }

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll);

    const limpiaBase = () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
    };

    if (reduced) return limpiaBase;

    const pxEls = Array.from(document.querySelectorAll('[data-px]'));
    if (!pxEls.length) return limpiaBase;

    let raf = 0;

    function frame() {
      const view = window.innerHeight;
      for (const el of pxEls) {
        const f = parseFloat(el.dataset.px) || 0;
        const r = el.getBoundingClientRect();
        const mid = Math.max(-1, Math.min(1, (r.top + r.height / 2 - view / 2) / view));
        el.style.transform = `translate3d(0,${(-mid * f * 320).toFixed(2)}px,0)`;
      }
      raf = requestAnimationFrame(frame);
    }

    function onVisibility() {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      limpiaBase();
    };
  }, []);

  return { navHidden, pastHero, progreso };
}
