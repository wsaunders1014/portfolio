const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup() {
  let handler;
  let interrupted = 0;
  let navigated = 0;
  let desktop = true;
  const route = { scrollLeft: 100, scrollWidth: 3000, clientWidth: 1000,
    addEventListener(type, fn, options) { assert.equal(type, 'wheel'); assert.equal(options.passive, false); handler = fn; } };
  const context = vm.createContext({ getComputedStyle: element => ({ overflowY: element.overflow || 'visible' }) });
  vm.runInContext(fs.readFileSync('src/js/desktop-wheel.js', 'utf8').replace('export ', ''), context);
  context.enableDesktopWheel(route, { isDesktop: () => desktop, onInterrupt: () => interrupted++, onNavigate: () => navigated++ });
  return { route, counts: () => ({ interrupted, navigated }), mobile: () => { desktop = false; },
    wheel(values = {}) {
      const event = { target: route, deltaX: 0, deltaY: 100, deltaMode: 0, prevented: false,
        preventDefault() { this.prevented = true; }, ...values };
      handler(event); return event;
    } };
}

test('only horizontal wheels navigate the route without doubling diagonal input', () => {
  const s = setup();
  assert.equal(s.wheel().prevented, false);
  assert.equal(s.route.scrollLeft, 100);
  s.wheel({ deltaX: 80, deltaY: 0 });
  assert.equal(s.route.scrollLeft, 180);
  s.wheel({ deltaX: -50, deltaY: -20 });
  assert.equal(s.route.scrollLeft, 130);
  assert.deepEqual(s.counts(), { interrupted: 2, navigated: 2 });
});

test('nested vertical content retains native wheel ownership, including at its edges', () => {
  const s = setup();
  const panel = { parentElement: s.route, overflow: 'auto', scrollHeight: 900, clientHeight: 400, scrollTop: 500 };
  const child = { parentElement: panel };
  assert.equal(s.wheel({ target: child }).prevented, false);
  assert.equal(s.route.scrollLeft, 100);
  s.wheel({ target: child, deltaX: -80, deltaY: 0 });
  assert.equal(panel.scrollTop, 500);
  assert.equal(s.route.scrollLeft, 20);
  // Small cross-axis noise must not turn a vertical reading gesture sideways.
  assert.equal(s.wheel({ target: child, deltaX: 5, deltaY: -60 }).prevented, false);
  assert.equal(s.route.scrollLeft, 20);
});

test('vertical input over nonoverflowing content is native; horizontal units and bounds work', () => {
  const s = setup();
  const panel = { parentElement: s.route, overflow: 'auto', scrollHeight: 400, clientHeight: 400 };
  s.wheel({ target: panel, deltaY: 3, deltaMode: 1 });
  assert.equal(s.route.scrollLeft, 100);
  assert.deepEqual(s.counts(), { interrupted: 0, navigated: 0 });
  s.wheel({ target: panel, deltaX: 3, deltaY: 0, deltaMode: 1 });
  assert.equal(s.route.scrollLeft, 148);
  s.wheel({ deltaX: 1, deltaY: 0, deltaMode: 2 });
  assert.equal(s.route.scrollLeft, 1148);
  s.wheel({ deltaX: 10000, deltaY: 0 });
  assert.equal(s.route.scrollLeft, 2000);
  s.wheel({ deltaX: -10000, deltaY: 0 });
  assert.equal(s.route.scrollLeft, 0);
});

test('zoom gestures, handled events, and mobile scrolling are untouched', () => {
  const s = setup();
  for (const values of [{ ctrlKey: true }, { metaKey: true }, { defaultPrevented: true }]) {
    assert.equal(s.wheel({ deltaX: 100, deltaY: 0, ...values }).prevented, false);
  }
  s.mobile();
  assert.equal(s.wheel({ deltaX: 100, deltaY: 0 }).prevented, false);
  assert.equal(s.route.scrollLeft, 100);
  assert.deepEqual(s.counts(), { interrupted: 0, navigated: 0 });
});
