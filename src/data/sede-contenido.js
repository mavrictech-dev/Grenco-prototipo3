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
      eyebrow: 'Sede Piura · Oficina y taller',
      title: ['Movemos tierra.', 'Levantamos', 'el norte.'],
      text: 'Movimiento de tierras, habilitación urbana y alquiler de maquinaria pesada en Piura y Sullana. Flota propia, taller propio y cuadrillas en planilla.',
      hint: 'Tomas reales de obra en Piura · pasa el cursor sobre una',
      // Foto que acompana al titular en Manifiesto. Se elige por sede para que
      // la imagen diga lo mismo que el texto.
      foto: 'obra-0082',
      fotoAlt: 'Excavadora CAT en un corte de movimiento de tierras',
    },
    about: {
      eyebrow: 'Quiénes somos',
      title: 'Una constructora del norte, hecha para el terreno del norte.',
      text: 'GRENCO nació en Piura ejecutando movimiento de tierras para habilitaciones urbanas. Aquí están la oficina principal, el taller y el grueso de la flota: cuando un equipo falla, el mecánico está en la misma ciudad.',
    },
    machinery: {
      title: 'Tres equipos que resuelven el 80% de una obra.',
    },
    contact: {
      title: 'Cuéntanos el terreno. Te respondemos en 24 horas.',
      text: 'Envía la ubicación y el alcance estimado. Si el terreno está en Piura o Sullana, vamos a verlo antes de cotizar.',
    },
  },

  trujillo: {
    hero: {
      eyebrow: 'Sede Trujillo · La Libertad',
      title: ['Abrimos vía.', 'Ordenamos', 'La Libertad.'],
      text: 'Obra civil, vialidad y drenaje para proyectos públicos y privados en Trujillo y La Libertad. Equipos mantenidos en taller propio y residencia permanente en obra.',
      hint: 'Tomas reales de obra en La Libertad · pasa el cursor sobre una',
      foto: 'obra-1096',
      fotoAlt: 'Motoniveladora conformando la subrasante de una vía',
    },
    about: {
      eyebrow: 'Quiénes somos',
      title: 'En La Libertad, desde el frente de trabajo.',
      text: 'GRENCO nació en Piura y abrió Trujillo para acompañar la obra vial y de saneamiento de La Libertad. La oficina comercial coordina desde la ciudad; la residencia vive en el frente, no en el escritorio.',
    },
    machinery: {
      title: 'La flota que sube desde Piura, lista para tu frente.',
    },
    contact: {
      title: 'Cuéntanos la vía. Te respondemos en 24 horas.',
      text: 'Envía la ubicación y el alcance estimado. Si el proyecto está en La Libertad, coordinamos visita técnica antes de cotizar.',
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
