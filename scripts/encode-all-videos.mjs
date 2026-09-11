/**
 * Codifica todos los videos según los criterios de rendimiento de la reunión:
 * - Clips de 13 a 15 segundos exactos
 * - Formato horizontal unificado para Piura y Trujillo (adiós a los 3 videos simultáneos)
 * - Nuevo clip para GreNCO Soldadura
 * - Alta compresión H.264 y posters WebP instantáneos
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DIR_VIDEOS = 'C:/Users/maxmo/Downloads/grenco/videos para landing';
const SALIDA_HERO = 'public/video';
const SALIDA_SERV = 'public/video/servicios';

mkdirSync(SALIDA_HERO, { recursive: true });
mkdirSync(SALIDA_SERV, { recursive: true });

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
const mb = (f) => (statSync(f).size / 1024 / 1024).toFixed(2) + ' MB';

async function codificar(
  origen,
  salidaMp4,
  salidaWebp,
  { desde, dur, ancho = 1280, crf = 26, vf, posterOffset = 0.3 }
) {
  console.log(`\n▶ Codificando ${salidaMp4} (${dur}s desde ${desde}s)...`);

  const videoFilter = vf || `scale=${ancho}:-2,fps=30`;
  const posterFilter = vf ? vf.replace(',fps=30', '') : `scale=${ancho}:-2`;

  // MP4 H.264 optimizado
  execFileSync(FFMPEG, [
    '-v', 'error',
    '-y',
    '-ss', String(desde),
    '-i', origen,
    '-t', String(dur),
    '-vf', videoFilter,
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.0',
    '-preset', 'slow',
    '-crf', String(crf),
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    salidaMp4,
  ]);
  console.log(`   ✓ Video MP4: ${mb(salidaMp4)}`);

  // Poster WebP con Sharp
  const png = execFileSync(
    FFMPEG,
    [
      '-v', 'error',
      '-y',
      '-ss', String(desde + posterOffset),
      '-i', origen,
      '-frames:v', '1',
      '-vf', posterFilter,
      '-f', 'image2pipe',
      '-c:v', 'png',
      '-',
    ],
    { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  await sharp(png).webp({ quality: 80, effort: 6 }).toFile(salidaWebp);
  console.log(`   ✓ Poster WebP: ${mb(salidaWebp)}`);
}

async function main() {
  console.log('=== CODIFICACIÓN DE VIDEOS OPTIMIZADOS (H.264 WEB) ===');

  // 1. Sede Trujillo (1 solo video panorámico horizontal)
  const origenTrujillo = join(DIR_VIDEOS, 'f1.mp4');
  if (existsSync(origenTrujillo)) {
    await codificar(
      origenTrujillo,
      join(SALIDA_HERO, 'trujillo.mp4'),
      join(SALIDA_HERO, 'trujillo.webp'),
      { desde: 0.0, dur: 13.9, ancho: 1280, crf: 26 }
    );
  }

  // 2. Sede Piura (3 clips de 14s estrictos)
  const origenPiura = join(DIR_VIDEOS, 'rio piura 2.MP4');
  if (existsSync(origenPiura)) {
    // Parte 1: Compactación y cuadrilla
    await codificar(
      origenPiura,
      join(SALIDA_HERO, 'piura-1.mp4'),
      join(SALIDA_HERO, 'piura-1.webp'),
      { desde: 10.0, dur: 14.0, ancho: 1280, crf: 26 }
    );

    // Parte 2: Puente y defensas
    await codificar(
      origenPiura,
      join(SALIDA_HERO, 'piura-2.mp4'),
      join(SALIDA_HERO, 'piura-2.webp'),
      { desde: 32.0, dur: 14.0, ancho: 1280, crf: 26 }
    );

    // Parte 3: Motoniveladora y frente de avance
    await codificar(
      origenPiura,
      join(SALIDA_HERO, 'piura-3.mp4'),
      join(SALIDA_HERO, 'piura-3.webp'),
      { desde: 114.0, dur: 14.0, ancho: 1280, crf: 26 }
    );
  }

  // 3. Grenco Soldadura (Servicios: IMG_3129.MOV, 14.0s de soldadura activa con arco y chispas)
  const origenSoldadura = join(DIR_VIDEOS, 'IMG_3129.MOV');
  if (existsSync(origenSoldadura)) {
    await codificar(
      origenSoldadura,
      join(SALIDA_SERV, 'servicio-soldadura.mp4'),
      join(SALIDA_SERV, 'servicio-soldadura.webp'),
      {
        desde: 4.5,
        dur: 14.0,
        crf: 26,
        vf: 'crop=2160:1350:0:900,scale=640:400,fps=30',
        posterOffset: 7.5, // Toma en t=12.0s donde el arco y las chispas brillan en su punto álgido
      }
    );
  }

  console.log('\n========================================');
  console.log('¡Todos los videos han sido optimizados con éxito!');
}

main().catch(console.error);
