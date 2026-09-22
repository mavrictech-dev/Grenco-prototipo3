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
    const targetWidth = 490; // Ancho óptimo para página Word con márgenes de 1 pulgada
    let targetHeight = Math.round((targetWidth / (meta.width || 1440)) * (meta.height || 900));
    
    // Si la captura es muy alta (por ejemplo, una grilla extensa), limitamos la altura para que no desborde la página
    if (targetHeight > 420) {
      targetHeight = 420;
    }

    const buffer = await sharp(fullPath)
      .resize({ width: 980, height: Math.round(targetHeight * 2), fit: 'inside' })
      .jpeg({ quality: 88 })
      .toBuffer();

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
            text: `[Captura de pantalla: ${caption} - Archivo: ${relPath}]`,
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
    spacing: { after: 100 },
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14 pt
        color: '000000',
        font: 'Arial',
      }),
    ],
    spacing: { before: 240, after: 140 },
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12 pt
        color: '000000',
        font: 'Arial',
      }),
    ],
    spacing: { before: 200, after: 100 },
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22, // 11 pt
        color: '000000',
        font: 'Arial',
      }),
    ],
    spacing: { before: 140, after: 80 },
  });
}

async function buildDoc() {
  console.log('Generando documento de Word con capturas de pantalla reales (.docx)...');

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
                pText('Versión: 2.1 (Actualización y Nuevas Modificaciones - Septiembre 2026)'),
                pText('Ámbito Geográfico: Regiones Piura y La Libertad (Trujillo) - Perú'),
                pText('Modalidad de Registro: Informe técnico formal con capturas directas de pantalla de la interfaz en producción'),
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
      'El presente documento detalla la totalidad de secciones, funcionalidades interactivas, arquitectura de diseño y evidencias visuales directas (capturas de pantalla tomadas de la plataforma en funcionamiento) que conforman la landing page oficial de GRENCO (Grupo Enriquez Construcciones S.A.C.).'
    ),
    pText(
      'En cumplimiento con los requerimientos de gerencia, se han incorporado capturas de pantalla auténticas de cada sección del aplicativo web, permitiendo visualizar la composición real, la estética neumórfica táctil, el comportamiento responsivo, las fichas técnicas y los controles interactivos desplegados para los clientes corporativos del sector público y privado.'
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
      '1. Eliminación de Simulación Climática Procedural:'
    ),
    bullet(
      ' Se calibraron sombras arquitectónicas nítidas, erradicando fondos marrones sucios en modo claro y suprimiendo relieves de "plastilina inflada" por biseles sobrios de ingeniería.',
      '2. Neumorfismo Calibrado a Estándar de Ingeniería Civil:'
    ),
    bullet(
      ' Se redujeron bordes excesivamente redondeados (de 34px a 14px-18px), otorgando a las tarjetas y marcos de foto una presencia constructiva seria.',
      '3. Geometría y Radios de Borde Controlados:'
    ),
    bullet(
      ' Se eliminó la onda de choque expansiva constante en el botón de WhatsApp, dejando una interacción limpia sin distracciones invasivas.',
      '4. Supresión de Animaciones Distractoras:'
    ),
    bullet(
      ' Se rediseñó la insignia a un bajo relieve neumórfico grabado con punto de estado, integrando a su costado una ficha técnica sobre curva S, avance valorizado y horas de maquinaria, eliminando espacios vacíos.',
      '5. Rediseño Neumórfico del Módulo Tracking y Ficha de App:'
    ),
    bullet(
      ' La sección de proyectos se optimizó para destacar con exclusividad el servicio insignia de topografía con dron ("Vuelo de Las Lomas"), con video aéreo interactivo.',
      '6. Consolidación de Casos Emblemáticos:'
    )
  );

  // 4. Evidencias visuales y desglose de secciones
  children.push(
    heading1('4. EVIDENCIAS VISUALES Y DESGLOSE POR SECCIONES (CAPTURAS EN VIVO)'),
    pText(
      'A continuación se presentan las capturas de pantalla capturadas directamente de la plataforma en funcionamiento, documentando la interfaz de usuario, los componentes interactivos y el contenido técnico presentado a los visitantes:'
    )
  );

  // Sección 1: Navbar y Hero Wall
  children.push(
    heading2('Sección 1: Cabecera Fija (Navbar) y Portada Principal Hero Wall (Sede Piura)'),
    pText(
      'La cabecera superior fija proporciona navegación inmediata con enlaces a las secciones clave, conmutador de tema claro/oscuro, selector de sede activa y botón de cotización directa. El Hero Wall despliega en pantalla completa el vuelo de dron en 4K optimizado sobre el puente vehicular del Río Piura en bucle continuo, con el isotipo de la marca en relieve.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/01-portada-hero-navbar.png',
      'Cabecera de Navegación Fija con Selector de Sede y Portada Hero Wall (Sede Piura)'
    ))
  );

  // Sección 1B: Hero Wall Sede Trujillo
  children.push(
    heading2('Demostración Multi-Sede: Conmutación a Sede Trujillo'),
    pText(
      'Al seleccionar la Sede Trujillo en la barra de navegación, la portada adapta instantáneamente el registro de video y el titular contextual hacia los frentes de trabajo de maquinaria y movimiento de tierras en la región La Libertad, conservando la selección en la sesión del usuario.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/01b-portada-hero-trujillo.png',
      'Portada Hero Wall Dinámica con Frente de Obra en Trujillo (La Libertad)'
    ))
  );

  // Sección 2: Highlights
  children.push(
    heading2('Sección 2: Indicadores de Confianza y Sellos de Respaldo (Highlights)'),
    pText(
      'Tres tarjetas con elevación neumórfica convexa que sintetizan los principales sellos diferenciales de GRENCO: topografía de precisión con estación total y dron, flota propia de maquinaria pesada certificada (CAT, Volvo, Komatsu) y cumplimiento estricto de cronogramas con penalidades contractuales.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/02-highlights.png',
      'Tarjetas de Confianza y Sellos de Formalidad Operativa en Relieve Neumórfico'
    ))
  );

  // Sección 3: Manifiesto
  children.push(
    heading2('Sección 3: Manifiesto Institucional'),
    pText(
      'Declaración de principios de ingeniería que aloja el titular H1 principal de la plataforma ("Movemos tierra. Levantamos el norte"), acompañado de la fotografía técnica de frente de campo y el botón de solicitud directa de cotización.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/03-manifiesto.png',
      'Manifiesto Institucional H1 con Fotografía de Cuadrilla de Campo y Llamada a la Acción'
    ))
  );

  // Sección 4: About
  children.push(
    heading2('Sección 4: Capacidad Operativa y Bases (Sobre la Empresa)'),
    pText(
      'Detalle de la infraestructura de la empresa: talleres mecánicos propios para mantenimiento preventivo, bases operativas descentralizadas en Piura y Trujillo, y cumplimiento de estándares de seguridad SSOMA con meta de cero incidentes.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/04-nosotros.png',
      'Sección Sobre la Empresa: Capacidad Técnica, Flota y Bases en Piura y Trujillo'
    ))
  );

  // Sección 5: Tracking
  children.push(
    heading2('Sección 5: Portal de Seguimiento en Tiempo Real (GRENCO Tracking)'),
    pText(
      'Adelanto del sistema digital de supervisión de obra. Incorpora la insignia neumórfica grabada "Próximamente" en bajo relieve, la nueva ficha técnica informativa de la aplicación móvil/web (curva S valorizada, reporte diario de horas de maquinaria y ensayos de densidad) y los mockups interactivos de supervisión.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/05-tracking-portal.png',
      'Portal y App GRENCO Tracking: Insignia Neumórfica Grabada, Ficha de App y Maquetas UI'
    ))
  );

  // Sección 6: Servicios
  children.push(
    heading2('Sección 6: Grilla de Servicios Especializados'),
    pText(
      'Exhibición de las seis líneas operativas de la constructora: Movimiento de tierras masivo, Topografía y geodesia de precisión (con video de dron en Las Lomas), Obras viales y rasantes, Grenco Soldadura y estructuras pesadas, Saneamiento y redes hidráulicas, y Demoliciones técnicas controladas. Cada tarjeta dispone de video demostrativo en bucle e iconografía industrial.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/06-servicios.png',
      'Grilla de Servicios Especializados con Tarjetas de Video en Bucle Continuo'
    ))
  );

  // Sección 7: Misión y Visión
  children.push(
    heading2('Sección 7: Misión, Visión y Pilares Estratégicos'),
    pText(
      'Control segmentado interactivo con relieve neumórfico que permite alternar entre la Misión institucional y la Visión a largo plazo de GRENCO, respaldadas por cuatro pilares: rigor técnico, maquinaria de última generación, seguridad humana y transparencia en costos.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/07-mision-vision.png',
      'Control Segmentado Interactivo de Misión, Visión y Pilares Estratégicos'
    ))
  );

  // Sección 8: Proyectos
  children.push(
    heading2('Sección 8: Proyectos Emblemáticos (Caso Destacado "Vuelo de Las Lomas")'),
    pText(
      'Presentación destacada de obra técnica mediante una tarjeta cinematográfica singular: levantamiento topográfico para expediente técnico con ortofotografía de alta resolución y video aéreo interactivo de dron para la Municipalidad de Piura.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/08-proyectos-lomas.png',
      'Tarjeta Singular del Proyecto "Vuelo de Las Lomas" con Soporte de Video Aéreo de Dron'
    ))
  );

  // Sección 9: Bitácora
  children.push(
    heading2('Sección 9: Bitácora de Obra (Avances Georreferenciados)'),
    pText(
      'Registro cronológico de actividades constructivas en campo, presentando tarjetas formales con fecha, ubicación exacta por sede, descripción de partidas y fotografías de sustento técnico.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/09-bitacora.png',
      'Bitácora de Obra: Registro Cronológico de Partidas y Avances Técnicos en Campo'
    ))
  );

  // Sección 10: Galería
  children.push(
    heading2('Sección 10: Galería Multimedia Interactiva con Filtros por Especialidad'),
    pText(
      'Módulo de exhibición visual clasificado por áreas técnicas (Topografía, Maquinaria, Obras viales, Edificaciones, Soldadura). Incorpora visor de aumento profesional (zoom 2D con rueda de ratón hasta 400%, paneo táctil y controles neumórficos).'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/10-galeria.png',
      'Galería Multimedia con Filtros por Categoría Técnica y Fotografías Reales de Obra'
    ))
  );

  // Sección 11: Contacto
  children.push(
    heading2('Sección 11: Módulo de Contacto Directo y Formulario de Cotización'),
    pText(
      'Canal de conversión diseñado con campos de formulario en relieve neumórfico para cotizaciones inmediatas de obras civiles, acompañado de los números de contacto directo de WhatsApp y direcciones físicas de las bases operativas en Piura y Trujillo.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/11-contacto.png',
      'Formulario Neumórfico de Cotización de Obra y Canales Directos de Atención'
    ))
  );

  // Sección 12: Footer
  children.push(
    heading2('Sección 12: Pie de Página Institucional (Footer)'),
    pText(
      'Pie de página formal que consolida el logotipo de GRENCO, síntesis corporativa, enlaces rápidos de navegación, canales de contacto y el cálculo dinámico del año fiscal de derechos reservados.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/12-footer.png',
      'Pie de Página Institucional con Año Dinámico y Accesos Rápidos de Navegación'
    ))
  );

  // Sección 13: Demostración Modo Oscuro
  children.push(
    heading2('Sección 13: Demostración de Modo Oscuro (Entorno Nocturno)'),
    pText(
      'La plataforma dispone de soporte completo para navegación nocturna. Al alternar el tema visual, las superficies se transforman en grafito mate y acero oscuro, conservando la legibilidad técnica, los contrastes cromáticos dorados y los relieves volumétricos sin fatiga visual.'
    )
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/13-modo-oscuro-hero.png',
      'Portada Principal en Modo Oscuro (Ambiente Nocturno de Alta Definición)'
    ))
  );
  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/14-modo-oscuro-tracking.png',
      'Módulo de Supervisión Tracking en Modo Oscuro con Contraste Neumórfico'
    ))
  );

  // 5. Anexo de Nuevas Modificaciones y Actualizaciones
  children.push(
    heading1('5. ANEXO DE ACTUALIZACIONES RECIENTES Y NUEVAS MODIFICACIONES (VERSIÓN 2.1)'),
    pText(
      'El presente anexo documenta de manera exhaustiva las últimas mejoras funcionales, visuales, de seguridad operativa industrial y de arquitectura de software implementadas en la plataforma web de GRENCO, incluyendo la integración en la nube, auditoría de seguridad y protección de código para entrega al cliente.'
    ),

    heading2('5.1 Conexión Directa del Formulario a Google Sheets (Excel en Línea)'),
    pText(
      'Se ha implementado una arquitectura de captura de leads y cotizaciones en tiempo real directamente conectada a una hoja de cálculo institucional de Google Sheets (Excel en línea). Esta solución opera mediante un endpoint dedicado en Google Apps Script, eliminando la necesidad de plataformas intermediarias de pago (Formspree, Basin) y garantizando que los datos ingresados se almacenen inmediatamente en filas seguras en la nube.'
    ),
    pText(
      'Cada registro captura: Marca temporal (Fecha y Hora), Nombre y Apellido del cliente, Correo Electrónico, Teléfono de contacto, Servicio de interés, Sede seleccionada (Piura o Trujillo) y Ubicación/Alcance del proyecto. La interfaz ofrece retroalimentación instantánea al usuario con el compromiso formal: "Solicitud registrada. Te respondemos hoy mismo."'
    )
  );

  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/11-contacto.png',
      'Módulo de Contacto Actualizado con Conexión a Google Sheets y Compromiso de Respuesta Inmediata'
    ))
  );

  children.push(
    heading2('5.2 Reestructuración de Servicios y Adaptabilidad Responsive'),
    pText(
      'Atendiendo a las directivas comerciales y estratégicas de la constructora, se procedió a retirar la tarjeta de "Grenco Soldadura" de la cuadrícula de servicios y opciones desplegables. Para mantener un equilibrio visual perfecto y evitar espacios vacíos asimétricos, se rediseñó la rejilla de servicios en un formato dinámico de 3 columnas simétricas en pantallas de escritorio (repeat(3, 1fr)).'
    ),
    pText(
      'En dispositivos móviles y tablets, el layout se adapta automáticamente: en resoluciones intermedias centra cualquier tarjeta impar para conservar la armonía estética neumórfica, y en teléfonos inteligentes pasa a una columna vertical fluida de lectura táctil.'
    )
  );

  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/06-servicios.png',
      'Cuadrícula de Servicios Reestructurada en 3 Columnas Simétricas 100% Responsives'
    ))
  );

  children.push(
    heading2('5.3 Nueva Galería Multimedia con 17 Fotos Reales y Auditoría de Seguridad EPP'),
    pText(
      'Se integraron 17 nuevas fotografías auténticas en alta definición, capturadas directamente en los frentes de obra, canteras y proyectos de ingeniería de GRENCO. Cada imagen fue sometida a un riguroso proceso de compresión a formato WebP moderno, logrando una reducción promedio de peso del 87.5% (de más de 45 MB a solo 5.1 MB totales), lo que asegura una velocidad de carga ultrarrápida sin pérdida de nitidez.'
    ),
    pText(
      'Asimismo, se realizó una auditoría de seguridad industrial (SSOMA) sobre todas las tomas con presencia de personal, confirmando el cumplimiento estricto de Equipos de Protección Personal (EPP):'
    ),
    bullet(' reglamentarios con código de colores según jerarquía técnica (blanco para supervisión e ingeniería, azul y naranja para operarios).', 'Cascos de seguridad MSA'),
    bullet(' y uniformes institucionales con cintas de alta visibilidad reflectiva homologadas.', 'Chalecos técnicos'),
    bullet(' integrada y cubre-nucas legionarios contra radiación solar intensa en el norte peruano.', 'Protección auditiva'),
    bullet(' de faena (botines punta de acero para terreno agreste y botas de jebe para vaciado de concreto húmedo).', 'Calzado de seguridad')
  );

  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/10-galeria.png',
      'Nueva Galería Multimedia con Selección de Imágenes Reales de Alto Impacto'
    ))
  );

  children.push(
    pText(
      'A continuación se exhiben las evidencias de los nuevos filtros técnicos especializados de la galería:'
    )
  );

  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/10b-galeria-maquinaria.png',
      'Filtro Maquinaria: Flota Pesada CAT, Rodillo Compactador Bomag y Motoniveladora al Atardecer'
    ))
  );

  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/10c-galeria-topografia.png',
      'Filtro Topografía: Estación Total Leica PinPoint R500 y Georreferenciación GNSS sobre Hito IGN'
    ))
  );

  children.push(
    ...(await createImageParagraph(
      'src/assets/capturas/10d-galeria-ssoma.png',
      'Filtro SSOMA: Formación y Charla Técnica de Seguridad de 5 Minutos con Cuadrilla Completa en EPP'
    ))
  );

  children.push(
    heading2('5.4 Protección de Propiedad Intelectual y Ofuscación de Código'),
    pText(
      'Para salvaguardar el valor comercial y tecnológico del desarrollo ante la entrega del producto final al cliente, se incorporó un pipeline de ofuscación de código avanzado en el proceso de compilación (npm run build).'
    ),
    pText(
      'El motor de ofuscación transforma el JavaScript de producción mediante renombramiento hexadecimal de variables y funciones, cifrado en Base64 de cadenas de texto y aplanamiento de flujo de control (Control Flow Flattening), desactivando los source maps para imposibilitar la ingeniería inversa o extracción del código fuente original desde las herramientas de inspección del navegador.'
    )
  );

  // 6. Tabla resumen multimedia
  children.push(
    heading1('6. TABLA RESUMEN DE RECURSOS Y CAPTURAS DEL INFORME'),
    pText('Inventario técnico de los componentes y evidencias visuales incorporadas en el informe:')
  );

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [pText('Tipo', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Identificador', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Sección / Componente', { bold: true })], shading: { fill: 'EAEAEA' } }),
        new TableCell({ children: [pText('Detalle Técnico Documentado', { bold: true })], shading: { fill: 'EAEAEA' } }),
      ],
    }),
    ...[
      ['Captura UI', '01-portada-hero-navbar.png', 'Hero Wall & Navbar', 'Cabecera fija, conmutador de sede, video 4K dron Río Piura y CTA'],
      ['Captura UI', '01b-portada-hero-trujillo.png', 'Hero Wall Trujillo', 'Adaptación multi-sede dinámica a frente de obra en La Libertad'],
      ['Captura UI', '02-highlights.png', 'Highlights', 'Tarjetas neumórficas de topografía, flota pesada y cumplimiento'],
      ['Captura UI', '03-manifiesto.png', 'Manifiesto H1', 'Titular principal SEO, foto de obra en campo y cotización'],
      ['Captura UI', '04-nosotros.png', 'Sobre la Empresa', 'Capacidad operativa, talleres propios y bases Piura / Trujillo'],
      ['Captura UI', '06-servicios.png', 'Servicios Responsive', 'Rejilla simétrica de 3 columnas sin soldadura, adaptable a todo dispositivo'],
      ['Captura UI', '07-mision-vision.png', 'Misión y Visión', 'Control segmentado interactivo y pilares estratégicos de calidad'],
      ['Captura UI', '08-proyectos-lomas.png', 'Proyectos', 'Caso insignia "Vuelo de Las Lomas" con video aéreo interactivo'],
      ['Captura UI', '10-galeria.png', 'Galería General', '17 fotos reales de alta resolución y visor con zoom 2D hasta 400%'],
      ['Captura UI', '10b-galeria-maquinaria.png', 'Galería Maquinaria', 'Motoniveladora al atardecer, rodillo Bomag y excavadoras CAT'],
      ['Captura UI', '10c-galeria-topografia.png', 'Galería Topografía', 'Estación Leica PinPoint y georreferenciación GNSS sobre hito IGN'],
      ['Captura UI', '10d-galeria-ssoma.png', 'Galería SSOMA', 'Charla de seguridad de 5 minutos con toda la cuadrilla en EPP completo'],
      ['Captura UI', '11-contacto.png', 'Contacto Google Sheets', 'Formulario directo a Google Sheets en tiempo real y mensaje hoy mismo'],
      ['Captura UI', '12-footer.png', 'Pie de Página', 'Cálculo dinámico de año fiscal con JavaScript y enlaces formales'],
      ['Captura UI', '13-modo-oscuro-hero.png', 'Modo Oscuro Hero', 'Paleta grafito mate con contraste dorado para navegación nocturna'],
    ].map(
      ([tipo, archivo, seccion, desc]) =>
        new TableRow({
          children: [
            new TableCell({ children: [pText(tipo, { bold: true })] }),
            new TableCell({ children: [pText(archivo)] }),
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
          text: 'Documento técnico formal emitido con capturas de pantalla auténticas para la gerencia y equipo de ingeniería de GRENCO (Grupo Enriquez Construcciones S.A.C.).',
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
