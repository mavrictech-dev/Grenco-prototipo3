import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// 1. Analizar imágenes referenciadas en código
const srcFiles = ['src/data/site.js', 'src/data/sede-contenido.js', 'src/data/bitacora.js'];
let code = '';
for (const f of srcFiles) {
  if (fs.existsSync(f)) code += fs.readFileSync(f, 'utf8') + '\n';
}

function scanDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      scanDir(p);
    } else if (p.endsWith('.jsx') || p.endsWith('.js')) {
      code += fs.readFileSync(p, 'utf8') + '\n';
    }
  }
}
scanDir('src');

const imageRefs = new Set();
const regexes = [
  /img\(['"]([^'"]+)['"]\)/g,
  /fotoObra\(['"]([^'"]+)['"]\)/g,
  /img:\s*['"]([^'"]+)['"]/g,
  /foto:\s*['"]([^'"]+)['"]/g,
];

for (const r of regexes) {
  let m;
  while ((m = r.exec(code)) !== null) {
    imageRefs.add(m[1]);
  }
}

console.log('=== IMÁGENES ACTIVAMENTE USADAS EN EL CÓDIGO ===');
const activeImages = Array.from(imageRefs).sort();
console.log(`Total: ${activeImages.length}`);
console.log(activeImages);

// 2. Revisar archivos en src/assets/images
const imagesDir = path.join(ROOT, 'src/assets/images');
const imagesFiles = fs.readdirSync(imagesDir);
console.log(`\n=== ARCHIVOS EN src/assets/images (${imagesFiles.length}) ===`);
console.log(imagesFiles);

// 3. Revisar archivos en src/assets/obra
const obraDir = path.join(ROOT, 'src/assets/obra');
const obraFiles = fs.existsSync(obraDir) ? fs.readdirSync(obraDir) : [];
console.log(`\n=== ARCHIVOS EN src/assets/obra (${obraFiles.length}) ===`);
console.log(obraFiles);
