/**
 * Contenido de la landing. Todo el texto editable vive aqui: los componentes
 * solo lo maquetan. Para cambiar una cifra, un telefono o un servicio, este
 * es el unico archivo que se toca.
 */

export const company = {
  name: 'GRENCO',
  legal: 'Grupo Enriquez Construcciones S.A.C.',
  full: 'GRENCO · Grupo Enriquez Construcciones',
  tagline: 'Movimiento de tierras, obras viales, edificaciones y alquiler de maquinaria pesada. Piura y Trujillo, Perú.',
  email: 'contacto@grenco.pe',
  whatsapp: '51900000000',
  url: 'https://grenco.pe',
  socials: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'linkedin' },
    { name: 'Facebook', url: 'https://www.facebook.com', icon: 'facebook' },
    { name: 'Instagram', url: 'https://www.instagram.com', icon: 'instagram' },
    { name: 'TikTok', url: 'https://www.tiktok.com', icon: 'tiktok' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'youtube' },
  ],
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
    address: 'Oficina técnica y operaciones · Piura, Perú',
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
    address: 'Oficina técnica y comercial · Trujillo, La Libertad',
    hours: 'Lun a vie · 8:00 – 18:00',
    phone: '+51 900 000 001',
    tel: '+51900000001',
    email: 'trujillo@grenco.pe',
  },
];

export const hero = {
  eyebrow: 'Grupo Enriquez Construcciones',
  title: ['Movemos tierra.', 'Levantamos', 'el norte.'],
  text: 'Movimiento de tierras, obras viales, edificaciones y alquiler de maquinaria pesada para proyectos públicos y privados en Piura y La Libertad. Equipos certificados, cuadrillas especializadas y plazos firmados.',
  paneles: [
    {
      id: 'piura-1',
      video: '/video/piura-1.mp4',
      poster: '/video/piura-1.webp',
      alt: 'Rodillo compactador y cuadrilla en conformación de terraplén, Río Piura',
      tag: 'Compactación de acceso',
      lugar: 'Río Piura',
    },
    {
      id: 'piura-2',
      video: '/video/piura-2.mp4',
      poster: '/video/piura-2.webp',
      alt: 'Vista aérea de infraestructura vial y puente carrozable sobre el Río Piura',
      tag: 'Puente y defensas',
      lugar: 'Río Piura',
    },
    {
      id: 'piura-3',
      video: '/video/piura-3.mp4',
      poster: '/video/piura-3.webp',
      alt: 'Motoniveladora CAT nivelando terraplén de acceso en el Río Piura',
      tag: 'Frente de nivelación',
      lugar: 'Río Piura',
    },
  ],
};

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
  text: 'GRENCO nació en Piura ejecutando movimiento de tierras para obras viales y plataformas industriales. Hoy operamos desde dos sedes con equipos de alto rendimiento, soporte técnico directo y un método simple: medir el terreno antes de prometer una fecha.',
  points: [
    {
      title: 'Control topográfico en cada corte',
      text: 'Replanteo con estación total antes, durante y al cierre de cada partida.',
    },
    {
      title: 'Soporte técnico y mantenimiento en obra',
      text: 'Cuadrillas mecánicas de respuesta rápida para asegurar continuidad operativa.',
    },
    {
      title: 'Cuadrillas especializadas en planilla',
      text: 'Operadores de maquinaria y personal civil con seguro y habilitación técnica.',
    },
    {
      title: 'Plazos firmados bajo contrato',
      text: 'Penalidades asumidas por contrato: si prometemos una fecha, la cumplimos.',
    },
  ],
  stats: [
    { num: '12+', label: 'Años en obra' },
    { num: '85+', label: 'Obras entregadas' },
    { num: '02', label: 'Sedes operativas' },
    { num: '100%', label: 'Operadores certificados' },
  ],
};

export const stats = about.stats;

