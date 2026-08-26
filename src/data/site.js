/**
 * Contenido de la landing. Todo el texto editable vive aqui: los componentes
 * solo lo maquetan. Para cambiar una cifra, un telefono o un servicio, este
 * es el unico archivo que se toca.
 */

export const company = {
  name: 'GRENCO',
  legal: 'Grupo Enriquez Construcciones S.A.C.',
  full: 'GRENCO · Grupo Enriquez Construcciones',
  tagline: 'Movimiento de tierras, obra civil y maquinaria pesada. Piura y Trujillo, Perú.',
  email: 'contacto@grenco.pe',
  whatsapp: '51900000000',
  url: 'https://grenco.pe',
};

export const nav = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'maquinaria', label: 'Maquinaria' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'bitacora', label: 'Bitácora' },
  { id: 'galeria', label: 'Galería' },
];

export const sedes = [
  {
    id: 'piura',
    name: 'Sede Piura',
    label: 'Sede Piura',
    principal: true,
    address: 'Oficina y taller · Piura, Perú',
    hours: 'Lun a sáb · 7:00 – 18:00',
    phone: '+51 900 000 000',
    tel: '+51900000000',
    email: 'piura@grenco.pe',
  },
  {
    id: 'trujillo',
    name: 'Sede Trujillo',
    label: 'Sede Trujillo',
    principal: false,
    address: 'Oficina comercial · Trujillo, La Libertad',
    hours: 'Lun a vie · 8:00 – 18:00',
    phone: '+51 900 000 001',
    tel: '+51900000001',
    email: 'trujillo@grenco.pe',
  },
];

export const hero = {
  eyebrow: 'Grupo Enriquez Construcciones',
  title: ['Movemos tierra.', 'Levantamos', 'el norte.'],
  text: 'Movimiento de tierras, obra civil y alquiler de maquinaria pesada para proyectos públicos y privados en Piura y La Libertad. Flota propia, cuadrillas propias, plazos firmados.',

  /**
   * Triptico de fondo: tres clips verticales en fila.
   *
   * Viven en public/video/ (los genera `npm run video`), no en src/: son
   * archivos grandes que cambian muy de vez en cuando y no tiene sentido
   * meterlos en el grafo de modulos. El `poster` es ademas la degradacion
   * natural — si el video no carga o el usuario pidio menos movimiento, es lo
   * unico que se ve.
   */
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
      tag: 'Flota propia',
      lugar: 'Sullana',
    },
    {
      id: 'obra-3',
      video: '/video/obra-3.mp4',
      poster: '/video/obra-3.webp',
      alt: 'Cuadrilla y volquete durante la carga',
      tag: 'Cuadrillas en planilla',
      lugar: 'Trujillo',
    },
  ],
};

/**
 * Las tres pruebas rapidas que solapan el hero.
 *
 * Cada una cubre un eje distinto —gente, plazo y seguridad— y ninguna repite
 * lo que ya dicen las otras secciones. La flota tiene su propia seccion
 * (Maquinaria) y se menciona en el titular, asi que aqui ocupaba un sitio que
 * rendia mas hablando del personal.
 */
export const highlights = [
  {
    icon: 'users',
    title: 'Cuadrillas en planilla',
    text: 'Operadores y peones contratados en planilla, con seguro y capacitación. Sin subcontratas informales en el frente de trabajo.',
  },
  {
    icon: 'clock',
    title: 'Plazos firmes',
    text: 'Cronograma valorizado desde el día uno y reporte semanal de avance con evidencia fotográfica.',
  },
  {
    icon: 'shield',
    title: 'SSOMA primero',
    text: 'Charla de cinco minutos, señalización y equipo de protección verificado en cada turno de obra.',
  },
];

export const about = {
  eyebrow: 'Quiénes somos',
  title: 'Una constructora del norte, hecha para el terreno del norte.',
  text: 'GRENCO nació en Piura ejecutando movimiento de tierras para habilitaciones urbanas. Hoy operamos desde dos sedes con equipo propio, taller propio y un método simple: medir el terreno antes de prometer una fecha.',
  points: [
    {
      title: 'Control topográfico en cada corte',
      text: 'Replanteo con estación total antes, durante y al cierre de cada partida.',
    },
    {
      title: 'Mantenimiento en taller propio',
      text: 'Los equipos no paran la obra: repuestos críticos en stock y mecánicos en sede.',
    },
  ],
  stats: [
    { num: '12', label: 'Años en obra' },
    { num: '180', label: 'Obras entregadas' },
    { num: '02', label: 'Sedes operativas' },
  ],
};

