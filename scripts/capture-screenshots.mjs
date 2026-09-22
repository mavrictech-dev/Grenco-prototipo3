import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'capturas');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function captureAll() {
  console.log('Iniciando servidor Vite para captura...');
  const server = await createServer({
    server: { port: 5199 },
    logLevel: 'error',
  });
  await server.listen();
  const baseUrl = 'http://localhost:5199';
  console.log('Servidor activo en:', baseUrl);

  console.log('Lanzando Chrome headless con Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900',
    ],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2, // Retina 2x para máxima nitidez en el informe Word
    },
  });

  const page = await browser.newPage();

  // Desactivar animaciones largas o asegurar que todo se muestre
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });
  await page.evaluate(async () => {
    // Esperar a que las fuentes web terminen de renderizarse
    await document.fonts.ready;
    // Revelar todos los elementos con opacidad completa para screenshots
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .reveal {
        opacity: 1 !important;
        transform: none !important;
      }
      .mock-dash__bar-fill, .mock-tel__fill {
        transition: none !important;
      }
      .stickycta, .arriba, .wa, .progreso {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  });

  await new Promise((r) => setTimeout(r, 600));

  const sectionsToCapture = [
    {
      id: '01-portada-hero-navbar',
      selector: '#inicio',
      caption: 'Cabecera Principal (Navbar con Selector de Sede) y Portada Hero Wall (Sede Piura)',
      clipTop: true,
    },
    {
      id: '02-highlights',
      selector: '#highlights',
      caption: 'Diferenciales Técnicos y Sellos de Formalidad Operativa (Highlights)',
    },
    {
      id: '03-manifiesto',
      selector: '#manifiesto',
      caption: 'Manifiesto Institucional: "Movemos tierra. Levantamos el norte"',
    },
    {
      id: '04-nosotros',
      selector: '#nosotros',
      caption: 'Capacidad Operativa e Infraestructura de GRENCO (Sobre la Empresa)',
    },
    {
      id: '05-tracking-portal',
      selector: '#tracking',
      caption: 'Portal y App GRENCO Tracking con Insignia Grabada y Ficha Técnica',
    },
    {
      id: '06-servicios',
      selector: '#servicios',
      caption: 'Tarjetas de Servicios Especializados con Soporte de Video de Dron',
    },
    {
      id: '07-mision-vision',
      selector: '#mision-vision',
      caption: 'Misión, Visión y Pilares Estratégicos Institucionales',
    },
    {
      id: '08-proyectos-lomas',
      selector: '#proyectos',
      caption: 'Proyectos Emblemáticos: Caso Destacado "Vuelo de Las Lomas" (Topografía con Dron)',
    },
    {
      id: '09-bitacora',
      selector: '#bitacora',
      caption: 'Bitácora de Obra: Registro Cronológico y Técnico de Frentes en Campo',
    },
    {
      id: '10-galeria',
      selector: '#galeria',
      caption: 'Galería Multimedia Interactiva con Filtros por Especialidad',
    },
    {
      id: '11-contacto',
      selector: '#contacto',
      caption: 'Módulo de Contacto Directo y Formulario de Cotización de Obra',
    },
    {
      id: '12-footer',
      selector: 'footer',
      caption: 'Pie de Página Institucional con Año Dinámico y Enlaces Rápidos',
    },
  ];

  console.log('Capturando secciones en Modo Claro...');
  for (const item of sectionsToCapture) {
    const el = await page.$(item.selector);
    if (!el) {
      console.warn(`Elemento no encontrado: ${item.selector}`);
      continue;
    }

    // Scroll suave al elemento para que cargue contenido y lazy images
    await page.evaluate((sel) => {
      const target = document.querySelector(sel);
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, item.selector);

    await new Promise((r) => setTimeout(r, 450));

    const outPath = path.join(OUT_DIR, `${item.id}.png`);
    if (item.clipTop) {
      // Para el hero, capturamos el viewport superior con la navbar
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1440, height: 860 } });
    } else {
      await el.screenshot({ path: outPath });
    }
    console.log(`✓ Capturado: ${item.id}.png`);

    if (item.id === '01-portada-hero-navbar') {
      // Capturar también la Sede Trujillo para evidenciar el multi-sede
      console.log('Cambiando a Sede Trujillo para captura...');
      await page.evaluate(() => {
        // Encontrar botón o selector de sede
        const btns = Array.from(document.querySelectorAll('button'));
        const trujilloBtn = btns.find((b) => b.textContent.includes('Trujillo'));
        if (trujilloBtn) trujilloBtn.click();
      });
      await new Promise((r) => setTimeout(r, 400));
      const trujilloPath = path.join(OUT_DIR, '01b-portada-hero-trujillo.png');
      await page.screenshot({ path: trujilloPath, clip: { x: 0, y: 0, width: 1440, height: 860 } });
      console.log('✓ Capturado: 01b-portada-hero-trujillo.png');

      // Regresar a Piura
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const piuraBtn = btns.find((b) => b.textContent.includes('Piura'));
        if (piuraBtn) piuraBtn.click();
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    if (item.id === '10-galeria') {
      // Capturar filtros específicos de la nueva galería
      const filtrosExtra = [
        { nombre: 'Maquinaria', archivo: '10b-galeria-maquinaria.png' },
        { nombre: 'Topografía', archivo: '10c-galeria-topografia.png' },
        { nombre: 'SSOMA', archivo: '10d-galeria-ssoma.png' },
      ];

      for (const f of filtrosExtra) {
        console.log(`Filtrando galería por "${f.nombre}" para captura...`);
        await page.evaluate((filtroName) => {
          const btns = Array.from(document.querySelectorAll('.gallery__filters button'));
          const btn = btns.find((b) => b.textContent.trim() === filtroName);
          if (btn) btn.click();
        }, f.nombre);
        await new Promise((r) => setTimeout(r, 450));
        const galEl = await page.$('#galeria');
        if (galEl) {
          const filterPath = path.join(OUT_DIR, f.archivo);
          await galEl.screenshot({ path: filterPath });
          console.log(`✓ Capturado: ${f.archivo}`);
        }
      }

      // Regresar filtro a "Todas"
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('.gallery__filters button'));
        const btn = btns.find((b) => b.textContent.trim() === 'Todas');
        if (btn) btn.click();
      });
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Captura especial: Modo Oscuro
  console.log('Activando Modo Oscuro para captura de tema nocturno...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    // Cambiar data-theme en html
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await new Promise((r) => setTimeout(r, 600));

  const darkHeroPath = path.join(OUT_DIR, '13-modo-oscuro-hero.png');
  await page.screenshot({ path: darkHeroPath, clip: { x: 0, y: 0, width: 1440, height: 860 } });
  console.log('✓ Capturado: 13-modo-oscuro-hero.png');

  // Captura de tracking o servicios en modo oscuro
  const darkTrackingEl = await page.$('#tracking');
  if (darkTrackingEl) {
    await page.evaluate(() => {
      document.querySelector('#tracking')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 400));
    const darkTrackPath = path.join(OUT_DIR, '14-modo-oscuro-tracking.png');
    await darkTrackingEl.screenshot({ path: darkTrackPath });
    console.log('✓ Capturado: 14-modo-oscuro-tracking.png');
  }

  await browser.close();
  await server.close();
  console.log('¡Todas las capturas de pantalla de la landing page se han generado exitosamente!');
}

captureAll().catch((err) => {
  console.error('Error en captura:', err);
  process.exit(1);
});
