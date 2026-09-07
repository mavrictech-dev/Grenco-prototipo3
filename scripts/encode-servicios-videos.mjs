import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, readdirSync } from 'node:fs';
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
const DIR_VIDEOS = 'C:/Users/maxmo/Downloads/grenco/videos para landing';
const SALIDA = 'public/video/servicios';
mkdirSync(SALIDA, { recursive: true });

const SERVICIOS_VIDEOS = [
  {
    id: 'servicio-movimiento',
    archivo: 'IMG_1732.MOV',
    desde: 1.0,
    dur: 10.5,
    descripcion: 'Movimiento de tierras (Excavadora cargando volquete completo)'
  },
  {
    id: 'servicio-obras-civiles',
    archivo: 'IMG_7761.MOV',
    desde: 2.0,
    dur: 13.0,
    descripcion: 'Obras civiles (Conformación y avance de vía)'
  },
  {
    id: 'servicio-maquinaria',
    archivo: 'IMG_1922.MOV',
    desde: 3.0,
    dur: 14.0,
    descripcion: 'Alquiler de maquinaria (Excavadora CAT 20T en frente)'
  },
  {
    id: 'servicio-saneamiento',
    archivo: 'Soldadura y trabajos en fierro para entuvados.MOV',
    desde: 1.0,
    dur: 14.0,
    descripcion: 'Saneamiento y redes (Soldadura y entubado continuo)'
  },
  {
    id: 'servicio-habilitacion',
    archivo: 'LAS LOMAS-piura.MP4',
    desde: 1.0,
    dur: 17.0,
    descripcion: 'Habilitación urbana (Despegue y vista panorámica aérea de Las Lomas)'
  },
  {
    id: 'servicio-demolicion',
    archivo: 'IMG_1736.MOV',
    desde: 1.5,
    dur: 13.0,
    descripcion: 'Demolición y desbroce (Limpieza y retiro con excavadora)'
  }
];

const kb = (f) => (statSync(f).size / 1024).toFixed(0) + ' KB';

console.log('Generando micro-videos de servicios en alta eficiencia...');

for (const s of SERVICIOS_VIDEOS) {
  const origen = join(DIR_VIDEOS, s.archivo);
  if (!existsSync(origen)) {
    console.warn(`No existe: ${origen}`);
    continue;
  }

  const mp4 = `${SALIDA}/${s.id}.mp4`;
  const poster = `${SALIDA}/${s.id}.webp`;

  console.log(`\nProcesando ${s.id} (${s.descripcion})...`);

  // Escala a 480px de ancho preservando proporción, 30fps, sin audio, H264 high
  execFileSync(FFMPEG, [
    '-v', 'error',
    '-y',
    '-ss', String(s.desde),
    '-t', String(s.dur),
    '-i', origen,
    '-vf', 'scale=520:-2,fps=30',
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-preset', 'slow',
    '-crf', '28',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4
  ]);

  console.log(`  MP4 listo: ${mp4} (${kb(mp4)})`);

  // Poster WebP
  const png = execFileSync(FFMPEG, [
    '-v', 'error',
    '-ss', String(s.desde + 0.3),
    '-i', origen,
    '-frames:v', '1',
    '-vf', 'scale=520:-2',
    '-f', 'image2pipe',
    '-c:v', 'png',
    '-'
  ], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] });

  await sharp(png).webp({ quality: 72, effort: 6 }).toFile(poster);
  console.log(`  Poster listo: ${poster} (${kb(poster)})`);
}

console.log('\nTodos los micro-videos de servicios fueron generados con éxito.');
