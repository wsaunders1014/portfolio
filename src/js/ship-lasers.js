import { laserOutsideViewport } from './laser-geometry.js';

const ship = document.querySelector('.ship');
const layer = document.createElement('div');
layer.className = 'ship-lasers';
layer.setAttribute('aria-hidden', 'true');
document.body.append(layer);
const shots = new Set();
let firing = false;
let frame = 0;
let last = 0;
let nextBurst = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function burst() {
  const rect = ship.getBoundingClientRect();
  const matrix = new DOMMatrixReadOnly(getComputedStyle(ship).transform);
  const angle = Math.atan2(matrix.b, matrix.a);
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nose = ship.offsetWidth * .4;
  for (const side of [-1, 1]) {
    const offset = ship.offsetHeight * .16 * side;
    const node = document.createElement('span');
    node.className = 'ship-laser';
    const shot = { node, angle, dx, dy,
      x: rect.left + rect.width / 2 + dx * nose - dy * offset,
      y: rect.top + rect.height / 2 + dy * nose + dx * offset };
    node.style.transform = `translate(${shot.x}px, ${shot.y}px) rotate(${angle}rad)`;
    layer.append(node);
    shots.add(shot);
  }
}
function animate(time) {
  const dt = last ? Math.min((time - last) / 1000, .05) : 0;
  last = time;
  if (firing && time >= nextBurst) {
    burst();
    nextBurst = time + 180;
  }
  for (const shot of shots) {
    shot.x += shot.dx * 1100 * dt;
    shot.y += shot.dy * 1100 * dt;
    if (laserOutsideViewport(shot.x, shot.y, shot.angle, innerWidth, innerHeight)) {
      shot.node.remove();
      shots.delete(shot);
    } else {
      shot.node.style.transform = `translate(${shot.x}px, ${shot.y}px) rotate(${shot.angle}rad)`;
    }
  }
  if (firing || shots.size) frame = requestAnimationFrame(animate);
  else frame = last = 0;
}
function release() { firing = false; }
function clear() {
  release();
  cancelAnimationFrame(frame);
  frame = last = 0;
  for (const shot of shots) shot.node.remove();
  shots.clear();
}
function startFiring(event) {
  if (firing) return;
  if (event.target.closest('a, button:not(.ship), input, textarea, select, summary, [contenteditable], #ship-picker')) return;
  event.preventDefault();
  if (reduced.matches) return;
  firing = true;
  burst();
  nextBurst = performance.now() + 180;
  if (!frame) frame = requestAnimationFrame(animate);
}
// Preventing pointerdown for steering can suppress compatibility mouse events.
// A second button press arrives as pointermove with a changed buttons mask.
document.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button === 2) startFiring(event);
});
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse') return;
  if (event.buttons & 2) startFiring(event);
  else release();
});
window.addEventListener('pointerup', event => {
  if (event.pointerType === 'mouse' && !(event.buttons & 2)) release();
});
document.addEventListener('mousedown', event => {
  if (event.button === 2) startFiring(event);
});
window.addEventListener('mouseup', event => {
  if (event.button === 2) release();
});
window.addEventListener('mousemove', event => { if (!(event.buttons & 2)) release(); });
document.addEventListener('mouseleave', release);
window.addEventListener('pointercancel', release);
window.addEventListener('blur', clear);
document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
reduced.addEventListener('change', clear);
