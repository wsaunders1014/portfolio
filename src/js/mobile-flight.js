import { beginMenuFlight, endMenuFlight, menuFlightActive, updateMenuFlightApproach } from './menu-flight.js';
import { enableScrollEngines, updateMobileDrift, resetMobileDrift } from './mobile-scroll.js';
// Vertical flight controls supplement native scrolling on small screens.
const mobile = matchMedia('(max-width: 760px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll('.station')];
const status = document.querySelector('#mobile-flight-status');
let frame = 0;
let last = 0;
let velocity = 0;
let target = null;
let held = 0;
let press = null;
let holdTimer = 0;
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
const maximum = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
const sectionY = section => clamp(section.getBoundingClientRect().top + scrollY - document.querySelector('.flight-header').getBoundingClientRect().height - 20, 0, maximum());
function stop() {
  endMenuFlight();
  resetMobileDrift();
  cancelAnimationFrame(frame);
  clearTimeout(holdTimer);
  frame = last = velocity = held = 0;
  target = press = null;
  document.body.classList.remove('engines-on');
  status.textContent = 'Ready · tap to fly, hold to cruise';
}
function animate(time) {
  updateMobileDrift();
  const dt = last ? Math.min((time - last) / 1000, .05) : 0;
  last = time;
  const distance = target === null ? 0 : target - scrollY;
  // Only these explicit flight controls move the page at the faster rates.
  const topSpeed = menuFlightActive ? 2200 : 1200;
  const braking = 3000;
  // Keep mobile trails visible further into arrival, with a short coast left.
  if (target !== null) updateMenuFlightApproach(distance, Math.abs(velocity), braking, innerHeight, .6);
  const desired = held ? held * topSpeed : target !== null ? Math.sign(distance) * Math.min(topSpeed, Math.sqrt(2 * braking * Math.abs(distance))) : 0;
  const acceleration = !held && target === null ? 720
    : Math.abs(desired) < Math.abs(velocity) ? braking
    : menuFlightActive ? 2800 : 1800;
  velocity += clamp(desired - velocity, -acceleration * dt, acceleration * dt);
  let y = clamp(scrollY + velocity * dt, 0, maximum());
  if (target !== null && (Math.abs(distance) < 2 || (target - y) * distance < 0)) {
    window.scrollTo({ top: target, behavior: 'instant' });
    stop();
    status.textContent = 'Arrived · scroll to explore';
    return;
  }
  window.scrollTo({ top: y, behavior: 'instant' });
  document.documentElement.style.setProperty('--mobile-heading', `${velocity < 0 ? -Math.PI / 2 : Math.PI / 2}rad`);
  document.body.classList.toggle('engines-on', Boolean(held || target !== null));
  if ((!held && target === null && Math.abs(velocity) < 1) || (y === 0 && velocity < 0) || (y === maximum() && velocity > 0)) { stop(); return; }
  frame = requestAnimationFrame(animate);
}
function start() { if (!frame) { last = 0; frame = requestAnimationFrame(animate); } }
function visit(section, fromMenu = false) {
  stop();
  const y = sectionY(section);
  if (reduced.matches) { window.scrollTo({ top: y, behavior: 'instant' }); return; }
  // Arrow trips also engage warp, including adjacent sections closer than
  // the distance threshold used by the top menu.
  beginMenuFlight(y - scrollY, innerHeight, { force: !fromMenu });
  target = y;
  status.textContent = `Flying to ${section.querySelector('.eyebrow').textContent}`;
  start();
}
for (const button of document.querySelectorAll('[data-flight-direction]')) {
  button.addEventListener('pointerdown', event => {
    if (!mobile.matches || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    stop();
    const direction = Number(button.dataset.flightDirection);
    press = { id: event.pointerId, direction, cruising: false };
    button.setPointerCapture(event.pointerId);
    holdTimer = setTimeout(() => {
      if (!press) return;
      press.cruising = true;
      held = direction;
      beginMenuFlight(direction > 0 ? maximum() - scrollY : -scrollY, innerHeight, { force: true });
      status.textContent = direction > 0 ? 'Cruising down · release to coast' : 'Cruising up · release to coast';
      start();
    }, 250);
  });
  button.addEventListener('pointerup', event => {
    if (!press || press.id !== event.pointerId) return;
    const { direction, cruising } = press;
    clearTimeout(holdTimer);
    press = null;
    if (cruising) { held = 0; endMenuFlight(); status.textContent = 'Coasting'; return; }
    const candidates = sections.filter(section => direction * (sectionY(section) - scrollY) > 40);
    const section = direction > 0 ? candidates[0] : candidates.at(-1);
    if (section) visit(section); else stop();
  });
  button.addEventListener('pointercancel', stop);
  button.addEventListener('lostpointercapture', () => { if (press) stop(); });
  button.addEventListener('click', event => {
    if (event.detail !== 0 || !mobile.matches) return;
    const direction = Number(button.dataset.flightDirection);
    const candidates = sections.filter(section => direction * (sectionY(section) - scrollY) > 40);
    const section = direction > 0 ? candidates[0] : candidates.at(-1);
    if (section) visit(section);
  });
}
document.querySelector('#mobile-flight-stop').addEventListener('click', stop);
document.addEventListener('click', event => {
  if (!mobile.matches) return;
  const link = event.target.closest('a[href^="#"]');
  const section = link && sections.find(section => `#${section.id}` === link.getAttribute('href'));
  if (!section) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  visit(section, true);
}, true);
window.addEventListener('touchstart', event => { if (!event.target.closest('.mobile-flight-dock')) stop(); }, { passive: true });
window.addEventListener('wheel', stop, { passive: true });
window.addEventListener('keydown', event => { if (['Escape', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' '].includes(event.key)) stop(); });
window.addEventListener('blur', stop);
let viewportWidth = innerWidth;
window.addEventListener('resize', () => {
  if (innerWidth !== viewportWidth) {
    viewportWidth = innerWidth;
    stop();
  }
});
mobile.addEventListener('change', stop);
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

enableScrollEngines(() => !frame);
