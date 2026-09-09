/**
 * Codifica los 4 clips de 8 segundos del video "rio piura 2.MP4" para el banner de Piura.
 * Genera archivos ligeros en public/video/ (MP4 H.264 web-optimizado + WebP poster).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ORIGEN = 'C:/Users/maxmo/Downloads/grenco/videos para landing/rio piura 2.MP4';
const SALIDA = 'public/video';

const PANELES = [
  {
    id: 'piura-1',
    desde: 10.0,
    dur: 8.0,
    tag: 'Compactación de acceso',
    lugar: 'Río Piura',
    alt: 'Rodillo compactador y cuadrilla en conformación de terraplén, Río Piura',
  },
  {
    id: 'piura-2',
    desde: 26.0,
    dur: 8.0,
    tag: 'Puente y defensas',
    lugar: 'Río Piura',
    alt: 'Vista aérea de infraestructura vial y puente sobre el Río Piura',
  },
  {
    id: 'piura-3',
    desde: 40.0,
    dur: 8.0,
    tag: 'Corte masivo',
    lugar: 'Río Piura',
    alt: 'Excavación profunda y corte de talud en obra de infraestructura, Piura',
  },
  {
    id: 'piura-4',
    desde: 118.0,
    dur: 8.0,
    tag: 'Frente de nivelación',
    lugar: 'Río Piura',
    alt: 'Motoniveladora CAT nivelando terraplén de acceso en el Río Piura',
  },
];

function buscarFfmpeg(nombre = 'ffmpeg') {
  try {
    execFileSync(nombre, ['-version'], { stdio: 'ignore' });
    return nombre;
  } catch {
    // Buscar en ruta conocida de winget
  }
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
  throw new Error(`No se encontro ${nombre}.`);
}

const FFMPEG = buscarFfmpeg('ffmpeg');
const mb = (f) => (statSync(f).size / 1024 / 1024).toFixed(2) + ' MB';
const corre = (args) => execFileSync(FFMPEG, args, { stdio: ['ignore', 'ignore', 'pipe'] });

mkdirSync(SALIDA, { recursive: true });

if (!existsSync(ORIGEN)) {
  throw new Error(`No se encontró el video de origen en: ${ORIGEN}`);
}

console.log(`Procesando 4 segmentos de 8 segundos desde:\n${ORIGEN}\n`);

const ANCHO = 1280; // 720p nítido en escritorio y móvil
const FPS = 30;
const CRF = 26; // Balance ideal entre peso ultraligero y nitidez visual sin artefactos
const VF = `scale=${ANCHO}:-2,fps=${FPS}`;

let total = 0;

for (const panel of PANELES) {
  console.log(`\n▶ [${panel.id}] ${panel.tag} (${panel.desde}s -> ${panel.desde + panel.dur}s, 8.0s)`);
  
  const mp4 = join(SALIDA, `${panel.id}.mp4`);
  const poster = join(SALIDA, `${panel.id}.webp`);

  // 1. MP4 H.264 ultra-optimizado
  corre([
    '-v', 'error',
    '-y',
    '-ss', String(panel.desde),
    '-i', ORIGEN,
    '-t', String(panel.dur),
    '-vf', VF,
    '-an', // Sin audio para reducir peso y consumo de CPU
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.0',
    '-preset', 'slow',
    '-crf', String(CRF),
    '-pix_fmt', 'yuv420p', // Compatibilidad universal (iOS Safari, Android, Chromium)
    '-movflags', '+faststart', // Empieza de inmediato sin esperar la descarga completa
    mp4,
  ]);
  const pesoMp4 = statSync(mp4).size;
  total += pesoMp4;
  console.log(`   ✓ Video MP4: ${mb(mp4)}`);

  // 2. Poster WebP optimizado con Sharp
  const png = execFileSync(
    FFMPEG,
    [
      '-v', 'error',
      '-y',
      '-ss', String(panel.desde + 0.3),
      '-i', ORIGEN,
      '-frames:v', '1',
      '-vf', `scale=${ANCHO}:-2`,
      '-f', 'image2pipe',
      '-c:v', 'png',
      '-',
    ],
    { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  await sharp(png).webp({ quality: 78, effort: 6 }).toFile(poster);
  console.log(`   ✓ Poster WebP: ${mb(poster)}`);
}

console.log(`\n========================================`);
console.log(`Total MP4 de los 4 segmentos: ${(total / 1024 / 1024).toFixed(2)} MB`);
console.log(`¡Generación completada con éxito en ${SALIDA}!`);
