import { beginMenuFlight, endMenuFlight, menuFlightActive, menuFlightDirection, menuFlightSpeedScale, updateMenuFlightDeparture, updateMenuFlightApproach } from './menu-flight.js';
import { enableScrollEngines } from './mobile-scroll.js';
import { createFlightPath, sampleFlightPath } from './flight-path.js';
import { enableDesktopWheel } from './desktop-wheel.js';
import { chaseWheelTarget, followCenteredShip } from './wheel-chase.js';
import { updateSectionHash, restoreSectionFromHash } from './section-navigation.js';
import { heldRestPoint } from './held-flight.js';

const initialSectionHash = location.hash;
let interactedSinceLoad = false;
for (const type of ['pointerdown', 'wheel', 'keydown']) {
  window.addEventListener(type, () => { interactedSinceLoad = true; }, { once: true, passive: true });
}

// Consume the release-click from a flight gesture before any content/menu handler.
let suppressClickUntil = 0;
document.addEventListener('click', event => {
  if (event.detail !== 0 && performance.now() < suppressClickUntil) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
document.addEventListener('pointerdown', event => {
  if (event.button === 0) suppressClickUntil = 0;
}, true);
document.addEventListener('contextmenu', event => event.preventDefault());

const route = document.querySelector('.route');
const stations = [...route.querySelectorAll('.station')];
const links = [...document.querySelectorAll('nav a')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const mobile = matchMedia('(max-width: 760px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Scrollport padding follows the overlaid controls, including a wrapped nav.
const header = document.querySelector('.flight-header');
const footer = document.querySelector('.flight-controls');
function updateControlInsets() {
  document.documentElement.style.setProperty('--flight-header-height', `${header.getBoundingClientRect().height}px`);
  document.documentElement.style.setProperty('--flight-footer-height', `${footer.getBoundingClientRect().height}px`);
}
const controlObserver = new ResizeObserver(updateControlInsets);
controlObserver.observe(header);
controlObserver.observe(footer);
updateControlInsets();
let active = 0;
let frame = 0;

// Choose centers still ahead of the camera, rather than skipping a station
// as soon as its label becomes active. Ignore tiny arrival/scroll rounding.
function stationInDirection(direction) {
  if (mobile.matches) {
    const index = active + direction;
    return index >= 0 && index < stations.length ? index : -1;
  }
  return direction > 0
    ? stations.findIndex(station => station.offsetLeft > route.scrollLeft + 8)
    : stations.findLastIndex(station => station.offsetLeft < route.scrollLeft - 8);
}

function update() {
  frame = 0;
  if (mobile.matches) {
    const target = innerHeight * .35;
    active = stations.reduce((best, station, index) =>
      Math.abs(station.getBoundingClientRect().top - target) < Math.abs(stations[best].getBoundingClientRect().top - target) ? index : best, 0);
  } else {
    active = stations.reduce((best, station, index) =>
      Math.abs(station.offsetLeft - route.scrollLeft) < Math.abs(stations[best].offsetLeft - route.scrollLeft) ? index : best, 0);
  }
  const progress = mobile.matches
    ? scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
    : route.scrollLeft / Math.max(1, route.scrollWidth - route.clientWidth);
  document.documentElement.style.setProperty('--progress', Math.max(0, Math.min(1, progress)));
  document.documentElement.style.setProperty('--star-x', reducedMotion.matches ? '0px' : `${-progress * 180}px`);
  document.querySelector('#station-label').textContent = stations[active].querySelector('.eyebrow').textContent;
  links.forEach((link, index) => index === active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  previous.disabled = stationInDirection(-1) < 0;
  next.disabled = stationInDirection(1) < 0;
  updateSectionHash(stations[active].id);

}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(update);
}

function visit(index) {
  const station = stations[Math.max(0, Math.min(stations.length - 1, index))];
  if (!mobile.matches && !reducedMotion.matches) flyToStation(station);
  else location.hash = station.id;
}
previous.addEventListener('click', () => {
  const index = stationInDirection(-1);
  if (index >= 0) visit(index);
});
next.addEventListener('click', () => {
  const index = stationInDirection(1);
  if (index >= 0) visit(index);
});
document.querySelector('.route-buttons').hidden = false;
route.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  update();
});
mobile.addEventListener('change', update);
reducedMotion.addEventListener('change', update);

// Ship coordinates live in the horizontal world; the camera tracks its x.
// Clicking the background chooses a world point, not a viewport-relative target.
let flightFrame = 0;
let lastTime = 0;
let speed = 0;
let path = null;
let travelled = 0;
let destination = null;
let steeringPointer = null;
let heldRest = null;
let autopilot = false;
let coasting = false;
let wheelCatchup = false;
const wheelVelocity = { x: 0, y: 0 };
let pressTime = 0;
let pressX = 0;
let pressY = 0;
let pressTarget = null;
let pendingControlPress = null;
let controlHoldTimer = 0;
function clearControlPress() {
  clearTimeout(controlHoldTimer);
  pendingControlPress = null;
}
const maximumSpeed = 742.5;
const coastDeceleration = maximumSpeed / 1.72;
let pointerX = 0;
let pointerY = 0;
const position = { x: route.scrollLeft + innerWidth / 2, y: route.clientHeight / 2 };
let heading = 0;
const waypoint = document.querySelector('.flight-waypoint');
document.body.classList.add('flight-ready');

function bounds() {
  const height = route.clientHeight;
  const inset = Math.min(80, height / 4);
  return { top: inset, bottom: height - inset };
}

function renderShip() {
  if (mobile.matches) return;
  const rect = route.getBoundingClientRect();
  document.documentElement.style.setProperty('--ship-x', `${position.x - route.scrollLeft}px`);
  document.documentElement.style.setProperty('--ship-y', `${rect.top + position.y}px`);
  document.documentElement.style.setProperty('--ship-angle', `${heading}rad`);
  if (destination) {
    waypoint.style.left = `${destination.x - route.scrollLeft}px`;
    waypoint.style.top = `${rect.top + destination.y}px`;
  }
}

function stopFlight() {
  wheelCatchup = false;
  wheelVelocity.x = wheelVelocity.y = 0;
  clearControlPress();
  endMenuFlight();
  releaseSteering();
  cancelAnimationFrame(flightFrame);
  flightFrame = 0;
  lastTime = 0;
  speed = 0;
  autopilot = false;
  coasting = false;
  path = null;
  destination = null;
  waypoint.hidden = true;
  document.body.classList.remove('engines-on');
}

function alignShipToCamera() {
  if (mobile.matches) return;
  position.x = route.scrollLeft + innerWidth / 2;
  const limit = bounds();
  position.y = Math.max(limit.top, Math.min(limit.bottom, position.y));
  renderShip();
}

function syncShipToCamera() {
  stopFlight();
  alignShipToCamera();
}

function followShip(previousX) {
  route.scrollLeft = followCenteredShip(route.scrollLeft, position.x, previousX,
    innerWidth, route.scrollWidth - route.clientWidth);
}

function leaveWheelCatchup() {
  if (!wheelCatchup) return;
  wheelCatchup = false;
  cancelAnimationFrame(flightFrame);
  flightFrame = 0;
  lastTime = 0;
}

function beginWheelCatchup() {
  if (reducedMotion.matches) { alignShipToCamera(); return; }
  wheelCatchup = true;
  // Keep the ship visible even if a single wheel event jumps a whole screen.
  position.x = Math.max(route.scrollLeft + 60, Math.min(route.scrollLeft + innerWidth - 60, position.x));
  renderShip();
  if (!flightFrame) flightFrame = requestAnimationFrame(fly);
}

function fly(time) {
  const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
  lastTime = time;
  if (wheelCatchup) {
    const target = { x: route.scrollLeft + innerWidth / 2, y: route.clientHeight / 2 };
    const before = Math.hypot(wheelVelocity.x, wheelVelocity.y);
    for (const axis of ['x', 'y']) {
      const next = chaseWheelTarget(position[axis], wheelVelocity[axis], target[axis], dt);
      position[axis] = next.position;
      wheelVelocity[axis] = next.velocity;
    }
    speed = Math.hypot(wheelVelocity.x, wheelVelocity.y);
    if (speed > 2) {
      const angle = Math.atan2(wheelVelocity.y, wheelVelocity.x);
      const turn = Math.atan2(Math.sin(angle - heading), Math.cos(angle - heading));
      heading += Math.max(-4 * dt, Math.min(4 * dt, turn));
    }
    const gap = Math.hypot(target.x - position.x, target.y - position.y);
    document.documentElement.style.setProperty('--flight-thrust', Math.min(1, gap / 80) * (speed >= before ? 1 : .35));
    document.body.classList.toggle('engines-on', gap > 1);
    renderShip();
    if (gap < .5 && speed < 2) {
      position.x = target.x;
      position.y = target.y;
      stopFlight();
      renderShip();
    } else flightFrame = requestAnimationFrame(fly);
    return;
  }
  const previousX = position.x;
  if (coasting) {
    const distance = Math.max(0, speed * dt - .5 * coastDeceleration * dt * dt);
    speed = Math.max(0, speed - coastDeceleration * dt);
    const limit = bounds();
    position.x = Math.max(70, Math.min(route.scrollWidth - 70, position.x + Math.cos(heading) * distance));
    position.y = Math.max(limit.top, Math.min(limit.bottom, position.y + Math.sin(heading) * distance));
    followShip(previousX);
    renderShip();
    if (speed > 1) flightFrame = requestAnimationFrame(fly);
    else stopFlight();
    return;
  }
  if (steeringPointer !== null) {
    // Recompute the world target as the camera moves, even with a stationary
    // pointer. Holding to the right/left keeps flying through the world.
    const rect = route.getBoundingClientRect();
    const limit = bounds();
    const x = Math.max(70, Math.min(route.scrollWidth - 70, route.scrollLeft + Math.max(70, Math.min(innerWidth - 70, pointerX))));
    const y = Math.max(limit.top, Math.min(limit.bottom, pointerY - rect.top));
    heldRest = heldRestPoint(position, { x, y }, { x: pointerX, y: pointerY }, heldRest);
    if (heldRest) {
      speed = 0;
      path = destination = null;
      waypoint.hidden = true;
      document.documentElement.style.setProperty('--flight-thrust', 0);
      document.body.classList.remove('engines-on');
      renderShip();
      flightFrame = requestAnimationFrame(fly);
      return;
    }
    navigateToPoint(x, y);
  }
  const remaining = path.length - travelled;
  const acceleration = menuFlightActive ? 2400 * menuFlightSpeedScale : 750;
  const braking = menuFlightActive ? 2400 * menuFlightSpeedScale : coastDeceleration;
  const cruiseSpeed = menuFlightActive ? 2100 * menuFlightSpeedScale : maximumSpeed;
  updateMenuFlightDeparture(travelled < path.arcLength, Math.cos(heading) * speed * menuFlightDirection);
  updateMenuFlightApproach(remaining, speed, acceleration, route.clientWidth);
  // Tiny course corrections during held steering should not reapply the
  // turnaround speed limit on every frame.
  const turning = travelled < path.arcLength && path.sweep > .12;
  const turnSpeed = turning ? path.radius * (menuFlightActive ? 3.2 : 1.8) : cruiseSpeed;
  // Held targets also brake on approach. Use direct distance to avoid a tiny
  // turning arc keeping the ship at full speed beside the pointer.
  const arrivalDistance = steeringPointer !== null
    ? Math.min(remaining, Math.hypot(destination.x - position.x, destination.y - position.y)) : remaining;
  const arrivalSpeed = Math.max(0, Math.sqrt((braking * dt) ** 2 + 2 * braking * arrivalDistance) - braking * dt);
  const desiredSpeed = steeringPointer !== null || autopilot ? Math.min(cruiseSpeed, turnSpeed * 1.25, arrivalSpeed) : 0;
  const previousSpeed = speed;
  speed += Math.max(-braking * dt, Math.min(acceleration * dt, desiredSpeed - speed));
  const accelerating = desiredSpeed > previousSpeed + 1;
  const thrust = steeringPointer !== null || accelerating ? 1
    : Math.max(0, Math.min(1, (arrivalSpeed / cruiseSpeed - .8) / .2));
  document.documentElement.style.setProperty('--flight-thrust', thrust);
  travelled = Math.min(path.length, travelled + (previousSpeed + speed) * .5 * dt);
  if (steeringPointer === null && path.length - travelled < .5 && speed < 20) {
    travelled = path.length;
    speed = 0;
  }
  const sample = sampleFlightPath(path, travelled);
  position.x = sample.x;
  position.y = sample.y;
  // Keep the angle continuous across +/- pi; never mirror the sprite.
  heading += Math.atan2(Math.sin(sample.heading - heading), Math.cos(sample.heading - heading));
  followShip(previousX);
  renderShip();
  // A held press owns the animation loop, even when this frame reaches its
  // temporary waypoint. The next frame replans using the moving camera.
  if (steeringPointer !== null || ((autopilot || speed > 1) && travelled < path.length)) flightFrame = requestAnimationFrame(fly);
  else stopFlight();
}

function navigateToPoint(x, y) {
  const limit = bounds();
  const target = {
    x: Math.max(70, Math.min(route.scrollWidth - 70, x)),
    y: Math.max(limit.top, Math.min(limit.bottom, y))
  };
  if (Math.hypot(target.x - position.x, target.y - position.y) < 4) return;
  // Replace the course without restarting the animation or dropping momentum.
  // The next frame starts on this curve with the existing speed and heading.
  path = createFlightPath(position, target, heading, { top: 40, bottom: route.clientHeight - 40 });
  travelled = 0;
  destination = target;
  waypoint.hidden = !autopilot;
  document.documentElement.style.setProperty('--flight-thrust', 1);
  document.body.classList.add('engines-on');
  renderShip();
  if (!flightFrame) {
    lastTime = 0;
    flightFrame = requestAnimationFrame(fly);
  }
}

function finishPress(event) {
  suppressClickUntil = performance.now() + 600;
  const click = performance.now() - pressTime < 250 && Math.hypot(event.clientX - pressX, event.clientY - pressY) < 8;
  const rested = heldRest !== null;
  releaseSteering();
  if (rested) { stopFlight(); return; }
  if (click) {
    autopilot = true;
    coasting = false;
    navigateToPoint(pressTarget.x, pressTarget.y);
  } else {
    autopilot = false;
    coasting = true;
  }
}

function releaseSteering() {
  heldRest = null;
  const pointer = steeringPointer;
  steeringPointer = null;
  document.body.classList.remove('engines-on', 'steering');
  waypoint.hidden = true;
  if (pointer !== null && route.hasPointerCapture(pointer)) route.releasePointerCapture(pointer);
}
function beginSteering(event) {
  leaveWheelCatchup();
  clearControlPress();
  document.body.classList.add('steering');
  endMenuFlight();
  autopilot = false;
  coasting = false;
  pressTime = event.timeStamp;
  pressX = event.clientX;
  pressY = event.clientY;
  pressTarget = { x: route.scrollLeft + event.clientX, y: event.clientY - route.getBoundingClientRect().top };
  steeringPointer = event.pointerId;
  pointerX = event.clientX;
  pointerY = event.clientY;
  route.setPointerCapture(event.pointerId);
  const rect = route.getBoundingClientRect();
  navigateToPoint(route.scrollLeft + pointerX, pointerY - rect.top);
  // A press over the ship starts the hold loop without inventing a waypoint.
  if (!flightFrame) {
    lastTime = 0;
    flightFrame = requestAnimationFrame(fly);
  }
}
route.addEventListener('pointerdown', event => {
  if (mobile.matches || event.button !== 0 || !event.isPrimary || steeringPointer !== null) return;
  // Native scrollbar presses belong to the scrollport, never the ship.
  const scrollport = event.target.closest('.station-card, .case-visuals, .contact-crew');
  if (scrollport) {
    const rect = scrollport.getBoundingClientRect();
    const left = rect.left + scrollport.clientLeft;
    const top = rect.top + scrollport.clientTop;
    if (event.clientX < left || event.clientX >= left + scrollport.clientWidth ||
        event.clientY < top || event.clientY >= top + scrollport.clientHeight) return;
  }
  // Editing and native media controls never become flight gestures.
  if (event.target.closest('input, textarea, select, video, audio, iframe, [contenteditable]')) return;
  if (event.target.closest('a, button, summary, [role=button], [role=link]')) {
    pendingControlPress = event;
    controlHoldTimer = setTimeout(() => {
      if (pendingControlPress) beginSteering(pendingControlPress);
    }, 250);
    return;
  }
  event.preventDefault();
  beginSteering(event);
});
window.addEventListener('pointermove', event => {
  const press = pendingControlPress;
  if (!press || press.pointerId !== event.pointerId) return;
  if (Math.hypot(event.clientX - press.clientX, event.clientY - press.clientY) >= 8) beginSteering(press);
}, true);
route.addEventListener('dragstart', event => {
  if (pendingControlPress || steeringPointer !== null) event.preventDefault();
});
window.addEventListener('pointermove', event => {
  if (event.pointerId !== steeringPointer) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
});
window.addEventListener('pointerup', event => {
  if (pendingControlPress?.pointerId === event.pointerId) clearControlPress();
  if (event.pointerId === steeringPointer) finishPress(event);
});
// Some browsers report an empty buttons mask during synthetic/retargeted move
// events. Only release events end a hold; mouseup also covers lost capture.
window.addEventListener('mouseup', event => {
  if (event.button !== 0) return;
  clearControlPress();
  if (steeringPointer !== null) finishPress(event);
});
route.addEventListener('pointercancel', event => {
  clearControlPress();
  if (event.pointerId === steeringPointer) suppressClickUntil = performance.now() + 600;
  if (event.pointerId === steeringPointer) stopFlight();
});
// Losing capture is not a release. Window move/up listeners keep ownership of
// the gesture even when the cursor crosses content or the fixed overlays.
window.addEventListener('blur', stopFlight);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopFlight(); });
document.querySelectorAll('a').forEach(link => link.addEventListener('click', stopFlight));
function restoreLinkedSection(hash) {
  if (!restoreSectionFromHash(hash, stations, { route, mobile: mobile.matches, header })) return;
  syncShipToCamera();
  update();
}
window.addEventListener('hashchange', () => {
  if (stations.some(station => `#${station.id}` === location.hash)) restoreLinkedSection(location.hash);
  else requestAnimationFrame(syncShipToCamera);
});
window.addEventListener('resize', syncShipToCamera);
mobile.addEventListener('change', syncShipToCamera);
// Initial hash navigation can scroll after module initialization. Images can
// finish much later, so this initial alignment must never cancel active input.
window.addEventListener('load', () => {
  if (interactedSinceLoad || flightFrame || steeringPointer !== null || pendingControlPress) return;
  if (initialSectionHash) {
    restoreLinkedSection(initialSectionHash);
    return;
  }
  syncShipToCamera();
});
if (!mobile.matches) renderShip();
enableDesktopWheel(route, {
  isDesktop: () => !mobile.matches,
  onInterrupt: () => { if (!wheelCatchup) stopFlight(); },
  onNavigate: beginWheelCatchup
});

