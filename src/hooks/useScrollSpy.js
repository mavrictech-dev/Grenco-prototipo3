import { useEffect, useState } from 'react';

/**
 * Devuelve el id de la seccion que el visitante esta mirando, para marcarla en
 * la barra de navegacion.
 *
 * Usa un IntersectionObserver con `rootMargin` recortado por arriba y por abajo
 * en vez de comparar posiciones en cada scroll: el navegador hace el calculo
 * fuera del hilo principal y no cuesta nada por evento.
 *
 * La banda `-45% 0px -50%` deja una franja fina a la altura del centro del
 * viewport: la seccion activa es la que la cruza. Sin recortar, varias
 * secciones estarian visibles a la vez y el indicador saltaria.
 *
 * @param {string[]} ids ids de las secciones, en orden de aparicion
 */
export function useScrollSpy(ids) {
  const [activa, setActiva] = useState('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const secciones = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!secciones.length) return;

    // Se guarda que secciones cruzan la franja; la activa es la primera en
    // orden de documento, para que al bajar no parpadee entre dos.
    const cruzando = new Set();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) cruzando.add(e.target.id);
          else cruzando.delete(e.target.id);
        }
        const primera = ids.find((id) => cruzando.has(id));
        if (primera) setActiva(primera);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    for (const s of secciones) io.observe(s);
    return () => io.disconnect();
  }, [ids]);

  return activa;
}
