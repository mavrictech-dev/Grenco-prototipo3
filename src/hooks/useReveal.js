import { useEffect, useRef, useState } from 'react';

/**
 * Marca un elemento como visible la primera vez que entra en viewport, para la
 * entrada escalonada. Se desuscribe al disparar: la animacion no se repite.
 *
 * @param {number} delay retardo en ms del escalonado
 */
export function useReveal(delay = 0) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin IntersectionObserver se muestra todo de una: degradar visible, no oculto.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    // Lo que ya esta en pantalla al montar se revela sin esperar al observer.
    // getBoundingClientRect no depende de que el navegador pinte, asi que esto
    // garantiza que el contenido inicial nunca se quede en opacity:0 aunque el
    // observer tarde o una extension lo bloquee.
    const box = el.getBoundingClientRect();
    if (box.top < (window.innerHeight || 0) && box.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return {
    ref,
    className: shown ? 'reveal is-in' : 'reveal',
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    shown,
  };
}
