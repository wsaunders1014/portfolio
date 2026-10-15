let nextDrift = 0;
export function updateMobileDrift() {
  const now = performance.now();
  if (now < nextDrift || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  nextDrift = now + 350 + Math.random() * 300;
  document.documentElement.style.setProperty('--mobile-drift', `${(Math.random() * 5 - 2.5).toFixed(2)}px`);
}
export function resetMobileDrift() {
  nextDrift = 0;
  document.documentElement.style.setProperty('--mobile-drift', '0px');
}

// Touch starts thrust immediately; scroll events sustain it through swipe momentum.
export function enableScrollEngines(isAvailable) {
  let touchId = null;
  let fingerY = 0;
  let pageY = window.scrollY;
  let timer = 0;
  let active = false;
  let sampleTime = performance.now();
  let peakSpeed = 0;
  let burstUntil = 0;
  const enabled = () => matchMedia('(max-width: 760px)').matches && isAvailable();
  const clear = () => {
    clearTimeout(timer);
    timer = 0;
    touchId = null;
    if (active) {
      document.body.classList.remove('scroll-engines-on');
      resetMobileDrift();
    }
    active = false;
  };
  const settle = () => {
    clearTimeout(timer);
    // A finger held in place stays in control until lifted.
    if (touchId === null) timer = setTimeout(clear, 220);
  };
  const ignite = (delta, strength = 1) => {
    updateMobileDrift();
    const visibleStrength = performance.now() < burstUntil ? Math.max(.65, strength) : strength;
    document.documentElement.style.setProperty('--scroll-thrust', visibleStrength.toFixed(3));
    document.documentElement.style.setProperty('--mobile-heading', `${delta < 0 ? -Math.PI / 2 : Math.PI / 2}rad`);
    document.body.classList.add('scroll-engines-on');
    active = true;
    settle();
  };
  window.addEventListener('touchstart', event => {
    if (!enabled()) { clear(); return; }
    if (event.touches.length !== 1 || event.target.closest('.mobile-flight-dock, button, input, textarea, select, [contenteditable]')) { clear(); return; }
    clearTimeout(timer);
    const touch = event.touches[0];
    touchId = touch.identifier;
    fingerY = touch.clientY;
    peakSpeed = 0;
    sampleTime = performance.now();
    pageY = window.scrollY;
  }, { passive: true });
  window.addEventListener('touchmove', event => {
    if (touchId === null) return;
    if (!enabled() || event.touches.length !== 1) { clear(); return; }
    const touch = [...event.touches].find(touch => touch.identifier === touchId);
    if (!touch) { clear(); return; }
    const delta = fingerY - touch.clientY;
    if (Math.abs(delta) < 2) return;
    fingerY = touch.clientY;
    burstUntil = performance.now() + 110;
    ignite(delta);
  }, { passive: true });
  window.addEventListener('touchend', event => {
    if (touchId !== null && ![...event.touches].some(touch => touch.identifier === touchId)) {
      touchId = null;
      settle();
    }
  }, { passive: true });
  window.addEventListener('scroll', () => {
    const now = performance.now();
    const delta = window.scrollY - pageY;
    const speed = Math.abs(delta) * 1000 / Math.max(8, now - sampleTime);
    sampleTime = now;
    pageY = window.scrollY;
    if (!enabled()) { clear(); return; }
    if (Math.abs(delta) < .5) return;
    peakSpeed = Math.max(peakSpeed, speed);
    // Cut thrust in the slower part of a swipe, leaving a visible coast.
    const cutoff = Math.max(120, peakSpeed * .35);
    const fullThrust = Math.max(cutoff + 180, peakSpeed * .8);
    const strength = touchId !== null ? 1 : Math.max(0, Math.min(1, (speed - cutoff) / (fullThrust - cutoff)));
    ignite(delta, strength);
  }, { passive: true });
  window.addEventListener('touchcancel', clear, { passive: true });
  window.addEventListener('blur', clear);
  window.addEventListener('resize', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
}
