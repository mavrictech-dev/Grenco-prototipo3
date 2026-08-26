/**
 * Convierte el banco de fotos de obra (HEIC de iPhone) a WebP.
 * Se corre a mano: `npm run fotos`.
 *
 * sharp trae libheif, pero rechaza estos archivos: los HEIC del iPhone traen
 * mapas HDR y llegan a 42 referencias en la caja `iref`, y el limite de
 * seguridad de libheif esta en 16. Asi que decodifica ffmpeg —que si los lee—
 * y sharp solo se encarga de comprimir.
 *
 * El PNG intermedio viaja por un pipe, nunca toca el disco: cada uno pesa unos
 * 20 MB en crudo y son 30 y pico de archivos.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const ORIGEN = 'C:/Users/maxmo/Downloads/grenco/imagenes para landing';
const SALIDA = 'src/assets/obra';

// Las tarjetas de la bitacora rondan los 310-420px de ancho, asi que 1000px
// cubre pantallas 2x con margen. Subir de ahi solo engorda el despliegue: son
// escenas de tierra y grava, texturas muy caras de comprimir.
const ANCHO = 1000;
const CALIDAD = 66;

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
mkdirSync(SALIDA, { recursive: true });

/**
 * Decodifica un HEIC a PNG en memoria.
 *
 * Sale a tamano completo (unos 20 MB por foto) y reescala sharp despues. Es a
 * proposito: estos HEIC llevan un mapa de ganancia HDR, asi que ffmpeg monta
 * un filtergraph complejo implicito para combinarlo con la imagen base, y
 * encima de eso un `-vf` simple falla con "Simple and complex filtering cannot
 * be used together for the same stream". Como van de uno en uno, el pico de
 * memoria no es problema.
 */
function decodificarHeic(ruta) {
  return execFileSync(
    FFMPEG,
    ['-v', 'error', '-i', ruta, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'],
    { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] }
  );
}

const archivos = readdirSync(ORIGEN)
  .filter((f) => /\.(heic|jpe?g|png)$/i.test(f))
  .sort();

let entrada = 0;
let salida = 0;
const generados = [];
const fallidos = [];

console.log(`Convirtiendo ${archivos.length} fotos a WebP (${ANCHO}px, q${CALIDAD})\n`);

for (const f of archivos) {
  const ruta = join(ORIGEN, f);
  // IMG_1012.HEIC -> obra-1012.webp  (conserva el numero para poder rastrearlo)
  const num = basename(f).match(/(\d+)/)?.[1] ?? basename(f, extname(f));
  const destino = join(SALIDA, `obra-${num}.webp`);

  try {
    const esHeic = /\.heic$/i.test(f);
    const buf = esHeic ? decodificarHeic(ruta) : null;
    const pipeline = sharp(buf ?? ruta)
      .resize({ width: ANCHO, withoutEnlargement: true })
      .webp({ quality: CALIDAD, effort: 6 });

    const info = await pipeline.toFile(destino);
    const antes = statSync(ruta).size;
    entrada += antes;
    salida += info.size;
    generados.push({ id: `obra-${num}`, w: info.width, h: info.height });
    console.log(
      `  ${f.padEnd(24)} ${String((antes / 1024 / 1024).toFixed(1) + 'MB').padStart(7)}` +
        ` -> ${String((info.size / 1024).toFixed(0) + 'KB').padStart(7)}  ${info.width}x${info.height}`
    );
  } catch (e) {
    fallidos.push(f);
    console.log(`  ${f.padEnd(24)} FALLO: ${String(e.message).split('\n')[0].slice(0, 60)}`);
  }
}

// Manifiesto: le da a la seccion de bitacora las dimensiones sin tener que
// abrir cada archivo, que es lo que evita el salto de layout al cargar.
writeFileSync(
  join(SALIDA, 'manifiesto.json'),
  JSON.stringify({ ancho: ANCHO, calidad: CALIDAD, fotos: generados }, null, 2) + '\n'
);

console.log(
  `\n${generados.length} convertidas` + (fallidos.length ? `, ${fallidos.length} fallidas` : '')
);
console.log(
  `${(entrada / 1024 / 1024).toFixed(1)} MB -> ${(salida / 1024 / 1024).toFixed(1)} MB ` +
    `(-${(100 - (salida / entrada) * 100).toFixed(1)}%)`
);
console.log(`Manifiesto: ${join(SALIDA, 'manifiesto.json')}`);
