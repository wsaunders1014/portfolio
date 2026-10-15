const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup() {
  const handlers = {};
  const classes = new Set();
  const styles = {};
  let now = 1000;
  let pending;
  const window = { scrollY: 0, innerWidth: 390, addEventListener(type, fn) { handlers[type] = fn; } };
  const context = vm.createContext({ window, performance: { now: () => now },
    matchMedia: query => ({ matches: query.includes('max-width') }),
    document: { body: { classList: { add: c => classes.add(c), remove: c => classes.delete(c) } },
      documentElement: { style: { setProperty: (key, value) => { styles[key] = value; } } }, addEventListener() {} },
    setTimeout(fn) { pending = fn; return 1; }, clearTimeout() { pending = null; } });
  vm.runInContext(fs.readFileSync('src/js/mobile-scroll.js', 'utf8').replaceAll('export ', '') + '\nenableScrollEngines(() => true);', context);
  const touch = y => ({ touches: [{ identifier: 7, clientY: y }], target: { closest: () => null } });
  return { handlers, classes, styles, window, touch, tick(ms) { now += ms; }, expire() { pending?.(); } };
}

test('a held drag survives browser chrome resizing and repeated slow movement', () => {
  const s = setup();
  s.handlers.touchstart(s.touch(500));
  s.tick(1200);
  s.handlers.touchmove(s.touch(480));
  s.handlers.resize();
  s.tick(500);
  s.window.scrollY = 2;
  s.handlers.scroll();
  assert.ok(s.classes.has('scroll-engines-on'));
  assert.equal(s.styles['--scroll-thrust'], '1.000');
  s.handlers.touchmove(s.touch(450));
  assert.equal(s.styles['--scroll-thrust'], '1.000');
});

test('native touch cancellation preserves the burst, then idle clears it', () => {
  const s = setup();
  s.handlers.touchstart(s.touch(500));
  s.handlers.touchmove(s.touch(470));
  s.handlers.touchcancel();
  assert.ok(s.classes.has('scroll-engines-on'));
  s.window.scrollY = 30;
  s.tick(16);
  s.handlers.scroll();
  assert.equal(s.styles['--scroll-thrust'], '1.000');
  s.expire();
  assert.ok(!s.classes.has('scroll-engines-on'));
});

test('a new drag reignites fully after the previous swipe fades', () => {
  const s = setup();
  s.handlers.touchstart(s.touch(500));
  s.handlers.touchmove(s.touch(450));
  s.handlers.touchend({ touches: [] });
  s.expire();
  s.tick(1000);
  s.handlers.touchstart(s.touch(400));
  s.handlers.touchmove(s.touch(420));
  assert.equal(s.styles['--scroll-thrust'], '1.000');
  assert.equal(s.styles['--mobile-heading'], `${-Math.PI / 2}rad`);
});
