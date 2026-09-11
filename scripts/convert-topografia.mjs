import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
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
const DIR_ORIGEN = 'C:/Users/maxmo/Downloads/grenco/imagenes para landing';
const DIR_DESTINO = 'src/assets/images';

// Lista de archivos solicitados por el usuario
const FOTOS_TOPOGRAFIA = [
  { archivo: 'Personal en trabajo topografía LAS LOMAS9.jpeg', id: 'topo-lomas-9' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS8.jpeg', id: 'topo-lomas-8' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS7.jpeg', id: 'topo-lomas-7' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS5.jpeg', id: 'topo-lomas-5' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS6.jpeg', id: 'topo-lomas-6' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS4.jpeg', id: 'topo-lomas-4' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS3.jpeg', id: 'topo-lomas-3' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS2.HEIC', id: 'topo-lomas-2' },
  { archivo: 'Personal en trabajo topografía LAS LOMAS.HEIC',  id: 'topo-lomas-1' },
  { archivo: 'topografia 7.HEIC', id: 'topo-7' },
  { archivo: 'topografia 6.HEIC', id: 'topo-6' },
  { archivo: 'topografia 5.jpeg', id: 'topo-5' },
  { archivo: 'topografia 4.HEIC', id: 'topo-4' },
  { archivo: 'topografia 3.HEIC', id: 'topo-3' },
  { archivo: 'topografia 2.HEIC', id: 'topo-2' },
  { archivo: 'topografia.HEIC',   id: 'topo-1' },
  { archivo: 'Topografía las lomas.HEIC', id: 'topo-lomas-extra' },
];

const kb = (f) => (statSync(f).size / 1024).toFixed(0) + ' KB';

async function convertirFoto(rutaOrigen, rutaDestino) {
  // Usamos ffmpeg para decodificar (soporta tanto HEIC con mapas HDR como JPEG)
  const png = execFileSync(
    FFMPEG,
    [
      '-v', 'error',
      '-y',
      '-i', rutaOrigen,
      '-frames:v', '1',
      '-f', 'image2pipe',
      '-c:v', 'png',
      '-'
    ],
    { maxBuffer: 1 << 27, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  // Comprimir con sharp a 1200px max
  const metadata = await sharp(png).metadata();
  const esVertical = (metadata.height || 0) > (metadata.width || 0);

  await sharp(png)
    .resize(esVertical ? { height: 1200, withoutEnlargement: true } : { width: 1200, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(rutaDestino);

  return {
    ancho: metadata.width,
    alto: metadata.height,
    esVertical
  };
}

async function main() {
  console.log('Convirtiendo 17 fotos de topografía a WebP optimizado...');
  const resultados = [];

  for (const item of FOTOS_TOPOGRAFIA) {
    const origen = join(DIR_ORIGEN, item.archivo);
    const destino = join(DIR_DESTINO, `${item.id}.webp`);

    if (!existsSync(origen)) {
      console.warn(`[WARN] No se encontró: ${origen}`);
      continue;
    }

    try {
      const info = await convertirFoto(origen, destino);
      console.log(`✓ ${item.id}.webp (${kb(destino)}) - ${info.esVertical ? 'Vertical' : 'Horizontal'}`);
      resultados.push({
        id: item.id,
        esVertical: info.esVertical,
        w: info.ancho,
        h: info.alto
      });
    } catch (err) {
      console.error(`[ERROR] en ${item.archivo}:`, err.message);
    }
  }

  console.log('\nResultados procesados:', resultados.length);
  console.log(JSON.stringify(resultados, null, 2));
}

main().catch(console.error);
