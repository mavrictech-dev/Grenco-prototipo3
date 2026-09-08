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
const DIR_ORIGEN = 'C:/Users/maxmo/Downloads/grenco/videos para landing';
const SALIDA = 'public/video';

mkdirSync(SALIDA, { recursive: true });

const PANELES_PIURA = [
  {
    id: 'piura-1',
    origen: join(DIR_ORIGEN, 'PIURA PLAZA DE ARMAS HDR.mp4'),
    ss: '16',
    t: '25',
    vf: 'crop=1215:2160:(in_w-out_w)/2:0,scale=540:960,fps=30',
    tag: 'Plaza de Armas',
    lugar: 'Piura',
    alt: 'Vista aérea de la Plaza de Armas y Catedral de Piura'
  },
  {
    id: 'piura-2',
    origen: join(DIR_ORIGEN, 'rio Piura.MP4'),
    ss: '25',
    t: '25',
    vf: 'crop=1215:2160:1450:0,scale=540:960,fps=30',
    tag: 'Río Piura',
    lugar: 'Bajo Piura',
    alt: 'Vista aérea del cauce y ribera del Río Piura'
  },
  {
    id: 'piura-3',
    origen: join(DIR_ORIGEN, 'LAS LOMAS-piura.MP4'),
    ss: '0',
    t: '24.5',
    vf: 'scale=540:960,fps=30',
    tag: 'Frente de obra',
    lugar: 'Las Lomas',
    alt: 'Cuadrilla y levantamiento en obra vial Las Lomas, Piura'
  }
];

const mb = (f) => (statSync(f).size / 1024 / 1024).toFixed(2) + ' MB';

console.log('Codificando los 3 paneles del Hero de Piura...');

for (const p of PANELES_PIURA) {
  const mp4 = `${SALIDA}/${p.id}.mp4`;
  const poster = `${SALIDA}/${p.id}.webp`;

  console.log(`\n=== Procesando ${p.id} desde ${p.origen} (duracion ${p.t}s)...`);

  execFileSync(FFMPEG, [
    '-v', 'error',
    '-y',
    '-ss', p.ss,
    '-t', p.t,
    '-i', p.origen,
    '-vf', p.vf,
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.0',
    '-crf', '26',
    '-preset', 'medium',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4
  ]);

  console.log(`Video listo: ${mp4} (${mb(mp4)})`);

  // Extraer poster del segundo 1
  const rawJpg = execFileSync(FFMPEG, [
    '-v', 'error',
    '-ss', '1',
    '-i', mp4,
    '-vframes', '1',
    '-f', 'image2',
    '-c:v', 'mjpeg',
    '-'
  ]);

  await sharp(rawJpg)
    .webp({ quality: 85, effort: 5 })
    .toFile(poster);

  console.log(`Poster listo: ${poster} (${mb(poster)})`);
}

console.log('\n¡Todos los videos de Piura codificados con exito!');
