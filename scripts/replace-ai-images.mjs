import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

function buscarFfmpeg(nombre = 'ffmpeg') {
  try {
    execFileSync(nombre, ['-version'], { stdio: 'ignore' });
    return nombre;
  } catch {}
  const base = join(
    process.env.LOCALAPPDATA ?? '',
    'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe'
  );
  if (existsSync(base)) {
    for (const dir of readdirSync(base)) {
      const p = join(base, dir, 'bin', `${nombre}.exe`);
      if (existsSync(p)) return p;
    }
  }
  throw new Error(`No se encontro ${nombre}`);
}

const FFMPEG = buscarFfmpeg('ffmpeg');
const DIR_REAL = 'C:/Users/maxmo/Downloads/grenco/imagenes para landing';
const DEST_IMG = 'src/assets/images';
const DEST_ORIG = 'assets/images';

mkdirSync(DEST_IMG, { recursive: true });
mkdirSync(DEST_ORIG, { recursive: true });

function decodificar(ruta) {
  if (/\.heic$/i.test(ruta)) {
    return execFileSync(
      FFMPEG,
      ['-v', 'error', '-i', ruta, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'],
      { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] }
    );
  }
  return ruta;
}

// Mapeo de imagenes reales a sustituir por las de IA
const REEMPLAZOS = [
  // Equipo y personal (Cultura)
  {
    salida: 'eq-topografia.webp',
    origen: 'Personal en trabajo topografía LAS LOMAS3.jpeg',
    ancho: 800,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'eq-operador.webp',
    origen: 'Máquinas2.HEIC',
    ancho: 800,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'eq-ssoma.webp',
    origen: 'Personal en trabajo topografía LAS LOMAS.HEIC',
    ancho: 800,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'eq-residencia.webp',
    origen: 'Personal en trabajo topografía LAS LOMAS2.HEIC',
    ancho: 800,
    calidad: 74,
    fit: 'cover'
  },

  // Maquinaria real
  {
    salida: 'maq-excavadora.webp',
    origen: 'Máquinas.HEIC',
    ancho: 1000,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'maq-cargador.webp',
    origen: 'Máquinas3.HEIC',
    ancho: 1000,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'maq-retroexcavadora.webp',
    origen: 'Máquinas4.HEIC',
    ancho: 1000,
    calidad: 74,
    fit: 'cover'
  },

  // Proyectos reales
  {
    salida: 'pro-ejidos.webp',
    origen: 'IMG_0082.HEIC',
    ancho: 1200,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'pro-planta-agro.webp',
    origen: 'IMG_4827.HEIC',
    ancho: 1200,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'pro-via-drenaje.webp',
    origen: 'IMG_7678.HEIC',
    ancho: 1200,
    calidad: 74,
    fit: 'cover'
  },

  // Galeria de tomas reales
  {
    salida: 'gal-1.webp',
    origen: 'IMG_1718.HEIC',
    ancho: 900,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'gal-2.webp',
    origen: 'IMG_1728.HEIC',
    ancho: 1100,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'gal-3.webp',
    origen: 'IMG_0190.HEIC',
    ancho: 900,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'gal-4.webp',
    origen: 'IMG_1096.HEIC',
    ancho: 1100,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'gal-5.webp',
    origen: 'IMG_2715.HEIC',
    ancho: 1100,
    calidad: 74,
    fit: 'cover'
  },
  {
    salida: 'gal-6.webp',
    origen: 'IMG_3178.HEIC',
    ancho: 1100,
    calidad: 74,
    fit: 'cover'
  }
];

const kb = (n) => (n / 1024).toFixed(0) + ' KB';

console.log('Reemplazando imagenes de IA por fotos reales de obra...');

for (const item of REEMPLAZOS) {
  const rutaOrigen = join(DIR_REAL, item.origen);
  if (!existsSync(rutaOrigen)) {
    console.warn(`[AVISO] No se encontro archivo origen: ${rutaOrigen}`);
    continue;
  }

  const destFinal = join(DEST_IMG, item.salida);
  const destCopia = join(DEST_ORIG, item.salida);

  try {
    const input = decodificar(rutaOrigen);
    const pipeline = sharp(input)
      .resize({ width: item.ancho, withoutEnlargement: true })
      .webp({ quality: item.calidad, effort: 6, smartSubsample: true });

    const info = await pipeline.toFile(destFinal);
    // guardar copia en assets/images tambien
    await sharp(destFinal).toFile(destCopia);

    console.log(`  OK: ${item.salida.padEnd(24)} <- ${item.origen} (${info.width}x${info.height}, ${kb(info.size)})`);
  } catch (err) {
    console.error(`  ERROR en ${item.salida}:`, err.message);
  }
}

console.log('\nSustitucion de imagenes de IA completada con exito.');
