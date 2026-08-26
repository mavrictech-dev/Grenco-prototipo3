/**
 * Optimiza los assets de origen hacia src/assets/, que es lo que Vite empaqueta
 * (con hash de contenido y cache inmutable). Se corre a mano: `npm run images`.
 */
import sharp from 'sharp';
import { mkdirSync, statSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_IMG = 'src/assets/images';
const OUT_BRAND = 'src/assets/brand';
mkdirSync(OUT_IMG, { recursive: true });
mkdirSync(OUT_BRAND, { recursive: true });
mkdirSync('public', { recursive: true });

let before = 0, after = 0;
const kb = (n) => (n / 1024).toFixed(0) + 'KB';

async function emit(src, dest, pipeline) {
  const inSize = statSync(src).size;
  await pipeline.toFile(dest);
  const outSize = statSync(dest).size;
  before += inSize; after += outSize;
  const pct = (100 - (outSize / inSize) * 100).toFixed(0);
  console.log(`  ${dest.padEnd(46)} ${kb(inSize).padStart(7)} -> ${kb(outSize).padStart(7)}  (-${pct}%)`);
}

/**
 * El lockup en negativo viene con el fondo oscuro incrustado en vez de alfa.
 * Puesto tal cual en la barra se veria como un recuadro, porque ese gris
 * (rgb 32,30,30) no es el mismo que el fondo del tema oscuro. Convertimos ese
 * color en transparencia.
 *
 * Tolerancia baja a proposito: el borde antialiaseado de las letras se queda,
 * y asi no se comen los contornos.
 */
function despegarFondo(buffer, info, [br, bg, bb], tolerancia = 26) {
  const out = Buffer.from(buffer);
  for (let i = 0; i < out.length; i += 4) {
    const d = Math.abs(out[i] - br) + Math.abs(out[i + 1] - bg) + Math.abs(out[i + 2] - bb);
    if (d < tolerancia) out[i + 3] = 0;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

// --- Lockups de la barra ---------------------------------------------------
// Se muestran a 38-46px de alto; 480px de ancho cubre pantallas 3x de sobra.
// Se recortan ambos (`trim`) para que compartan encuadre exacto: si no, el
// logo daria un salto al cambiar de tema.
console.log('\nLockups de la barra (la "G solida", sin la excavadora):');
await emit(
  'assets/grenco-lockup-light.png',
  `${OUT_BRAND}/grenco-lockup-light.webp`,
  sharp('assets/grenco-lockup-light.png')
    .trim({ threshold: 1 })
    .resize({ width: 480 })
    .webp({ quality: 88, effort: 6 })
);

{
  const src = sharp('assets/grenco-lockup-dark.png');
  const { data, info } = await src.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  await emit(
    'assets/grenco-lockup-dark.png',
    `${OUT_BRAND}/grenco-lockup-dark.webp`,
    despegarFondo(data, info, [32, 30, 30])
      .trim({ threshold: 1 })
      .resize({ width: 480 })
      .webp({ quality: 88, effort: 6 })
  );
}

// El isotipo (G + excavadora) va centrado en el hero como silueta, a opacidad
// muy baja. El canal alfa es lo que pesa aqui, no el color, asi que baja mucho
// la calidad de ambos: a esa opacidad la diferencia no se ve, y era el segundo
// archivo mas pesado de la carga inicial.
console.log('\nIsotipo de fondo del hero (G + excavadora, opacidad baja):');
await emit(
  'assets/grenco-mark.png',
  `${OUT_BRAND}/grenco-mark.webp`,
  sharp('assets/grenco-mark.png')
    .trim({ threshold: 1 })
    .resize({ width: 760 })
    .webp({ quality: 46, alphaQuality: 55, effort: 6 })
);

// --- Fotografia ------------------------------------------------------------
// Recomprime al mismo tamano; el encoder original dejo mucho sobre la mesa.
//
// Las hero-*.webp quedan fuera: el carrusel del hero se sustituyo por el
// triptico de video, asi que ya no las usa nadie. Se conservan en assets/ por
// si hacen falta, pero no entran a src/ ni al despliegue: el glob de
// src/assets/images es `eager`, y todo lo que caiga ahi acaba en dist aunque
// ningun componente lo importe.
const SIN_USO = /^hero-/;
console.log('\nFotografia (recompresion WebP q74, effort 6):');
for (const f of readdirSync('assets/images').filter((f) => f.endsWith('.webp')).sort()) {
  if (SIN_USO.test(f)) continue;
  const src = `assets/images/${f}`;
  await emit(src, `${OUT_IMG}/${f}`, sharp(src).webp({ quality: 74, effort: 6, smartSubsample: true }));
}

// --- Favicon + Open Graph --------------------------------------------------
console.log('\nFavicon y Open Graph:');
await emit(
  'assets/grenco-mark.png',
  'public/favicon.png',
  sharp('assets/grenco-mark.png')
    .resize({ width: 180, height: 180, fit: 'contain', background: { r: 233, g: 230, b: 224, alpha: 1 } })
    .flatten({ background: '#e9e6e0' })
    .png({ compressionLevel: 9, palette: true })
);
await emit(
  'assets/images/hero-1.webp',
  'public/og-image.jpg',
  sharp('assets/images/hero-1.webp').resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true })
);

writeFileSync('public/robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: https://grenco.pe/sitemap.xml\n');

console.log(`\nTotal: ${kb(before)} -> ${kb(after)}  (-${(100 - (after / before) * 100).toFixed(1)}%)\n`);