export const manifiesto = {
  eyebrow: 'Cómo trabajamos',
  title: 'La tierra no negocia: o mides bien o pagas el doble.',
  lead:
    'El norte tiene suelos difíciles: arenas que ceden, gredas expansivas y quebradas que despiertan con El Niño. Para construir aquí no basta con tener máquinas: hay que saber cómo responde el terreno.',
  bloques: [
    {
      paso: '01',
      title: 'Medición real de campo',
      text: 'No cotizamos por foto satelital. Enviamos topógrafo al terreno para verificar cotas, nivel freático y accesos.',
    },
    {
      paso: '02',
      title: 'Plan de corte y relleno',
      text: 'Calculamos volúmenes con software topográfico para minimizar fletes de eliminación y optimizar el material de préstamo.',
    },
    {
      paso: '03',
      title: 'Ejecución con soporte continuo',
      text: 'Equipos asignados con operador certificado y mecánicos de guardia para no parar la ruta crítica.',
    },
  ],
  panel: {
    eyebrow: 'Frente de trabajo',
    title: 'Obras viales Los Algarrobos',
    sector: 'Sector Noroeste · Piura',
    specs: [
      { label: 'Área intervenida', value: '14 ha' },
      { label: 'Volumen de corte', value: '42,000 m³' },
      { label: 'Plazo de ejecución', value: '9 meses' },
    ],
    progreso: [
      { label: 'Corte y relleno', pct: 92 },
      { label: 'Redes de agua y desagüe', pct: 64 },
      { label: 'Subrasante de vías', pct: 40 },
    ],
    cuadrillas: [
      { nombre: 'Frente A · Corte', personas: 8, equipo: 'Excavadora 20T' },
      { nombre: 'Frente B · Redes', personas: 6, equipo: 'Retro 4×4' },
      { nombre: 'Topografía', personas: 2, equipo: 'Estación total' },
    ],
  },
};

