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
      eyebrow: 'Sede Piura · Oficina técnica y base de operaciones',
      title: ['Movemos tierra.', 'Levantamos', 'el norte.'],
      text: 'Movimiento de tierras, obras viales y edificaciones en Piura, Sullana y Talara. Equipos propios certificados, cuadrillas en planilla y soporte técnico directo.',
      hint: 'Tomas reales · Obra Río Piura',
      foto: 'obra-0082',
      fotoAlt: 'Excavadora CAT en un corte de movimiento de tierras',
      paneles: [
        {
          id: 'piura-hero',
          video: '/video/piura-hero.mp4',
          poster: '/video/piura-hero.webp',
          alt: 'Vista aérea cinematográfica de infraestructura vial y puente sobre el Río Piura',
          tag: 'Infraestructura Río Piura',
          lugar: 'Río Piura',
        },
      ],
    },
    about: {
      eyebrow: 'Quiénes somos en Piura',
      title: 'Una constructora del norte, hecha para el terreno de Piura.',
      text: 'GRENCO nació en Piura ejecutando movimiento de tierras para obras viales e infraestructura agrícola. Aquí operan la oficina técnica, el centro logístico y el soporte mecánico para asegurar operatividad continua en frentes de trabajo.',
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
      text: 'Edificaciones, obras viales, saneamiento y movimiento de tierras para proyectos públicos y privados en Trujillo y toda La Libertad. Residencia técnica en obra y equipos propios de alto rendimiento.',
      hint: 'Tomas reales de obra · Trujillo y La Libertad',
      foto: 'obra-1096',
      fotoAlt: 'Motoniveladora conformando la subrasante de una vía en Trujillo',
      paneles: [
        {
          id: 'trujillo-1',
          video: '/video/trujillo.mp4',
          poster: '/video/trujillo.webp',
          alt: 'Frente de obra vial y maquinaria en Trujillo',
          tag: 'Frente La Libertad',
          lugar: 'Trujillo',
        },
      ],
    },
    about: {
      eyebrow: 'Quiénes somos en Trujillo',
      title: 'Ingeniería y edificaciones en el frente de La Libertad.',
      text: 'Desde nuestra sede en Trujillo respondemos a las exigencias de edificaciones, defensas ribereñas, canalizaciones y obras viales en toda La Libertad. Nuestra residencia técnica y cuadrillas operan directamente a pie de obra.',
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
