import { starPassProfile } from './star-pass.js';
import { menuFlightActive, menuFlightTrailStrength, menuFlightDirection, menuFlightCruising } from './menu-flight.js';
// The dense, distant layer is painted once; nearby stars animate separately.
const distantCanvas = document.createElement('canvas');
distantCanvas.className = 'distant-starfield';
distantCanvas.setAttribute('aria-hidden', 'true');
document.body.prepend(distantCanvas);
const distantContext = distantCanvas.getContext('2d');
const canvas = document.createElement('canvas');
canvas.className = 'pixel-starfield';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);
const context = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 800px)');
const hyperspeed = new URLSearchParams(location.search).get('hyperspeed') !== '0';
const route = document.querySelector('.route');
const palette = ['#f4f3e9', '#fff7dc', '#e2e5e8', '#fff0bc'];
const warpWhite = [235, 248, 255];
const glowCache = new Map();
function starGlow(star) {
  const key = `${star.color}:${star.size}`;
  if (glowCache.has(key)) return glowCache.get(key);
  const radius = star.size * 2.5;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const image = document.createElement('canvas');
  image.width = image.height = Math.ceil(radius * 2 * ratio);
  const glow = image.getContext('2d');
  glow.scale(ratio, ratio);
  const gradient = glow.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, star.color);
  gradient.addColorStop(.2, `${star.color}70`);
  gradient.addColorStop(.5, `${star.color}18`);
  gradient.addColorStop(1, `${star.color}00`);
  glow.fillStyle = gradient;
  glow.fillRect(0, 0, radius * 2, radius * 2);
  const sprite = { image, size: radius * 2 };
  glowCache.set(key, sprite);
  return sprite;
}
let stars = [];
let width = 0;
let height = 0;
let previousTime = 0;
let previous = null;
let velocity = { x: 0, y: 0 };
let frame = 0;
let drift = 0;
let warp = 0;
let passage = { x: 0, y: 0 };
const wrap = (value, range) => ((value % range) + range) % range;
function worldPosition() {
  const style = document.documentElement.style;
  return mobile.matches
    ? { x: 0, y: window.scrollY }
    : { x: route.scrollLeft + (parseFloat(style.getPropertyValue('--ship-x')) || innerWidth / 2), y: parseFloat(style.getPropertyValue('--ship-y')) || innerHeight / 2 };
}
function resize() {
  glowCache.clear();
  width = innerWidth;
  height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  distantCanvas.width = Math.round(width * ratio);
  distantCanvas.height = Math.round(height * ratio);
  distantContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const distantCount = Math.max(450, Math.min(6000, Math.round(width * height / 550)));
  for (let i = 0; i < distantCount; i++) {
    const size = .45 + Math.random() * .7;
    distantContext.globalAlpha = .2 + Math.random() * .5;
    distantContext.fillStyle = ['#d8dfe8', '#f2e9d7', '#c5d3e4'][i % 3];
    distantContext.beginPath();
    distantContext.arc(Math.random() * width, Math.random() * height, size / 2, 0, Math.PI * 2);
    distantContext.fill();
  }
  distantContext.globalAlpha = 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.max(75, Math.min(260, Math.round(width * height / 4800)));
  stars = Array.from({ length: count }, (_, index) => {
    // Artistic apparent sizes, using real stellar color families. Hot blue-white
    // stars are rare here; pixel size does not represent a physical star radius.
    const blue = index % 47 === 13;
    const red = !blue && index % 13 === 5;
    const color = blue ? '#b9d5ff' : red ? '#edb09b' : palette[index % palette.length];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      depth: [0, .035, .09, .19][index % 4],
      size: blue ? (index % 2 ? 5 : 4) : index % 19 === 0 ? 3 : index % 5 === 0 ? 2 : 1,
      color,
      channels: color.match(/[a-f\d]{2}/gi).map(channel => parseInt(channel, 16)),
      opacity: blue ? .8 : .25 + Math.random() * .6
    };
  });
  previous = worldPosition();
  velocity = { x: 0, y: 0 };
  warp = 0;
  paint(0);
}
function paint(dt) {
  const position = worldPosition();
  const moving = !reduced.matches;
  if (previous && dt > 0) {
    const blend = 1 - Math.exp(-dt * 9);
    const vx = Math.max(-2000, Math.min(2000, (position.x - previous.x) / dt));
    const vy = Math.max(-2000, Math.min(2000, (position.y - previous.y) / dt));
    velocity.x += (vx - velocity.x) * blend;
    velocity.y += (vy - velocity.y) * blend;
  }
  previous = position;
  if (moving) drift += dt;
  context.clearRect(0, 0, width, height);
  const speed = mobile.matches ? Math.hypot(velocity.x, velocity.y) : Math.abs(velocity.x);
  const departureSpeed = mobile.matches ? speed : Math.max(0, velocity.x * menuFlightDirection);
  const desiredWarp = hyperspeed && menuFlightActive && menuFlightCruising && moving
    ? Math.max(0, Math.min(1, (departureSpeed - 65) / 320)) * menuFlightTrailStrength : 0;
  // A newly selected return journey must not inherit streaks from the last trip.
  if (menuFlightActive && !menuFlightCruising) warp = 0;
  // Let the launch build visibly; arrival still settles promptly.
  const warpResponse = desiredWarp > warp ? 1.8 : 8;
  warp = moving ? warp + (desiredWarp - warp) * (1 - Math.exp(-dt * warpResponse)) : 0;
  const stretch = warp < .003 ? 0 : warp;
  // Ease each trail from its star's original hue to blue-white and back with
  // the existing warp envelope, preserving color continuity when retargeted.
  const blueShift = stretch * stretch * (3 - 2 * stretch);
  const diagonal = Math.hypot(width, height);
  // Extra travel during warp lets each star approach, pass, and recede.
  passage.x += velocity.x * stretch * dt;
  if (mobile.matches) passage.y += velocity.y * stretch * dt;
  // Desktop warp follows the horizontal route, not the ship's turning nose.
  const direction = mobile.matches
    ? (speed > 0 ? { x: velocity.x / speed, y: velocity.y / speed } : { x: 0, y: 1 })
    : { x: menuFlightActive ? menuFlightDirection : Math.sign(velocity.x) || 1, y: 0 };
  const style = document.documentElement.style;
  const shipX = mobile.matches ? width - 30 : parseFloat(style.getPropertyValue('--ship-x')) || width / 2;
  const shipY = mobile.matches ? height * .45 : parseFloat(style.getPropertyValue('--ship-y')) || height / 2;
  const extent = Math.max(1, Math.abs(direction.x) * width * .6 + Math.abs(direction.y) * height * .6);
  for (const star of stars) {
    const travelDepth = star.depth === 0 ? 0 : .4 + star.depth * 3;
    const x = Math.round(wrap(star.x - (moving ? position.x * star.depth + passage.x * travelDepth + drift * star.depth * 2 : 0), width));
    const y = Math.round(wrap(star.y - (moving ? position.y * star.depth + passage.y * travelDepth + drift * star.depth : 0), height));
    const ahead = (x - shipX) * direction.x + (y - shipY) * direction.y;
    const profile = star.depth === 0 ? { length: 0, visibility: 1 } : starPassProfile(ahead, extent);
    const visibility = 1 - stretch + stretch * profile.visibility;
    context.globalAlpha = star.opacity * visibility;
    context.fillStyle = star.color;
    // Distant stars stay as dots. Passing stars get the longest streaks;
    // behind the ship, both length and brightness decay with distance.
    const length = star.depth === 0 ? 0 : Math.pow(stretch, 1.6) * diagonal * (1.65 + star.depth) * profile.length;
    if (length > 1 && speed > 0) {
      const dx = direction.x * length;
      const dy = direction.y * length;
      context.strokeStyle = `rgb(${star.channels.map((channel, index) =>
        Math.round(channel + (warpWhite[index] - channel) * blueShift)).join(', ')})`;
      context.lineCap = mobile.matches ? 'butt' : 'round';
      context.beginPath();
      context.moveTo(x - dx, y - dy);
      context.lineTo(x + dx, y + dy);
      // Layer a broad soft bloom and a tighter halo beneath the bright core.
      // Nested strokes avoid an expensive blur filter on every moving trail.
      context.globalAlpha = star.opacity * stretch * .07 * visibility;
      context.lineWidth = star.size + 14 * stretch;
      context.stroke();
      context.globalAlpha = star.opacity * stretch * .22 * visibility;
      context.lineWidth = star.size + 6 * stretch;
      context.stroke();
      context.globalAlpha = (star.opacity + (1 - star.opacity) * stretch * .95) * visibility;
      context.lineWidth = star.size;
      context.stroke();
    } else if (mobile.matches) {
      context.fillRect(x, y, star.size, star.size);
    } else {
      if (star.size >= 2) {
        // Reuse a small soft halo instead of blurring every star every frame.
        const glow = starGlow(star);
        context.globalAlpha = star.opacity * visibility * .4;
        context.drawImage(glow.image, x + star.size / 2 - glow.size / 2, y + star.size / 2 - glow.size / 2, glow.size, glow.size);
        context.globalAlpha = star.opacity * visibility;
      }
      context.beginPath();
      context.arc(x + star.size / 2, y + star.size / 2, star.size / 2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.globalAlpha = 1;
}
function animate(time) {
  frame = 0;
  if (document.hidden) return;
  const dt = previousTime ? Math.min((time - previousTime) / 1000, .1) : 0;
  previousTime = time;
  paint(dt);
  if (!reduced.matches) frame = requestAnimationFrame(animate);
}
function restart() {
  cancelAnimationFrame(frame);
  previousTime = 0;
  previous = worldPosition();
  velocity = { x: 0, y: 0 };
  warp = 0;
  paint(0);
  if (!document.hidden && !reduced.matches) frame = requestAnimationFrame(animate);
}
if (context) {
  resize();
  restart();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', restart);
  reduced.addEventListener('change', restart);
}
