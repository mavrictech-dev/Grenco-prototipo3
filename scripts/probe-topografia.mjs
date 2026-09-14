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
const videoFile = join(DIR_VIDEOS, 'las lomas tomas de topografia.MP4');

console.log('Video exists:', existsSync(videoFile));

// Probe video
try {
  execFileSync(FFMPEG, ['-i', videoFile]);
} catch (e) {
  const lines = (e.stderr || e.stdout || '').toString().split('\n');
  for (const line of lines) {
    if (line.includes('Duration') || line.includes('Stream #0:')) {
      console.log(line);
    }
  }
}

// Extract 5 frames across the video
const outFrames = 'scratch/topo_frames';
mkdirSync(outFrames, { recursive: true });

const timestamps = [5, 15, 30, 45, 60];
for (const t of timestamps) {
  const out = join(outFrames, `frame_${t}s.jpg`);
  try {
    execFileSync(FFMPEG, [
      '-ss', t.toString(),
      '-i', videoFile,
      '-frames:v', '1',
      '-q:v', '2',
      '-y',
      out
    ], { stdio: 'ignore' });
    console.log(`Frame at ${t}s extracted to ${out}`);
  } catch (err) {
    console.error(`Error at ${t}s:`, err.message);
  }
}
