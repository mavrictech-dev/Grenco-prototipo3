import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  AlignmentType,
} from 'docx';

const ROOT = process.cwd();

async function getJpgBuffer(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found:', fullPath);
    return null;
  }
  try {
    const meta = await sharp(fullPath).metadata();
    const buffer = await sharp(fullPath)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Calcular ancho y alto proporcionales para Word (máximo 520px de ancho)
    const targetWidth = 500;
    const targetHeight = Math.round((500 / (meta.width || 800)) * (meta.height || 600));
    return { buffer, width: targetWidth, height: targetHeight };
  } catch (err) {
    console.warn('Error converting image:', relPath, err.message);
    return null;
  }
}

async function createImageParagraph(relPath, caption) {
  const imgData = await getJpgBuffer(relPath);
  if (!imgData) {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: `[Imagen: ${caption} - Archivo: ${relPath}]`,
            italics: true,
            color: '000000',
          }),
        ],
        spacing: { after: 120 },
      }),
    ];
  }

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imgData.buffer,
          transformation: {
            width: imgData.width,
            height: imgData.height,
          },
        }),
      ],
      spacing: { before: 140, after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Figura: ${caption}`,
          bold: true,
          size: 19, // 9.5 pt
          color: '000000',
        }),
      ],
      spacing: { after: 200 },
    }),
  ];
}

function pText(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        color: '000000',
        size: 22, // 11 pt
        font: 'Arial',
        ...options,
      }),
    ],
    spacing: { after: options.after ?? 120 },
  });
}

function bullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix,
        bold: true,
        color: '000000',
        size: 22,
        font: 'Arial',
      })
    );
  }
  children.push(
    new TextRun({
      text,
      color: '000000',
      size: 22,
      font: 'Arial',
    })
  );

  return new Paragraph({
    bullet: { level: 0 },
    children,
    spacing: { after: 80 },
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16 pt
        color: '000000',
        font: 'Arial',
      }),
    ],
    spacing: { before: 280, after: 140 },
    border: {
      bottom: {
        color: '000000',
        space: 4,
        value: 'single',
        size: 12,
      },
    },
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13 pt
        color: '000000',
        font: 'Arial',
      }),
    ],
    spacing: { before: 240, after: 100 },
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [
      new TextRun({
        text,
        bold: true,
        size: 23, // 11.5 pt
        color: '000000',
        font: 'Arial',
      }),
    ],
    spacing: { before: 180, after: 80 },
  });
}

async function buildDoc() {
  console.log('Generando documento de Word (.docx)...');

  const children = [];

  // Portada / Encabezado
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'DOCUMENTO TÉCNICO Y DESCRIPTIVO DE LA LANDING PAGE',
          bold: true,
          size: 36, // 18 pt
          color: '000000',
          font: 'Arial',
        }),
      ],
      spacing: { before: 100, after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'GRENCO · GRUPO ENRIQUEZ CONSTRUCCIONES S.A.C.',
          bold: true,
          size: 26,
          color: '000000',
          font: 'Arial',
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Cuadro informativo formal
  const borderBlack = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: borderBlack,
        bottom: borderBlack,
        left: borderBlack,
        right: borderBlack,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                pText('Empresa: Grupo Enriquez Construcciones S.A.C. (GRENCO)', { bold: true }),
                pText('Proyecto: Plataforma Web Institucional y Comercial (Landing Page)'),
                pText('Versión: 2.0 (Producción)'),
                pText('Ámbito Geográfico: Regiones Piura y La Libertad (Trujillo) - Perú'),
                pText('Formato: Documento técnico formal (tipografía en color negro, sin enlaces azules)'),
              ],
              shading: { fill: 'F8F8F8' },
              margins: { top: 120, bottom: 120, left: 160, right: 160 },
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 240 } })
  );

  // 1. Introducción
  children.push(
    heading1('1. INTRODUCCIÓN Y OBJETIVO DEL PROYECTO'),
    pText(
      'El presente documento detalla la totalidad de secciones, funcionalidades interactivas, arquitectura de diseño y recursos multimedia (fotografías reales de obra y producciones de video) que integran la landing page oficial de GRENCO (Grupo Enriquez Construcciones S.A.C.).'
    ),
    pText(
      'La web ha sido diseñada para posicionar a GRENCO frente a clientes corporativos públicos y privados en el norte del país, destacando su solvencia en movimiento de tierras masivo, habilitación urbana, obras viales, edificaciones, saneamiento y soldadura industrial.'
    )
  );

  // 2. Arquitectura de diseño
  children.push(
    heading1('2. ARQUITECTURA DE DISEÑO Y TECNOLOGÍAS APLICADAS'),
    bullet(
      ' Interfaz construida con sombras y luces volumétricas suaves que simulan superficies de concreto satinado y acabados industriales sobrios.',
      'Estética Neumórfica de Precisión:'
    ),
    bullet(
      ' Conmutador instantáneo que permite navegar en entorno diurno o nocturno, guardando la preferencia del usuario en localStorage.',
      'Modo Claro y Modo Oscuro:'
    ),
    bullet(
      ' La plataforma adapta automáticamente el video de portada, las obras emblemáticas y los contactos según la sede activa (Piura o Trujillo).',
      'Arquitectura Multi-Sede:'
    ),
    bullet(
      ' Todas las fotografías fueron convertidas a formato WebP ligero de alta definición. Los videos fueron comprimidos bajo perfil H.264 High Profile con bandera faststart para reproducción inmediata sin búfer.',
      'Optimización Fotográfica y Streaming:'
    ),
    bullet(
      ' En el pie de página, el año fiscal se actualiza de manera automática mediante código JavaScript (new Date().getFullYear()), garantizando que en 2027 y años sucesivos se actualice automáticamente sin modificaciones manuales.',
      'Derechos de Autor Dinámicos:'
    )
  );

  // 3. Depuración de diseño y eliminación de AI Slop
  children.push(
    heading1('3. DEPURACIÓN DE DISEÑO Y ELIMINACIÓN DE "AI SLOP"'),
    pText(
      'Para asegurar que la plataforma proyecte la solidez y seriedad técnica de una constructora de ingeniería civil, se realizó una auditoría visual completa para erradicar vicios de diseño ("AI Slop"), componentes no solicitados y código residual generado por herramientas de IA:'
    ),
    bullet(
      ' Se eliminó el componente huérfano Nubes.jsx y más de 140 líneas de estilos CSS asociadas al cómputo de nubes fractales SVG y un sol artificial procedural, reduciendo el consumo de memoria y CPU del navegador del cliente.',
      'Eliminación de Simulación Climática Procedural:'
    ),
    bullet(
      ' Se calibraron los tokens cromáticos de sombra (--nu1, --nu2, --nu3, --nuin). Se reemplazaron sombras oscuras con tintes marrones por elevaciones neutras, nítidas y arquitectónicas, eliminando el efecto de "plastilina hinchada" para proyectar la solidez estructural del concreto y el acero.',
      'Refinamiento del Neumorfismo a Estándar de Ingeniería:'
    ),
    bullet(
      ' Se moderaron los radios de curvatura excesivos (de 24-34px a 14-18px en tarjetas y marcos de fotografía de obra), aportando una geometría más sobria, aplomada y técnica.',
      'Ajuste de Geometría y Radios de Borde:'
    ),
    bullet(
      ' Se retiró la animación de onda expansiva continua en el botón flotante de WhatsApp (.wa__pulse), manteniendo una interacción limpia y enfocada sin distracciones permanentes.',
      'Supresión de Micro-Animaciones Invasivas:'
    ),
    bullet(
      ' Se preservaron deliberadamente la barra fija superior de 3px que indica visualmente el avance de desplazamiento (scroll) y el módulo "GRENCO Tracking" (mockups de aplicación móvil y portal de control de obra con cuadrillas de campo).',
      'Preservación de Componentes Clave Validados:'
    )
  );

  // 4. Desglose sección por sección
  children.push(heading1('4. DESGLOSE DETALLADO SECCIÓN POR SECCIÓN'));

  // Sección 1: Navbar
  children.push(
    heading2('Sección 1: Barra de Navegación Superior (Navbar)'),
    pText(
      'Cabecera fija inteligente con detector de desplazamiento (ScrollSpy) y barra fija dorada de 3px que refleja el progreso de lectura. Incluye el logotipo oficial en versión clara y oscura, enlaces directos a las áreas principales (Inicio, Nosotros, Servicios, Proyectos, Bitácora, Galería, Contacto), selector de sede (Piura / Trujillo), conmutador de modo claro/oscuro y botón de cotización directa.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/brand/grenco-lockup-light.webp',
      'Logotipo Institucional GRENCO para Modo Claro'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/brand/grenco-lockup-dark.webp',
      'Logotipo Institucional GRENCO para Modo Oscuro'
    ))
  );

  // Sección 2: Hero
  children.push(
    heading2('Sección 2: Portada Principal (Hero Wall)'),
    pText(
      'Impacto visual inicial con video cinematográfico en pantalla completa, relieve central del isotipo de la marca y llamada a la acción para explorar proyectos.'
    ),
    bullet(
      ' Registro aéreo cinematográfico en 4K optimizado para web a 720p 30fps (3.36 MB). Muestra un vuelo continuo de dron sobre el puente vehicular del Río Piura, el tránsito en marcha, el agua del río y el panorama urbano. Se reproduce en bucle infinito continuo (loop) sin pestañas de corte. Dispone de póster WebP companion (/video/piura-hero.webp).',
      'Video Hero Piura (/video/piura-hero.mp4 - 12.0 Segundos):'
    ),
    bullet(
      ' Registro aéreo continuo sobre frente de trabajo de maquinaria y cuadrillas en La Libertad, acompañado de su póster WebP companion (/video/trujillo.webp).',
      'Video Hero Trujillo (/video/trujillo.mp4 - 14.0 Segundos):'
    )
  );

  // Sección 3: Highlights
  children.push(
    heading2('Sección 3: Indicadores de Confianza (Highlights)'),
    pText('Bloques de respaldo técnico y formalidad empresarial:'),
    bullet(' Personal técnico y operarios contratados bajo régimen formal con seguro SCTR.', 'Cuadrillas en Planilla:'),
    bullet(' Equipos propios CAT, Volvo y Komatsu con operadores certificados.', 'Flota Propia Certificada:'),
    bullet(' Cronogramas de avance valorizado con compromisos de penalidad por atraso.', 'Cumplimiento de Plazos:'),
    bullet(' Protocolos estrictos de seguridad y salud en el trabajo con meta de cero incidentes.', 'Estándar SSOMA:')
  );

  // Sección 4: Manifiesto
  children.push(
    heading2('Sección 4: Manifiesto Institucional'),
    pText(
      'Declaración de principios de ingeniería que aloja el titular H1 principal para posicionamiento en motores de búsqueda: "Movemos tierra. Levantamos el norte". Presenta el compromiso operativo de la empresa acompañado de fotografía real de campo.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/obra/obra-0082.webp',
      'Cuadrilla de Campo y Maquinaria en Movimiento de Tierras (obra-0082)'
    ))
  );

  // Sección 5: About
  children.push(
    heading2('Sección 5: Sobre la Empresa (About)'),
    pText(
      'Exposición de la capacidad técnica, talleres de mantenimiento propios, bases operativas en Piura y Trujillo y especialidades constructivas en el norte del país.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/obra/obra-1718.webp',
      'Inspección Técnica de Suelos y Topografía en Obra (obra-1718)'
    ))
  );

  // Sección 6: Tracking
  children.push(
    heading2('Sección 6: Portal de Seguimiento en Tiempo Real (Tracking)'),
    pText(
      'Adelanto del sistema digital de supervisión de obra. Cuenta con una insignia táctil neumórfica "Próximamente" con relieve grabado y punto de estado, acompañada de una ficha técnica de la aplicación (curva S valorizada, reporte de horas de maquinaria pesada y cuadrillas en frente) que completa armónicamente el encabezado. Se presentan maquetas interactivas del aplicativo móvil y panel web, junto con una tira continua de fotos de campo georreferenciadas.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/obra/obra-1012.webp',
      'Verificación de Eje y Nivel de Vía en Terreno (obra-1012)'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/obra/obra-1844.webp',
      'Cuadrilla de Ingeniería Verificando Puntos Geodésicos (obra-1844)'
    ))
  );

  // Sección 7: Servicios
  children.push(
    heading2('Sección 7: Servicios Especializados (Videos Demostrativos)'),
    pText(
      'Seis tarjetas con especificaciones técnicas detalladas y videos individuales en bucle continuo:'
    ),
    bullet(
      ' Excavadoras sobre orugas realizando corte masivo de terreno, perfilado de taludes y carguío a camiones volquete.',
      '1. Movimiento de Tierras (Video: /video/servicios/servicio-movimiento.mp4):'
    ),
    bullet(
      ' Motoniveladora y rodillo compactador conformando subrasante y terraplén para vías de acceso urbano y rural.',
      '2. Habilitación Urbana y Rasantes (Video: /video/servicios/servicio-habilitacion.mp4):'
    ),
    bullet(
      ' Encofrado, vaciado de concreto estructural y cimentaciones para naves industriales y colegios.',
      '3. Obras Civiles y Edificaciones (Video: /video/servicios/servicio-obras-civiles.mp4):'
    ),
    bullet(
      ' Operadores especializados en soldadura por arco y habilitación de vigas reticuladas y tuberías de conducción.',
      '4. Soldadura y Estructuras Metálicas (Video: /video/servicios/servicio-soldadura.mp4):'
    ),
    bullet(
      ' Zanjeo con retroexcavadora e instalación de tuberías para redes de agua potable, desagüe y drenaje pluvial.',
      '5. Saneamiento y Redes Hidráulicas (Video: /video/servicios/servicio-saneamiento.mp4):'
    ),
    bullet(
      ' Demolición controlada de estructuras de concreto y retiro de material excedente con volquetes de alto tonelaje.',
      '6. Demoliciones Técnicas y Eliminación (Video: /video/servicios/servicio-demolicion.mp4):'
    )
  );

  // Sección 8: Misión y Visión
  children.push(
    heading2('Sección 8: Misión, Visión y Valores'),
    pText(
      'Pilares institucionales de GRENCO: compromiso de ingeniería rigurosa, cumplimiento estricto de cronogramas y transparencia en costos operativos.'
    )
  );

  // Sección 9: Cultura
  children.push(
    heading2('Sección 9: Cultura y Equipo Humano'),
    pText('Presentación de los perfiles profesionales que lideran las obras de la constructora:')
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/eq-residencia.webp',
      'Ingeniería Residente de Obra'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/eq-topografia.webp',
      'Especialista en Topografía y Georreferenciación'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/eq-operador.webp',
      'Operador Homologado de Maquinaria Pesada'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/eq-ssoma.webp',
      'Supervisión de Seguridad y Salud Ocupacional (SSOMA)'
    ))
  );

  // Sección 10: Proyectos
  children.push(
    heading2('Sección 10: Proyectos Emblemáticos'),
    pText('Fichas de obras de envergadura ejecutadas en el norte peruano:')
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/pro-planta-agro.webp',
      'Planta Agroindustrial - Movimiento de Tierras y Nivelación'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/pro-ejidos.webp',
      'Defensas Ribereñas y Muros de Contención Los Ejidos'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/pro-via-drenaje.webp',
      'Construcción de Vía Canal y Redes de Drenaje Pluvial'
    ))
  );

  // Sección 11: Bitácora
  children.push(
    heading2('Sección 11: Bitácora de Obra'),
    pText(
      'Registro cronológico de avances de campo con fechas formales, descripciones técnicas y soporte fotográfico.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/obra/obra-1096.webp',
      'Avance de Plataforma y Rasante (obra-1096)'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/obra/obra-4827.webp',
      'Nivelación y Control Altimétrico de Terreno (obra-4827)'
    ))
  );

  // Sección 12: Galería
  children.push(
    heading2('Sección 12: Galería Fotográfica Profesional con Sistema de Zoom 2D'),
    pText(
      'Módulo de exhibición clasificado por categorías técnicas (Todas, Topografía, Maquinaria, Obras viales, Edificaciones, Grenco Soldadura). Cuenta con vista inicial compacta de 6 fotografías y botón con relieve neumorfista 3D "Ver más fotos".'
    ),
    heading3('Funcionalidades del Visor con Zoom Interactivo:'),
    bullet(
      ' Clic directo sobre cualquier foto amplía instantáneamente a 240% centrado hacia la zona pulsada. Un segundo clic restaura la vista al 100%.',
      'Zoom por Clic / Doble Clic:'
    ),
    bullet(
      ' Desplazamiento de la rueda del ratón amplía progresivamente desde 100% hasta 400% sin alterar el scroll de la página.',
      'Zoom Continuo con Rueda del Mouse:'
    ),
    bullet(
      ' Con la imagen aumentada, el cursor adopta modo de agarre (grab/grabbing) para arrastrar y explorar detalles constructivos en tiempo real a 60 fps con topes elásticos de contorno.',
      'Arrastre y Paneo 2D (Pan & Drag):'
    ),
    bullet(
      ' Botón alejar (-), badge de porcentaje activo (100%, 150%, 200%), botón acercar (+) y botón restablecer (↺).',
      'Barra de Controles Neumórfica:'
    ),
    bullet(
      ' Al abrir el visor, el fondo se desenfoca 20px y se bloquea totalmente el scroll y la interacción del fondo.',
      'Bloqueo Absoluto de Fondo:'
    ),
    bullet(
      ' Pellizco con dos dedos (pinch-to-zoom) y arrastre con un dedo en teléfonos y tabletas.',
      'Compatibilidad Táctil Móvil:'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/topo-lomas-4.webp',
      'Topografía con Receptor Satelital GNSS Diferencial en Las Lomas'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/topo-1.webp',
      'Estación Total Leica Calibrada sobre Hito Geodésico en Canal'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/topo-lomas-extra.webp',
      'Detalle Digital Macro Leica PinPoint y Plomada Láser'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/gal-4.webp',
      'Motoniveladora Komatsu en Conformación de Rasante Urbana'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/sold-3128.webp',
      'Corte y Soldadura de Perfiles de Acero Estructural en Obra'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/sold-0191.webp',
      'Montaje y Fijación de Elementos Metálicos Estructurales'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/sold-entubado-1.webp',
      'Habilitación y Soldadura en Zanja para Tubería Hidráulica'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/images/edif-estructura-1.webp',
      'Columnas y Cimentación de Concreto Armado en Edificación'
    ))
  );

  // Sección 13 y 14
  children.push(
    heading2('Sección 13: Contacto y Cotizaciones'),
    pText(
      'Canal de conversión con formulario técnico de cotización, números directos de WhatsApp institucional para Piura y Trujillo y ubicación física de bases operativas.'
    ),
    heading2('Sección 14: Pie de Página (Footer) y Elementos Flotantes'),
    pText(
      'Enlaces a redes sociales institucionales (LinkedIn, Facebook, Instagram, TikTok, YouTube), botón flotante permanente de WhatsApp (FAB), botón de retorno rápido a cabecera (Volver arriba) y leyenda de derechos de autor con cálculo dinámico del año.'
    )
  );

  // Tabla resumen multimedia
  children.push(
    heading1('5. TABLA RESUMEN DE RECURSOS MULTIMEDIA DE LA LANDING'),
    pText('Inventario técnico de los archivos multimedia incorporados en la plataforma:')
  );

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [pText('Tipo', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Archivo', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Formato', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Sección', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Descripción Técnica', { bold: true })], shading: { fill: 'EAEAEA' } }),
      ],
    }),
    ...[
      ['Video', 'piura-hero.mp4', 'H.264 720p', 'Hero Piura', 'Toma aérea 12s sobre puente vehicular Río Piura en bucle continuo'],
      ['Póster', 'piura-hero.webp', 'WebP', 'Hero Piura', 'Imagen de precarga del Hero de Piura'],
      ['Video', 'trujillo.mp4', 'H.264 720p', 'Hero Trujillo', 'Toma aérea 14s sobre frente de obra en La Libertad'],
      ['Póster', 'trujillo.webp', 'WebP', 'Hero Trujillo', 'Imagen de precarga del Hero de Trujillo'],
      ['Video', 'servicio-movimiento.mp4', 'H.264 720p', 'Servicios', 'Excavadoras en corte masivo y carguío a volquetes'],
      ['Video', 'servicio-habilitacion.mp4', 'H.264 720p', 'Servicios', 'Motoniveladora y rodillo perfilando subrasante'],
      ['Video', 'servicio-obras-civiles.mp4', 'H.264 720p', 'Servicios', 'Encofrado y vaciado de concreto en zapatas'],
      ['Video', 'servicio-soldadura.mp4', 'H.264 720p', 'Servicios', 'Soldadores en estructuras metálicas y tuberías'],
      ['Video', 'servicio-saneamiento.mp4', 'H.264 720p', 'Servicios', 'Zanjeo e instalación de redes matrices'],
      ['Video', 'servicio-demolicion.mp4', 'H.264 720p', 'Servicios', 'Demolición controlada y retiro de material'],
      ['Foto', 'topo-lomas-4.webp', 'WebP', 'Galería', 'Topografía GNSS diferencial en Las Lomas'],
      ['Foto', 'topo-1.webp', 'WebP', 'Galería', 'Estación total Leica sobre hito geodésico'],
      ['Foto', 'topo-lomas-extra.webp', 'WebP', 'Galería', 'Detalle digital pantalla Leica PinPoint'],
      ['Foto', 'gal-4.webp', 'WebP', 'Galería', 'Motoniveladora Komatsu en rasante vial'],
      ['Foto', 'sold-3128.webp', 'WebP', 'Galería', 'Soldadura estructural pesada en taller de obra'],
      ['Foto', 'sold-0191.webp', 'WebP', 'Galería', 'Montaje de vigas y columnas de acero'],
      ['Foto', 'sold-entubado-1.webp', 'WebP', 'Galería', 'Soldadura en tubería hidráulica'],
      ['Foto', 'maq-excavadora.webp', 'WebP', 'Galería (Maquinaria)', 'Excavadora hidráulica sobre orugas CAT 20T en frente de obra'],
      ['Foto', 'maq-cargador.webp', 'WebP', 'Galería (Maquinaria)', 'Cargador frontal CAT para carguío y acopio'],
      ['Foto', 'maq-retro-obra.webp', 'WebP', 'Galería (Maquinaria)', 'Retroexcavadora CAT 420F en zanjeo estructural'],
    ].map(
      ([tipo, archivo, formato, seccion, desc]) =>
        new TableRow({
          children: [
            new TableCell({ children: [pText(tipo, { bold: true })] }),
            new TableCell({ children: [pText(archivo)] }),
            new TableCell({ children: [pText(formato)] }),
            new TableCell({ children: [pText(seccion)] }),
            new TableCell({ children: [pText(desc)] }),
          ],
        })
    ),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: borderBlack,
        bottom: borderBlack,
        left: borderBlack,
        right: borderBlack,
        insideHorizontal: borderBlack,
        insideVertical: borderBlack,
      },
      rows: tableRows,
    })
  );

  // Cierre formal
  children.push(
    new Paragraph({ spacing: { before: 300 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Documento técnico formal emitido para la gerencia y equipo de ingeniería de GRENCO (Grupo Enriquez Construcciones S.A.C.).',
          italics: true,
          size: 20,
          color: '000000',
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 pulgada
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  let outPath = path.join(ROOT, 'DOCUMENTO_LANDING_GRENCO.docx');
  try {
    fs.writeFileSync(outPath, buffer);
    console.log('Documento creado exitosamente en:', outPath);
  } catch (err) {
    if (err.code === 'EBUSY') {
      outPath = path.join(ROOT, 'DOCUMENTO_LANDING_GRENCO_ACTUALIZADO.docx');
      fs.writeFileSync(outPath, buffer);
      console.log('DOCUMENTO_LANDING_GRENCO.docx está abierto en Word. Guardado como:', outPath);
    } else {
      throw err;
    }
  }
}

buildDoc().catch((err) => {
  console.error('Error al generar Word:', err);
  process.exit(1);
});
