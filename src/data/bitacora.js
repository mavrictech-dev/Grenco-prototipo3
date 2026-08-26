/**
 * Bitacora de obra: el feed de actualizaciones.
 *
 * ---------------------------------------------------------------------------
 * PUNTO DE CAMBIO A CONTENIDO DINAMICO
 * ---------------------------------------------------------------------------
 * Toda la seccion consume `getPosts()`, nunca el array directamente. Para
 * pasar a un CMS o a una API, se reemplaza el cuerpo de esa funcion y no hay
 * que tocar ningun componente:
 *
 *     export async function getPosts() {
 *       const r = await fetch('/api/bitacora');
 *       return (await r.json()).map(normalizar);
 *     }
 *
 * `Bitacora.jsx` ya la trata como asincrona (await) y contempla los estados de
 * carga, vacio y error, asi que el cambio es de una sola funcion.
 *
 * Forma de un post:
 *   id        string  unico y estable (sirve de key)
 *   fecha     string  ISO 'YYYY-MM-DD'; se formatea al renderizar
 *   lugar     string  distrito o sede
 *   sede      string  'piura' | 'trujillo'  -> permite filtrar
 *   titulo    string
 *   resumen   string  2-3 lineas, es lo unico que se muestra en la tarjeta
 *   foto      string  nombre del webp en src/assets/obra/ (sin extension)
 *   etiquetas string[]
 */

const POSTS = [
  {
    id: 'algarrobos-s14',
    fecha: '2026-08-18',
    lugar: 'Los Algarrobos, Piura',
    sede: 'piura',
    titulo: 'Cierre de movimiento de tierras en la etapa II',
    resumen:
      'Se completó el 92% del corte y relleno de las 14 hectáreas. Ensayos de densidad conformes en los tres sectores.',
    foto: 'obra-0082',
    etiquetas: ['Movimiento de tierras', 'Habilitación urbana'],
  },
  {
    id: 'planta-agro-losa',
    fecha: '2026-08-11',
    lugar: 'Sullana, Piura',
    sede: 'piura',
    titulo: 'Vaciado de losa industrial sin parar la planta',
    resumen:
      'Se ejecutó por paños alternos y en turno nocturno para no interrumpir el despacho de la agroindustrial.',
    foto: 'obra-4827',
    etiquetas: ['Obra civil'],
  },
  {
    id: 'via-drenaje-cunetas',
    fecha: '2026-08-04',
    lugar: 'Trujillo, La Libertad',
    sede: 'trujillo',
    titulo: 'Cunetas y alcantarillas listas antes de lluvias',
    resumen:
      'Se adelantó el drenaje de 1.8 km de vía para que la temporada no comprometa la subrasante ya conformada.',
    foto: 'obra-7678',
    etiquetas: ['Vialidad', 'Drenaje'],
  },
  {
    id: 'taller-mantenimiento',
    fecha: '2026-07-28',
    lugar: 'Taller central, Piura',
    sede: 'piura',
    titulo: 'Mantenimiento preventivo de la flota de excavadoras',
    resumen:
      'Cambio de tren de rodamiento y revisión hidráulica completa. Los equipos vuelven a frente sin parar la obra.',
    foto: 'obra-1096',
    etiquetas: ['Flota', 'Taller propio'],
  },
  {
    id: 'ssoma-charla',
    fecha: '2026-07-21',
    lugar: 'Frente A, Piura',
    sede: 'piura',
    titulo: '180 días sin accidentes incapacitantes',
    resumen:
      'La charla de cinco minutos y la verificación de EPP por turno sostienen el indicador desde el inicio del año.',
    foto: 'obra-1844',
    etiquetas: ['SSOMA'],
  },
  {
    id: 'estructura-metalica',
    fecha: '2026-07-14',
    lugar: 'Sullana, Piura',
    sede: 'piura',
    titulo: 'Montaje de estructura metálica y cobertura',
    resumen:
      'Se cerró la nave con cobertura termoacústica. Siguiente partida: piso pulido y patio de maniobras.',
    foto: 'obra-0190',
    etiquetas: ['Obra civil', 'Estructuras'],
  },
];

/**
 * Fuente unica de los posts. Es asincrona a proposito aunque hoy resuelva de
 * inmediato: asi cambiar a una API no altera la firma ni los componentes.
 */
export async function getPosts() {
  return POSTS.slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/**
 * La fecha se construye en UTC y ADEMAS se formatea en UTC.
 *
 * Las dos mitades hacen falta: construir en UTC y dejar que Intl formatee en
 * la zona del visitante hacia que '2026-08-18' saliera como "17 de agosto"
 * para cualquiera al oeste de Greenwich (Peru es UTC-5). Aqui la fecha es un
 * dato de calendario, no un instante, asi que no debe moverse con la zona.
 */
const FMT = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** 'YYYY-MM-DD' -> '18 de agosto de 2026' */
export function formatearFecha(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return FMT.format(new Date(Date.UTC(a, m - 1, d)));
}
