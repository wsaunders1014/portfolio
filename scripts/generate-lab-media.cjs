// Original procedural samples. No brand footage, external hosts, or audio tracks.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const encoder = require('ffmpeg-static');
const width = 640, height = 360, fps = 24, duration = 6;
const directory = path.resolve(__dirname, '../src/lab/media');
fs.mkdirSync(directory, { recursive: true });
const samples = [
  { id: 'orbit', bg: [13, 38, 37], ink: [170, 244, 220], dim: [44, 88, 78] },
  { id: 'wave', bg: [29, 24, 49], ink: [195, 175, 255], dim: [66, 52, 99] },
  { id: 'pulse', bg: [45, 32, 19], ink: [240, 199, 128], dim: [94, 65, 35] }
];
for (const sample of samples) {
  const frames = [];
  for (let f = 0; f < fps * duration; f++) {
    const buffer = Buffer.alloc(width * height * 3);
    buffer.fill(Buffer.from(sample.bg));
    const t = f / (fps * duration) * Math.PI * 2;
    function pixel(x, y, color) {
      x = Math.round(x); y = Math.round(y);
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const offset = (y * width + x) * 3;
      buffer[offset] = color[0]; buffer[offset + 1] = color[1]; buffer[offset + 2] = color[2];
    }
    function box(x, y, w, h, color) { for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) pixel(x + a, y + b, color); }
    for (let x = 0; x < width; x += 40) for (let y = 0; y < height; y += 40) box(x, y, 2, 2, sample.dim);
    if (sample.id === 'orbit') {
      for (const radius of [65, 106, 148]) for (let i = 0; i < 720; i++) {
        const a = i / 720 * Math.PI * 2;
        pixel(320 + Math.cos(a) * radius, 180 + Math.sin(a) * radius, sample.dim);
      }
      for (let k = 0; k < 3; k++) {
        const angle = t * (k % 2 ? -1 : 1) + k * 2.1;
        const radius = [65, 106, 148][k];
        for (let dx = -7; dx <= 7; dx++) for (let dy = -7; dy <= 7; dy++) if (dx * dx + dy * dy <= 49) pixel(320 + Math.cos(angle) * radius + dx, 180 + Math.sin(angle) * radius + dy, sample.ink);
      }
      for (let dx = -15; dx <= 15; dx++) for (let dy = -15; dy <= 15; dy++) if (dx * dx + dy * dy <= 225) pixel(320 + dx, 180 + dy, sample.ink);
    } else if (sample.id === 'wave') {
      for (let k = 0; k < 5; k++) for (let x = 40; x < 600; x++) {
        const y = 180 + Math.sin(x / 64 + t + k * .7) * (42 + k * 12);
        box(x, y, 2, k === 2 ? 3 : 2, k === 2 ? sample.ink : sample.dim);
      }
    } else {
      for (let x = 55; x < 590; x += 19) {
        const h = 26 + (Math.sin(x / 75 + t) + 1) * 52 + (Math.cos(x / 35 - t * 2) + 1) * 12;
        box(x, 180 - h / 2, 8, Math.round(h), x % 3 ? sample.ink : sample.dim);
      }
      for (let x = 35; x < 605; x++) pixel(x, 180, sample.dim);
    }
    frames.push(buffer);
  }
  const result = spawnSync(encoder, ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${width}x${height}`, '-r', String(fps), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(directory, sample.id + '.mp4')], { input: Buffer.concat(frames), maxBuffer: 1024 * 1024, timeout: 60000 });
  if (result.status !== 0) throw new Error(result.stderr?.toString() || result.error?.message || 'Encoding failed');
  const bg = `rgb(${sample.bg.join(',')})`, ink = `rgb(${sample.ink.join(',')})`, dim = `rgb(${sample.dim.join(',')})`;
  const art = sample.id === 'orbit' ? `<g fill="none" stroke="${dim}">${[65,106,148].map(r=>`<circle cx="320" cy="180" r="${r}"/>`).join('')}</g><g fill="${ink}"><circle cx="320" cy="180" r="15"/><circle cx="385" cy="180" r="7"/><circle cx="266" cy="271" r="7"/><circle cx="247" cy="51" r="7"/></g>` : sample.id === 'wave' ? `<g fill="none" stroke="${dim}" stroke-width="2">${[0,1,2,3,4].map(k=>`<path d="${Array.from({length:113},(_,i)=>`${i?'L':'M'}${40+i*5},${180+Math.sin((40+i*5)/64+k*.7)*(42+k*12)}`).join(' ')}" ${k===2?`stroke="${ink}" stroke-width="3"`:''}/>`).join('')}</g>` : `<g fill="${ink}">${Array.from({length:28},(_,i)=>{const x=55+i*19,h=26+(Math.sin(x/75)+1)*52+(Math.cos(x/35)+1)*12;return `<rect x="${x}" y="${180-h/2}" width="8" height="${h}"/>`}).join('')}</g>`;
  fs.writeFileSync(path.join(directory, sample.id + '.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${bg}"/>${art}</svg>\n`);
  console.log(`Created ${sample.id}: ${(fs.statSync(path.join(directory, sample.id + '.mp4')).size/1024).toFixed(0)} KiB`);
}
