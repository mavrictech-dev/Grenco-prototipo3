/**
 * Aplica un cambio de tema o de sede sin que la pagina anime la transicion.
 *
 * POR QUE HACE FALTA
 * Cambiar `data-theme` reescribe casi todos los tokens de color a la vez, y la
 * hoja de estilos tiene 152 elementos con `transition`. De esos, 114
 * transicionan `box-shadow`, que es la propiedad mas cara que hay: el
 * desenfoque no se acelera por GPU y hay que rasterizarlo en cada frame. Entre
 * todos suman unos 19 Mpx de area animada sobre una pantalla de 1,3 Mpx.
 *
 * Y lo peor no es eso: `.nubes` transiciona `color`, y el `<rect>` de cada
 * banda usa `fill="currentColor"`. Al cambiar el color se recalcula el filtro
 * de ruido fractal —5 octavas, 4 bandas, 4 Mpx— en CADA frame durante 900ms.
 *
 * COMO SE ARREGLA
 * Se desactivan las transiciones, se aplica el cambio, se fuerza un recalculo
 * de estilo para que el navegador lo consolide sin animar, y se vuelven a
 * activar en la siguiente tarea. El cambio pasa a ser instantaneo.
 *
 * Se usa `setTimeout` y no `requestAnimationFrame` a proposito: si la pestana
 * esta en segundo plano rAF no se ejecuta y la clase se quedaria pegada,
 * dejando la pagina entera sin transiciones al volver.
 */

const CLASE = 'sin-transiciones';

export function aplicarSinTransicion(cambio) {
  const root = document.documentElement;

  // Sin soporte de clases (SSR) o con menos movimiento pedido, se aplica y ya.
  if (!root?.classList) {
    cambio();
    return;
  }

  root.classList.add(CLASE);
  cambio();

  // Leer una propiedad de layout fuerza el recalculo sincrono: el navegador
  // consolida los valores nuevos ahora, con las transiciones aun apagadas.
  void root.offsetHeight;

  setTimeout(() => root.classList.remove(CLASE), 0);
}