/**
 * Adelanto de la app / portal del cliente. Todavia no existe: la seccion se
 * presenta explicitamente como un producto en desarrollo, con su insignia, y
 * no promete fechas.
 */
export const tracking = {
  eyebrow: 'Producto en desarrollo',
  badge: 'Próximamente',
  title: 'GRENCO Tracking: tu obra, en el bolsillo.',
  text: 'Estamos construyendo el portal del cliente. Avance por partida, cuadrillas del día y fotos de campo subidas desde la obra, sin esperar al informe del viernes.',
  features: [
    { icon: 'chart', title: 'Avance por partida', text: 'Porcentaje valorizado, actualizado por el residente al cierre de cada jornada.' },
    { icon: 'users', title: 'Registro de cuadrillas', text: 'Quién estuvo en obra, en qué frente y con qué equipo asignado.' },
    { icon: 'camera', title: 'Fotos de campo', text: 'Evidencia fotográfica geolocalizada, subida desde el celular del capataz.' },
  ],
  app: {
    kicker: 'Control de obra · semana 14',
    title: 'Habilitación Los Algarrobos',
    status: 'En obra',
    bars: [
      { label: 'Movimiento de tierras', pct: 92 },
      { label: 'Redes de agua y desagüe', pct: 64 },
      { label: 'Pavimentación', pct: 21 },
    ],
    tiles: [
      { value: '4', label: 'Cuadrillas' },
      { value: '11', label: 'Equipos' },
      { value: '+6%', label: 'Semanal', accent: true },
    ],
    cuadrillas: [
      { nombre: 'Frente A · Corte', personas: 8, equipo: 'Excavadora 20T' },
      { nombre: 'Frente B · Redes', personas: 6, equipo: 'Retro 4×4' },
      { nombre: 'Topografía', personas: 2, equipo: 'Estación total' },
    ],
  },
};

export const services = {
  eyebrow: 'Servicios que brindamos',
  title: 'Del terreno en bruto a la obra entregada.',
  items: [
    {
      icon: 'layers',
      title: 'Movimiento de tierras',
      text: 'Corte, relleno, nivelación y compactación con control topográfico y ensayos de densidad.',
    },
    {
      icon: 'building',
      title: 'Obras civiles',
      text: 'Cimentación, estructuras de concreto armado, pavimentos rígidos y flexibles.',
    },
    {
      icon: 'truck',
      title: 'Alquiler de maquinaria',
      text: 'Equipos con operador, combustible y mantenimiento incluidos. Por hora, día o partida.',
    },
    {
      icon: 'drop',
      title: 'Saneamiento y redes',
      text: 'Agua potable, alcantarillado y drenaje pluvial con pruebas hidráulicas certificadas.',
    },
    {
      icon: 'grid',
      title: 'Habilitación urbana',
      text: 'Lotización, vías, veredas y servicios: terreno listo para vender o construir.',
    },
    {
      icon: 'demo',
      title: 'Demolición y desbroce',
      text: 'Retiro controlado, eliminación de material y limpieza de terreno con disposición final.',
    },
  ],
};

export const machinery = {
  eyebrow: 'Nuestra flota',
  title: 'Tres equipos que resuelven el 80% de una obra.',
  items: [
    {
      img: 'maq-excavadora',
      name: 'Excavadora sobre orugas',
      tag: '20 T',
      specs: [
        ['Alcance de excavación', '9.9 m'],
        ['Capacidad de cuchara', '1.0 m³'],
        ['Operador certificado', 'Incluido'],
      ],
    },
    {
      img: 'maq-retroexcavadora',
      name: 'Retroexcavadora 4×4',
      tag: '7 T',
      specs: [
        ['Profundidad de zanja', '4.4 m'],
        ['Cuchara frontal', '1.0 m³'],
        ['Ideal para', 'Redes'],
      ],
    },
    {
      img: 'maq-cargador',
      name: 'Cargador frontal',
      tag: '3 m³',
      specs: [
        ['Carga de operación', '5.4 t'],
        ['Altura de descarga', '3.3 m'],
        ['Ideal para', 'Acopio'],
      ],
    },
  ],
};

