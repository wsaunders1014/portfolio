const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(angle = 0) {
  const handlers = {};
  const nodes = new Set();
  let pending;
  let clock = 100;
  const reduced = { matches: false, addEventListener() {} };
  const ship = { offsetWidth: 100, offsetHeight: 50,
    getBoundingClientRect: () => ({ left: 100, top: 100, width: 100, height: 50 }) };
  const listen = (type, fn) => { (handlers[type] ||= []).push(fn); };
  const document = { hidden: false, querySelector: () => ship, addEventListener: listen,
    createElement: () => ({ style: {}, setAttribute() {}, append(node) { nodes.add(node); }, remove() { nodes.delete(this); } }),
    body: { append() {} } };
  const context = vm.createContext({ document, window: { addEventListener: listen },
    innerWidth: 600, innerHeight: 400, matchMedia: () => reduced,
    performance: { now: () => clock }, getComputedStyle: () => ({ transform: 'matrix' }),
    DOMMatrixReadOnly: class { constructor() { this.a = Math.cos(angle); this.b = Math.sin(angle); } },
    requestAnimationFrame(fn) { pending = fn; return 1; }, cancelAnimationFrame() { pending = null; } });
  const geometry = fs.readFileSync('src/js/laser-geometry.js', 'utf8').replace('export ', '');
  const source = fs.readFileSync('src/js/ship-lasers.js', 'utf8').replace(/^import .*\n/, '');
  vm.runInContext(geometry + '\n' + source, context);
  return { nodes, reduced, context,
    event(type, extra = {}) { for (const fn of handlers[type] || []) fn({ button: 2, target: { closest: () => false }, preventDefault() {}, ...extra }); },
    tick(ms = 16) { clock += ms; const fn = pending; pending = null; fn?.(clock); },
    running: () => Boolean(pending) };
}

test('a quick right click fires immediately and every offscreen shot is removed', () => {
  const s = setup();
  s.event('mousedown');
  s.event('mouseup');
  assert.equal(s.nodes.size, 2);
  for (let i = 0; i < 100; i++) s.tick();
  assert.equal(s.nodes.size, 0);
  assert.equal(s.running(), false);
});

test('holding fires repeatedly; blur removes shots and stops the loop', () => {
  const s = setup();
  s.event('mousedown');
  s.tick();
  s.tick(180);
  assert.equal(s.nodes.size, 4);
  s.event('blur');
  assert.equal(s.nodes.size, 0);
  assert.equal(s.running(), false);
});

test('right fire works during left steering even without compatibility mouse events', () => {
  const s = setup();
  s.event('pointerdown', { pointerType: 'mouse', button: 0, buttons: 1 });
  assert.equal(s.nodes.size, 0);
  s.event('pointermove', { pointerType: 'mouse', button: 2, buttons: 3 });
  assert.equal(s.nodes.size, 2);
  // Compatibility events, when present, must not duplicate the first burst.
  s.event('mousedown');
  assert.equal(s.nodes.size, 2);
  s.tick();
  s.tick(180);
  assert.equal(s.nodes.size, 4);
  // Releasing right leaves left steering held and stops new shots.
  s.event('pointermove', { pointerType: 'mouse', button: 2, buttons: 1 });
  for (let i = 0; i < 100; i++) s.tick();
  assert.equal(s.nodes.size, 0);
  assert.equal(s.running(), false);
});

test('releasing left while right remains held keeps firing', () => {
  const s = setup();
  s.event('pointerdown', { pointerType: 'mouse', button: 2, buttons: 2 });
  s.event('pointermove', { pointerType: 'mouse', button: 0, buttons: 3 });
  s.event('pointermove', { pointerType: 'mouse', button: 0, buttons: 2 });
  s.tick();
  s.tick(180);
  assert.equal(s.nodes.size, 4);
  s.event('pointerup', { pointerType: 'mouse', button: 2, buttons: 0 });
  for (let i = 0; i < 100; i++) s.tick();
  assert.equal(s.running(), false);
});

test('shots follow vertical and diagonal headings and are eventually removed', () => {
  for (const angle of [Math.PI / 2, -Math.PI / 2, Math.PI, Math.PI / 4]) {
    const s = setup(angle);
    s.event('mousedown');
    s.event('mouseup');
    assert.ok([...s.nodes][0].style.transform.includes(`rotate(${Math.atan2(Math.sin(angle), Math.cos(angle))}rad)`));
    for (let i = 0; i < 100; i++) s.tick();
    assert.equal(s.nodes.size, 0);
  }
});

test('links, left clicks, and reduced-motion settings do not fire', () => {
  const s = setup();
  s.event('mousedown', { button: 0 });
  s.event('mousedown', { target: { closest: () => true } });
  s.reduced.matches = true;
  s.event('mousedown');
  assert.equal(s.nodes.size, 0);
});

test('cleanup waits until the entire rotated beam and glow have exited', () => {
  const s = setup();
  assert.equal(vm.runInContext('laserOutsideViewport(615, 100, 0, 600, 400)', s.context), false);
  assert.equal(vm.runInContext('laserOutsideViewport(623, 100, 0, 600, 400)', s.context), true);
  assert.equal(vm.runInContext('laserOutsideViewport(100, -20, Math.PI / 2, 600, 400)', s.context), false);
  assert.equal(vm.runInContext('laserOutsideViewport(100, -23, Math.PI / 2, 600, 400)', s.context), true);
});
