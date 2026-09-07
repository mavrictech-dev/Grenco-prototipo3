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
const VIDEO_ORIGEN = join(DIR_ORIGEN, 'f1.mp4');
const SALIDA = 'public/video';

mkdirSync(SALIDA, { recursive: true });

// 1920 / 3 = 640px de ancho por columna
// En pantalla se muestran a aprox 430px - 520px de ancho
// Dejamos 640x1080 recortado directamente para maxima nitidez sin distorsion
const PANELES_TRUJILLO = [
  { id: 'trujillo-1', x: 0, tag: 'Frente La Libertad', lugar: 'Trujillo', alt: 'Obra en Trujillo panel izquierdo' },
  { id: 'trujillo-2', x: 640, tag: 'Movimiento de tierras', lugar: 'Trujillo', alt: 'Obra en Trujillo panel central' },
  { id: 'trujillo-3', x: 1280, tag: 'Flota y cuadrilla', lugar: 'Trujillo', alt: 'Obra en Trujillo panel derecho' },
];

const mb = (f) => (statSync(f).size / 1024 / 1024).toFixed(2) + ' MB';

console.log('Codificando paneles de Trujillo desde f1.mp4...');

for (const panel of PANELES_TRUJILLO) {
  const mp4 = `${SALIDA}/${panel.id}.mp4`;
  const poster = `${SALIDA}/${panel.id}.webp`;
  
  // Recorte de 640x1080 en la posicion x correspondiente
  const vf = `crop=640:1080:${panel.x}:0,scale=540:910,fps=30`;

  console.log(`\nGenerando ${panel.id} (crop x=${panel.x})...`);
  
  execFileSync(FFMPEG, [
    '-v', 'error',
    '-y',
    '-i', VIDEO_ORIGEN,
    '-vf', vf,
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-preset', 'slow',
    '-crf', '26',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4
  ]);

  console.log(`  MP4 listo: ${mp4} (${mb(mp4)})`);

  // Extraer poster al segundo 0.5
  const png = execFileSync(FFMPEG, [
    '-v', 'error',
    '-ss', '0.5',
    '-i', VIDEO_ORIGEN,
    '-frames:v', '1',
    '-vf', `crop=640:1080:${panel.x}:0,scale=540:910`,
    '-f', 'image2pipe',
    '-c:v', 'png',
    '-'
  ], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] });

  await sharp(png).webp({ quality: 75, effort: 6 }).toFile(poster);
  console.log(`  Poster listo: ${poster} (${mb(poster)})`);
}

console.log('\nCodificacion de Trujillo completada con exito.');
