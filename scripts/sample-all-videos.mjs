import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

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
const DIR_VIDEOS = 'C:/Users/maxmo/Downloads/grenco/videos para landing';
const outDir = 'scratch/all_video_samples';
mkdirSync(outDir, { recursive: true });

const files = readdirSync(DIR_VIDEOS).filter(f => /\.(mov|mp4)$/i.test(f));
for (const file of files) {
  const p = join(DIR_VIDEOS, file);
  const out = join(outDir, `${file}.jpg`);
  try {
    execFileSync(FFMPEG, [
      '-ss', '3',
      '-i', p,
      '-frames:v', '1',
      '-q:v', '2',
      '-y',
      out
    ], { stdio: 'ignore' });
    console.log(`OK: ${file}`);
  } catch (err) {
    console.error(`Error ${file}:`, err.message);
  }
}