export const tracking = {
  eyebrow: 'Producto en desarrollo',
  badge: 'Próximamente',
  title: 'GRENCO Tracking: tu obra, en el bolsillo.',
  text: 'Estamos construyendo el portal del cliente. Avance por partida, cuadrillas del día y fotos de campo subidas desde la obra, sin esperar al informe del viernes.',
  features: [
    {
      icon: 'chart',
      title: 'Avance por partida',
      text: 'Porcentaje valorizado, actualizado por el residente al cierre de cada jornada.',
    },
    {
      icon: 'users',
      title: 'Registro de cuadrillas',
      text: 'Quién estuvo en obra, en qué frente y con qué equipo asignado.',
    },
    {
      icon: 'camera',
      title: 'Fotos de campo',
      text: 'Evidencia fotográfica geolocalizada, subida desde el celular del capataz.',
    },
  ],
  app: {
    kicker: 'Control de obra · semana 14',
    title: 'Obras viales Los Algarrobos',
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
  eyebrow: 'Servicios especializados',
  title: 'Del terreno en bruto a la obra entregada.',
  items: [
    {
      id: 'movimiento',
      icon: 'layers',
      title: 'Movimiento de tierras',
      text: 'Corte masivo, relleno, nivelación, conformación de terraplenes y compactación controlada con ensayos de densidad.',
      video: '/video/servicios/servicio-movimiento.mp4',
      poster: '/video/servicios/servicio-movimiento.webp',
    },
    {
      id: 'obras-viales',
      icon: 'grid',
      title: 'Obras viales',
      text: 'Apertura de trochas, afirmado, pavimentación rígida y flexible, bermas, cunetas de drenaje y señalización.',
      video: '/video/servicios/servicio-habilitacion.mp4',
      poster: '/video/servicios/servicio-habilitacion.webp',
    },
    {
      id: 'edificaciones',
      icon: 'building',
      title: 'Edificaciones',
      text: 'Cimentaciones profundas, estructuras de concreto armado, losas industriales de alta resistencia y cerramientos.',
      video: '/video/servicios/servicio-obras-civiles.mp4',
      poster: '/video/servicios/servicio-obras-civiles.webp',
    },
    {
      id: 'soldadura',
      icon: 'shield',
      title: 'Grenco Soldadura',
      text: 'Soldadura calificada, arquitectura metálica pesada, entubados de gran diámetro y montaje de naves industriales.',
      video: '/video/servicios/servicio-soldadura.mp4',
      poster: '/video/servicios/servicio-soldadura.webp',
    },
    {
      id: 'saneamiento',
      icon: 'drop',
      title: 'Saneamiento y redes',
      text: 'Tendido de redes de agua potable, alcantarillado, colectores y drenaje pluvial con pruebas hidráulicas normadas.',
      video: '/video/servicios/servicio-saneamiento.mp4',
      poster: '/video/servicios/servicio-saneamiento.webp',
    },
    {
      id: 'demolicion',
      icon: 'demo',
      title: 'Demolición y desbroce',
      text: 'Demolición controlada de estructuras, desbroce de terreno, eliminación de desmonte y disposición final autorizada.',
      video: '/video/servicios/servicio-demolicion.mp4',
      poster: '/video/servicios/servicio-demolicion.webp',
    },
  ],
};

export const machinery = {
  eyebrow: 'Alquiler de maquinaria pesada',
  title: 'Equipos certificados listos para operar en tu frente de obra.',
  text: 'Modalidades de alquiler flexibles por hora, día, mes o partida de obra. Todos los equipos incluyen operador calificado y soporte técnico preventivo para garantizar cero tiempos muertos.',
  items: [
    {
      id: 'excavadora',
      name: 'Excavadora sobre orugas',
      tag: '20 T · Alquiler',
      specs: [
        ['Alcance de excavación', '9.9 m'],
        ['Capacidad de cuchara', '1.0 m³'],
        ['Operador certificado', 'Incluido'],
        ['Modalidad de servicio', 'Por hora / mes'],
      ],
    },
    {
      id: 'retroexcavadora',
      name: 'Retroexcavadora 4×4',
      tag: '7 T · Alquiler',
      specs: [
        ['Profundidad de zanja', '4.4 m'],
        ['Cuchara frontal', '1.0 m³'],
        ['Ideal para', 'Zanjas y redes'],
        ['Modalidad de servicio', 'Por hora / mes'],
      ],
    },
    {
      id: 'cargador',
      name: 'Cargador frontal',
      tag: '3 m³ · Alquiler',
      specs: [
        ['Carga de operación', '5.4 t'],
        ['Altura de descarga', '3.3 m'],
        ['Ideal para', 'Acopio y carga'],
        ['Modalidad de servicio', 'Por hora / mes'],
      ],
    },
  ],
};

export const missionVision = {
  eyebrow: 'Misión y visión',
  title: 'Hacer obra seria, con plazos que se respetan.',
  mision: {
    label: 'Misión',
    title: 'Construir con rigor técnico y palabra empeñada.',
    body:
      'Brindar soluciones integrales en movimiento de tierras, obras viales, edificaciones y alquiler de maquinaria pesada en el norte del Perú, operando con estándares de seguridad, personal calificado y cumplimiento estricto de cronogramas.',
    pillars: [
      'Plazo y presupuesto sostenidos',
      'Cero accidentes incapacitantes',
      'Conformidad de obra a la primera',
    ],
  },
  vision: {
    label: 'Visión',
    title: 'Ser la constructora de referencia en el norte del Perú.',
    body:
      'Consolidarnos como el socio estratégico más confiable para proyectos de infraestructura pública y privada, reconocidos por nuestra capacidad técnica, soporte operativo continuo y honestidad en cada metro cúbico movido.',
    pillars: [
      'Equipos certificados en alquiler',
      'Operadores homologados en casa',
      'Soporte técnico directo en campo',
    ],
  },
};

export const culture = {
  eyebrow: 'Nuestra cultura',
  title: 'La cuadrilla que entra al terreno es la que lo entrega.',
  text:
    'No rotamos personal a mitad de obra. El ingeniero residente y la cuadrilla que inician el corte acompañan el proyecto hasta el último ensayo de compactación.',
  people: [
    { img: 'eq-topografia', name: 'Topografía', role: 'Campo' },
    { img: 'eq-operador', name: 'Operador CAT', role: 'Maquinaria' },
    { img: 'eq-ssoma', name: 'Supervisor SSOMA', role: 'Seguridad' },
    { img: 'eq-residencia', name: 'Residencia técnica', role: 'Oficina' },
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
      kind: 'Obras viales',
      place: 'Piura',
      sede: 'piura',
      title: 'Los Ejidos, etapa II',
      text: '14 hectáreas habilitadas con vías pavimentadas, bermas, veredas y redes de agua ejecutadas en 9 meses.',
    },
    {
      img: 'pro-planta-agro',
      kind: 'Edificaciones',
      place: 'Sullana',
      sede: 'piura',
      title: 'Ampliación planta agroindustrial',
      text: 'Plataforma estructural, losa industrial y patio de maniobras sin detener la operación de la planta.',
    },
    {
      img: 'pro-via-drenaje',
      kind: 'Obras viales',
      place: 'Trujillo',
      sede: 'trujillo',
      title: 'Vía de acceso y defensas ribereñas',
      text: '1.8 km de vía con cunetas revestidas y alcantarillas, diseñada para resistir crecidas de río.',
    },
  ],
};

