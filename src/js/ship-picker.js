const ship = document.querySelector('.ship');
const panel = document.querySelector('#ship-picker');
const toggle = document.querySelector('#ship-picker-toggle');
const storageKey = 'portfolio.ship.v1';
// Keep the auxiliary exhaust attached to the rotating ship, not the camera.
for (const family of ['serenity-wing-jet', 'enterprise-nacelle-jet', 'winnebago-wing-jet']) {
  for (const side of ['upper', 'lower']) {
    const jet = document.createElement('span');
    jet.className = `${family} ${family}-${side}`;
    jet.setAttribute('aria-hidden', 'true');
    ship.append(jet);
  }
}
const designs = {
  winnebago: { src: 'img/eagle-5.png', width: 1536, height: 1024 },
  serenity: { src: 'img/serenity.png', width: 185, height: 100 },
  smuggler: { src: 'img/millennium-falcon.png', width: 1536, height: 1024 },
  enterprise: { src: 'img/enterprise-photo.png', width: 1280, height: 609 }
};
let preference = null;
try {
  const stored = localStorage.getItem(storageKey);
  const saved = stored === 'pixel' ? 'enterprise' : stored === 'explorer' ? 'winnebago' : stored;
  if (Object.hasOwn(designs, saved)) preference = saved;
} catch { /* Ship selection still works when browser storage is unavailable. */ }
function apply() {
  const selected = preference || 'serenity';
  const design = designs[selected];
  ship.querySelector('source').srcset = design.src;
  const image = ship.querySelector('img');
  image.src = design.src;
  image.width = design.width;
  image.height = design.height;
  ship.dataset.design = selected;
  panel.querySelectorAll('[data-ship]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.ship === selected));
  });
}
function close(restoreFocus = false) {
  panel.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  if (!panel.hidden) { close(); return; }
  panel.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  panel.querySelector('[aria-pressed="true"]').focus();
});
panel.addEventListener('click', event => {
  const button = event.target.closest('[data-ship]');
  if (button && Object.hasOwn(designs, button.dataset.ship)) {
    preference = button.dataset.ship;
    try { localStorage.setItem(storageKey, preference); } catch { /* Optional persistence. */ }
    apply();
    close(true);
  }
  if (event.target.closest('[data-ship-close]')) close(true);
  if (event.target.closest('[data-ship-default]')) {
    preference = null;
    try { localStorage.removeItem(storageKey); } catch { /* Optional persistence. */ }
    apply();
    close(true);
  }
});
document.addEventListener('pointerdown', event => {
  if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); close(true); }
});
window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  const selected = event.newValue === 'pixel' ? 'enterprise' : event.newValue === 'explorer' ? 'winnebago' : event.newValue;
  preference = Object.hasOwn(designs, selected) ? selected : null;
  apply();
});
apply();