const ship = document.querySelector('.ship');
const transmission = document.querySelector('#transmission');
ship.addEventListener('pointerdown', () => { ship.dataset.pointerFocus = ''; });
let transmissionTimer = 0;
function closeTransmission() {
  clearTimeout(transmissionTimer);
  transmissionTimer = 0;
  transmission.hidden = true;
  ship.setAttribute('aria-expanded', 'false');
}
ship.addEventListener('click', () => {
  const opening = transmission.hidden;
  closeTransmission();
  if (opening) {
    transmission.hidden = false;
    ship.setAttribute('aria-expanded', 'true');
    transmissionTimer = setTimeout(closeTransmission, 2000);
  }
});
function dismissTransmissionOutsideShip(event) {
  if (!ship.contains(event.target)) closeTransmission();
}
document.addEventListener('pointerdown', dismissTransmissionOutsideShip, true);
document.addEventListener('click', dismissTransmissionOutsideShip, true);
document.addEventListener('keydown', event => {
  delete ship.dataset.pointerFocus;
  const navigationButton = event.key === 'ArrowLeft' ? previous : event.key === 'ArrowRight' ? next : null;
  if (navigationButton && !mobile.matches && !event.defaultPrevented && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
    && !event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="tablist"], [role="menu"], [role="dialog"]')
    && !document.querySelector('[role="dialog"]:not([hidden]), dialog[open]')) {
    event.preventDefault();
    if (!event.repeat && !navigationButton.disabled) navigationButton.click();
  }
  if (event.key === 'Escape') stopFlight();
  if (event.key === 'Escape' && !transmission.hidden) {
    closeTransmission();
    ship.focus();
  }
});
restoreLinkedSection(initialSectionHash);
update();

if (!document.body.classList.contains('mobile-flight-experiment')) enableScrollEngines(() => true);

// Menu travel uses a faster cruise/acceleration while preserving curved turns.
function flyToStation(station) {
  const x = station.offsetLeft + route.clientWidth / 2;
  const y = route.clientHeight / 2;
  if (Math.hypot(x - position.x, y - position.y) < 4) return;
  leaveWheelCatchup();
  clearControlPress();
  releaseSteering();
  autopilot = true;
  coasting = false;
  // Nearby centering trips use ordinary flight; reserve warp for long travel.
  beginMenuFlight(x - position.x, route.clientWidth, { waitForTurn: true });
  // Aim the curved approach at the station center, so vertical drift settles
  // naturally during arrival rather than snapping after the flight ends.
  navigateToPoint(x, y);
}
document.addEventListener('click', event => {
  if (mobile.matches || reducedMotion.matches) return;
  const link = event.target.closest('a[href^="#"]');
  const station = link && stations.find(station => `#${station.id}` === link.getAttribute('href'));
  if (!station) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  flyToStation(station);
}, true);
