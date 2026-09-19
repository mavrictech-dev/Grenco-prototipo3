import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const distAssetsDir = path.resolve('dist', 'assets');

if (!fs.existsSync(distAssetsDir)) {
  console.error('No se encontró la carpeta dist/assets. Ejecuta vite build primero.');
  process.exit(1);
}

// Solo ofuscamos el codigo propio de la aplicacion (index-*.js, etc.)
// Los vendors de terceros abiertos (como react) no contienen propiedad intelectual
// y dejarlos sin ofuscar mantiene el rendimiento de renderizado al 100%.
const jsFiles = fs.readdirSync(distAssetsDir)
  .filter((file) => file.endsWith('.js') && !file.startsWith('react'));

console.log(`[Obfuscator] Encontrados ${jsFiles.length} archivos JS para proteger...`);

for (const file of jsFiles) {
  const filePath = path.join(distAssetsDir, file);
  const code = fs.readFileSync(filePath, 'utf-8');
  console.log(`[Obfuscator] Ofuscando ${file}...`);

  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 6,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.8,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  });

  fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode(), 'utf-8');
  console.log(`[Obfuscator] ✓ ${file} protegido exitosamente.`);
}

console.log('[Obfuscator] ¡Todo el código JS ha sido ofuscado e impenetrable!');
