/**
 * Prepara los tres videos del triptico del hero. Se corre a mano: `npm run video`.
 *
 * El material de origen son clips de iPhone en 4K60 VERTICALES (3840x2160 con
 * rotacion -90, o sea 2160x3840 en pantalla). En vez de recortarlos a un 16:9
 * —que tiraba el 70% del encuadre— se dejan verticales y se ponen tres en fila:
 * cada panel es alto y estrecho, que es justo la forma nativa del material.
 *
 * Salidas en public/video/. No pasan por el grafo de Vite a proposito: son
 * archivos grandes que cambian muy de vez en cuando, y Vercel los cachea por
 * ruta (ver vercel.json).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DIR = 'C:/Users/maxmo/Downloads/grenco/videos para landing';
const SALIDA = 'public/video';

/**
 * Los tres paneles. Los `desde` estan escalonados y las duraciones son
 * distintas a proposito: si los tres bucles midieran lo mismo se sincronizarian
 * y el triptico latiria como un solo bloque.
 */
const PANELES = [
  { id: 'obra-1', src: 'IMG_1732.MOV', desde: 1.0, dur: 7.5, alt: 'Excavadora cargando volquete' },
  { id: 'obra-2', src: 'IMG_1922.MOV', desde: 6.0, dur: 8.5, alt: 'Excavadora CAT en frente de trabajo' },
  { id: 'obra-3', src: 'IMG_1719.MOV', desde: 2.5, dur: 6.5, alt: 'Cuadrilla y volquete en obra' },
];

const ANCHO = 520; // en pantalla cada panel ronda los 430px, y va bajo overlay
const CRF = 32; // vive detras de un degradado opaco: no necesita mas
const FPS = 30; // el origen es 60: para un fondo bajo overlay no aporta nada

/**
 * Solo se genera MP4/H.264, sin WebM.
 *
 * Se probo VP9 y salia MAS pesado que H.264 en este material (3.5 MB contra
 * 1.2 MB en el clip del polvo): una nube de polvo es ruido de altisima
 * entropia y VP9 no la comprime bien. Como el navegador se queda con la
 * primera fuente que soporta, ofrecer WebM les habria servido el archivo mas
 * grande. H.264 lo reproduce todo el mundo y aqui ademas pesa menos.
 */

/** winget no siempre deja ffmpeg en el PATH de shells nuevos. */
function buscarFfmpeg(nombre = 'ffmpeg') {
  try {
    execFileSync(nombre, ['-version'], { stdio: 'ignore' });
    return nombre;
  } catch {
    /* seguimos buscando */
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
  throw new Error(`No se encontro ${nombre}. Instalalo con:  winget install Gyan.FFmpeg`);
}

const FFMPEG = buscarFfmpeg();
const mb = (f) => (statSync(f).size / 1024 / 1024).toFixed(2) + ' MB';
const corre = (args) => execFileSync(FFMPEG, args, { stdio: ['ignore', 'ignore', 'pipe'] });

mkdirSync(SALIDA, { recursive: true });
// Restos de la version panoramica anterior
for (const viejo of ['hero.mp4', 'hero.webm', 'hero-poster.jpg', 'obra-1.webm', 'obra-2.webm', 'obra-3.webm']) {
  const p = join(SALIDA, viejo);
  if (existsSync(p)) rmSync(p);
}

let total = 0;
const VF = `scale=${ANCHO}:-2,fps=${FPS}`;

for (const panel of PANELES) {
  const origen = join(DIR, panel.src);
  if (!existsSync(origen)) throw new Error(`No existe el clip: ${origen}`);

  console.log(`\n${panel.id}  <-  ${panel.src}  (${panel.desde}s +${panel.dur}s)`);
  const comun = ['-v', 'error', '-y', '-ss', String(panel.desde), '-t', String(panel.dur), '-i', origen, '-vf', VF, '-an'];

  // MP4 / H.264: el que reproduce todo el mundo.
  const mp4 = `${SALIDA}/${panel.id}.mp4`;
  corre([
    ...comun,
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', String(CRF),
    '-pix_fmt', 'yuv420p',     // sin esto Safari no lo reproduce
    '-movflags', '+faststart', // el indice al principio: empieza antes
    mp4,
  ]);
  console.log(`  mp4    ${mb(mp4)}`);
  total += statSync(mp4).size;

  // Poster: se pinta mientras el video carga y es lo unico que ven quienes
  // pidieron menos movimiento. Ademas el del primer panel es el LCP.
  //
  // Sale en WebP como el resto de imagenes del proyecto. Va por un pipe a
  // sharp en vez de dejar que ffmpeg lo codifique: su libwebp comprime bastante
  // peor que sharp a la misma calidad percibida.
  const poster = `${SALIDA}/${panel.id}.webp`;
  const png = execFileSync(
    FFMPEG,
    [
      '-v', 'error',
      '-ss', String(panel.desde + 0.3), '-i', origen,
      '-frames:v', '1', '-vf', `scale=${ANCHO}:-2`,
      '-f', 'image2pipe', '-c:v', 'png', '-',
    ],
    { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  await sharp(png).webp({ quality: 62, effort: 6 }).toFile(poster);
  console.log(`  poster ${mb(poster)}`);
}

console.log(`\nTotal MP4 (lo que baja un navegador): ${(total / 1024 / 1024).toFixed(2)} MB`);
console.log('Se referencian desde src/data/site.js -> hero.paneles');
