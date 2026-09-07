/**
 * Textos que cambian con la sede.
 *
 * Solo esta aqui lo que de verdad es distinto entre Piura y Trujillo: el
 * relato, el enfoque de obra y el orden de los proyectos. Lo que es un dato de
 * la empresa —años en obra, obras entregadas, servicios, flota— se queda en
 * site.js y NO se duplica: inventar cifras por sede seria afirmar cosas que
 * nadie ha medido.
 *
 * Para anadir un campo nuevo basta con ponerlo en las dos sedes; los
 * componentes leen de `contenidoDeSede(sede)` y no saben cual esta activa.
 */

const CONTENIDO = {
  piura: {
    hero: {
      eyebrow: 'Sede Piura · Oficina y taller principal',
      title: ['Movemos tierra.', 'Levantamos', 'el norte.'],
      text: 'Movimiento de tierras, habilitación urbana y alquiler de maquinaria pesada en Piura, Sullana y Talara. Flota propia, taller central y cuadrillas en planilla.',
      hint: 'Tomas reales de obra · Piura y Sullana',
      foto: 'obra-0082',
      fotoAlt: 'Excavadora CAT en un corte de movimiento de tierras',
      paneles: [
        {
          id: 'obra-1',
          video: '/video/obra-1.mp4',
          poster: '/video/obra-1.webp',
          alt: 'Excavadora cargando un volquete en el frente de trabajo',
          tag: 'Movimiento de tierras',
          lugar: 'Piura',
        },
        {
          id: 'obra-2',
          video: '/video/obra-2.mp4',
          poster: '/video/obra-2.webp',
          alt: 'Excavadora CAT posicionada en obra',
          tag: 'Maquinaria pesada',
          lugar: 'Sullana',
        },
        {
          id: 'obra-3',
          video: '/video/obra-3.mp4',
          poster: '/video/obra-3.webp',
          alt: 'Cuadrilla y volquete durante la carga',
          tag: 'Cuadrillas en planilla',
          lugar: 'Piura',
        },
      ],
    },
    about: {
      eyebrow: 'Quiénes somos en Piura',
      title: 'Una constructora del norte, hecha para el terreno de Piura.',
      text: 'GRENCO nació en Piura ejecutando movimiento de tierras para habilitaciones urbanas e infraestructura agrícola. Aquí operan la oficina principal, el centro logístico y nuestro taller mecánico central, asegurando disponibilidad inmediata de maquinaria pesada.',
    },
    machinery: {
      title: 'Flota pesada propia y soporte técnico directo en Piura.',
    },
    contact: {
      title: 'Cotiza tu proyecto en Piura. Te respondemos en 24 horas.',
      text: 'Envía la ubicación y alcance preliminar de tu obra. Si el terreno está en Piura, Sullana, Paita o Talara, nuestro equipo técnico realiza visita de campo antes de cotizar.',
    },
  },

  trujillo: {
    hero: {
      eyebrow: 'Sede Trujillo · La Libertad',
      title: ['Abrimos vía.', 'Construimos', 'La Libertad.'],
      text: 'Obra civil, vialidad, saneamiento y movimiento de tierras para proyectos públicos y privados en Trujillo y toda La Libertad. Residencia permanente en obra y equipos de alto rendimiento.',
      hint: 'Tomas reales de obra · Trujillo y La Libertad',
      foto: 'obra-1096',
      fotoAlt: 'Motoniveladora conformando la subrasante de una vía en Trujillo',
      paneles: [
        {
          id: 'trujillo-1',
          video: '/video/trujillo-1.mp4',
          poster: '/video/trujillo-1.webp',
          alt: 'Frente de obra en Trujillo',
          tag: 'Frente La Libertad',
          lugar: 'Trujillo',
        },
        {
          id: 'trujillo-2',
          video: '/video/trujillo-2.mp4',
          poster: '/video/trujillo-2.webp',
          alt: 'Movimiento de tierras y vialidad en Trujillo',
          tag: 'Obra civil y vialidad',
          lugar: 'Trujillo',
        },
        {
          id: 'trujillo-3',
          video: '/video/trujillo-3.mp4',
          poster: '/video/trujillo-3.webp',
          alt: 'Flota y cuadrilla operando en Trujillo',
          tag: 'Flota y cuadrilla',
          lugar: 'Trujillo',
        },
      ],
    },
    about: {
      eyebrow: 'Quiénes somos en Trujillo',
      title: 'Ingeniería y obra civil en el frente de La Libertad.',
      text: 'Desde nuestra sede en Trujillo respondemos a las exigencias de obra civil, defensas ribereñas, canalizaciones y habilitaciones viales en toda La Libertad. Nuestra residencia técnica y cuadrillas operan directamente a pie de obra.',
    },
    machinery: {
      title: 'Maquinaria pesada y cuadrillas activas en frentes de Trujillo.',
    },
    contact: {
      title: 'Cotiza tu proyecto en Trujillo. Te respondemos en 24 horas.',
      text: 'Envía las coordenadas y alcance de tu obra en La Libertad (Trujillo, Virú, Pacasmayo, Chicama). Coordinamos inspección técnica en terreno para cotizar con precisión.',
    },
  },
};

const SEDES_VALIDAS = Object.keys(CONTENIDO);

/**
 * Devuelve el bloque de textos de una sede.
 * Cae a Piura si llega un valor raro, para que un localStorage corrupto no
 * deje la pagina sin titular.
 */
export function contenidoDeSede(sede) {
  return CONTENIDO[SEDES_VALIDAS.includes(sede) ? sede : 'piura'];
}