export const gallery = {
  eyebrow: 'Galería multimedia',
  title: 'Equipos, frentes de obra y redes oficiales.',
  text: 'Explora nuestros frentes en campo y síguenos en redes sociales para ver tomas aéreas y avances técnicos actualizados.',
  categories: [
    'Todas',
    'Topografía',
    'Maquinaria',
    'Obras viales',
    'Edificaciones',
    'Grenco Soldadura',
    'SSOMA',
  ],
  items: [
    // Maquinaria (3 equipos distintos: excavadora 20T, cargador frontal y retroexcavadora)
    { id: 'maq-1', img: 'maq-excavadora', w: 1000, h: 750, alt: 'Excavadora CAT 20T en frente de corte masivo', tag: 'Maquinaria', span: 2 },
    { id: 'maq-2', img: 'maq-cargador', w: 1000, h: 1778, alt: 'Cargador frontal CAT en patio de maniobras y acopio', tag: 'Maquinaria', span: 3 },
    { id: 'maq-3', img: 'maq-retro-obra', w: 1000, h: 1778, alt: 'Retroexcavadora CAT en zanja estructural urbana', tag: 'Maquinaria', span: 3 },

    // Topografía (las mejores 6 tomas técnicas reales)
    { id: 'topo-1', img: 'topo-lomas-4', w: 1200, h: 593, alt: 'Cuadrilla técnica con receptor GNSS en Las Lomas', tag: 'Topografía', span: 2 },
    { id: 'topo-2', img: 'topo-1', w: 800, h: 1422, alt: 'Estación total Leica sobre hito geodésico en canal', tag: 'Topografía', span: 3 },
    { id: 'topo-3', img: 'topo-lomas-1', w: 800, h: 1422, alt: 'Lectura de prisma y control altimétrico en relieve agreste', tag: 'Topografía', span: 3 },
    { id: 'topo-4', img: 'topo-lomas-extra', w: 800, h: 1422, alt: 'Nivelación digital electrónica de precisión Leica PinPoint', tag: 'Topografía', span: 3 },
    { id: 'topo-5', img: 'topo-lomas-7', w: 800, h: 1422, alt: 'Estación base GNSS sobre punto geodésico certificado', tag: 'Topografía', span: 3 },
    { id: 'topo-6', img: 'topo-2', w: 800, h: 1422, alt: 'Nivel óptico de precisión Leica NA332 para rasantes', tag: 'Topografía', span: 2 },

    // Obras viales
    { id: 'vial-1', img: 'gal-3', w: 800, h: 1066, alt: 'Operación de maquinaria pesada en Piura', tag: 'Obras viales', span: 3 },
    { id: 'vial-2', img: 'vial-apertura', w: 1000, h: 1333, alt: 'Apertura de trocha y explanaciones viales', tag: 'Obras viales', span: 3 },
    { id: 'vial-3', img: 'gal-4', w: 1000, h: 700, alt: 'Motoniveladora Komatsu en conformación de rasante urbana', tag: 'Obras viales', span: 2 },
    { id: 'vial-4', img: 'vial-rasante', w: 1000, h: 1333, alt: 'Nivelación y rasante vial en frente de obra', tag: 'Obras viales', span: 3 },
    { id: 'vial-5', img: 'gal-6', w: 1000, h: 700, alt: 'Superficie compactada y entrega de obra vial', tag: 'Obras viales', span: 2 },

    // Edificaciones
    { id: 'edif-1', img: 'gal-2', w: 1000, h: 700, alt: 'Frente de trabajo estructural y cuadrilla en campo', tag: 'Edificaciones', span: 2 },
    { id: 'edif-2', img: 'edif-estructura-1', w: 1000, h: 1333, alt: 'Montaje de pórticos y estructuras para edificación', tag: 'Edificaciones', span: 3 },
    { id: 'edif-3', img: 'edif-estructura-2', w: 1000, h: 1333, alt: 'Armado de tijerales y cerramientos industriales', tag: 'Edificaciones', span: 3 },
    { id: 'edif-4', img: 'pro-planta-agro', w: 1200, h: 2134, alt: 'Plataforma estructural y patio de maniobras', tag: 'Edificaciones', span: 2 },

    // Grenco Soldadura (fotos reales únicas sin repeticiones)
    { id: 'sold-1', img: 'sold-3128', w: 1000, h: 1778, alt: 'Trabajos de corte, soldadura y armado de estructuras metálicas', tag: 'Grenco Soldadura', span: 3 },
    { id: 'sold-2', img: 'sold-0191', w: 1000, h: 1333, alt: 'Montaje y fijación de elementos de acero estructural en obra', tag: 'Grenco Soldadura', span: 2 },
    { id: 'sold-3', img: 'sold-entubado-1', w: 1000, h: 1778, alt: 'Soldadura y habilitación en fierro para entubados hidráulicos', tag: 'Grenco Soldadura', span: 3 },

    // SSOMA
    { id: 'ssoma-1', img: 'gal-5', w: 1000, h: 700, alt: 'Supervisión de seguridad y charla técnica de inicio de jornada', tag: 'SSOMA', span: 2 },
    { id: 'ssoma-2', img: 'eq-ssoma', w: 800, h: 1423, alt: 'Inspección de EPPs y protocolos SSOMA en frente de obra', tag: 'SSOMA', span: 3 },
  ],
};