export const missionVision = {
  mision: {
    label: 'Misión',
    title: 'Ejecutar obras de movimiento de tierras e infraestructura con equipo propio, cumpliendo el plazo y el estándar técnico que el cliente firmó.',
    body: 'Trabajamos con cuadrillas en planilla, maquinaria mantenida en taller propio y control topográfico en cada partida. Esa es toda la fórmula.',
    pillars: [
      'Plazo y presupuesto sostenidos',
      'Cero accidentes incapacitantes',
      'Conformidad de obra a la primera',
    ],
  },
  vision: {
    label: 'Visión',
    title: 'Ser la constructora de referencia del norte peruano para obras de tierra e infraestructura urbana hacia 2030.',
    body: 'Crecer sin perder el control del frente de trabajo: más equipos propios, más operadores formados en la zona y una tercera sede en el norte.',
    pillars: [
      'Flota renovada cada 5 años',
      'Operadores formados en casa',
      'Tercera sede operativa',
    ],
  },
};

export const culture = {
  eyebrow: 'Nuestra cultura',
  title: 'La obra la hace la gente que se para en ella.',
  people: [
    { img: 'eq-topografia', name: 'Topografía', role: 'Campo' },
    { img: 'eq-operador', name: 'Operación', role: 'Flota' },
    { img: 'eq-ssoma', name: 'SSOMA', role: 'Turno' },
    { img: 'eq-residencia', name: 'Residencia', role: 'Oficina' },
  ],
  values: [
    {
      title: 'Palabra cumplida',
      text: 'Si la fecha se movió, el cliente se entera antes que nadie y con el plan de recuperación puesto.',
    },
    {
      title: 'Gente de la zona',
      text: 'Contratamos y formamos operadores del distrito donde se ejecuta la obra.',
    },
    {
      title: 'Obra limpia',
      text: 'Se entrega el terreno sin material excedente ni pasivos: así se recibe la conformidad.',
    },
  ],
};

export const projects = {
  eyebrow: 'Nuestros proyectos',
  title: 'Casos entregados y en ejecución.',
  items: [
    {
      img: 'pro-ejidos',
      kind: 'Habilitación',
      place: 'Piura',
      sede: 'piura',
      title: 'Los Ejidos, etapa II',
      text: '14 hectáreas lotizadas con vías, veredas y redes de agua ejecutadas en 9 meses.',
    },
    {
      img: 'pro-planta-agro',
      kind: 'Obra civil',
      place: 'Sullana',
      sede: 'piura',
      title: 'Ampliación planta agro',
      text: 'Plataforma, losa industrial y patio de maniobras sin detener la operación de la planta.',
    },
    {
      img: 'pro-via-drenaje',
      kind: 'Vialidad',
      place: 'Trujillo',
      sede: 'trujillo',
      title: 'Vía de acceso y drenaje',
      text: '1.8 km de vía con cunetas y alcantarillas, diseñada para la temporada de lluvias.',
    },
  ],
};

export const gallery = {
  eyebrow: 'Galería de obra',
  title: 'Lo que se ve en campo.',
  // span = filas del grid que ocupa cada tarjeta (grid-auto-rows: 88px).
  // w/h son las dimensiones nativas: sin ellas el navegador no reserva sitio
  // y la pagina salta cuando cargan (CLS).
  items: [
    { img: 'gal-1', w: 800, h: 1066, alt: 'Foto vertical de obra', span: 3 },
    { img: 'gal-2', w: 1000, h: 700, alt: 'Frente de trabajo', span: 2 },
    { img: 'gal-3', w: 800, h: 1066, alt: 'Equipo en operación', span: 3 },
    { img: 'gal-4', w: 1000, h: 700, alt: 'Detalle de obra', span: 2 },
    { img: 'gal-5', w: 1000, h: 700, alt: 'Cuadrilla en campo', span: 2 },
    { img: 'gal-6', w: 1000, h: 700, alt: 'Entrega de obra', span: 2 },
  ],
};

export const contact = {
  eyebrow: 'Conversemos',
  title: 'Cuéntanos el terreno. Te respondemos en 24 horas.',
  text: 'Envía la ubicación y el alcance estimado. Si hace falta, vamos a verlo antes de cotizar.',
  serviceOptions: [
    'Movimiento de tierras',
    'Obras civiles',
    'Alquiler de maquinaria',
    'Saneamiento y redes',
    'Habilitación urbana',
    'Demolición y desbroce',
  ],
};

export const footer = {
  columns: [
    {
      title: 'Servicios',
      links: [
        { label: 'Movimiento de tierras', href: '#servicios' },
        { label: 'Obras civiles', href: '#servicios' },
        { label: 'Alquiler de maquinaria', href: '#maquinaria' },
        { label: 'Habilitación urbana', href: '#servicios' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Nosotros', href: '#nosotros' },
        { label: 'Proyectos', href: '#proyectos' },
        { label: 'Galería', href: '#galeria' },
        { label: 'Contacto', href: '#contacto' },
      ],
    },
  ],
};