export const contact = {
  eyebrow: 'Conversemos',
  title: 'Cuéntanos tu proyecto. Te respondemos en 24 horas.',
  text: 'Envía la ubicación y el alcance estimado de la obra. Nuestro equipo técnico realiza visita de inspección en campo antes de cotizar.',
  serviceOptions: [
    'Movimiento de tierras',
    'Obras viales',
    'Edificaciones',
    'Grenco Soldadura',
    'Alquiler de maquinaria pesada',
    'Saneamiento y redes',
    'Demolición y desbroce',
  ],
};

export const footer = {
  columns: [
    {
      title: 'Servicios',
      links: [
        { label: 'Movimiento de tierras', href: '#servicios' },
        { label: 'Obras viales', href: '#servicios' },
        { label: 'Edificaciones', href: '#servicios' },
        { label: 'Grenco Soldadura', href: '#servicios' },
        { label: 'Saneamiento y redes', href: '#servicios' },
        { label: 'Demolición y desbroce', href: '#servicios' },
      ],
    },
    {
      title: 'Navegación',
      links: [
        { label: 'Nosotros', href: '#nosotros' },
        { label: 'Servicios', href: '#servicios' },
        { label: 'Maquinaria', href: '#maquinaria' },
        { label: 'Proyectos', href: '#proyectos' },
        { label: 'Bitácora', href: '#bitacora' },
        { label: 'Galería', href: '#galeria' },
      ],
    },
  ],
};
