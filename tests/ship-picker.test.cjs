const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(saved = 'enterprise', blocked = false) {
  const decodes = [];
  const events = {};
  const image = { complete: true, naturalWidth: 432,
    decode: () => new Promise((resolve, reject) => decodes.push({ resolve, reject })) };
  const source = {};
  const ship = { dataset: {}, append() {}, querySelector: selector => selector === 'img' ? image : source };
  const panel = { querySelectorAll: () => [], addEventListener() {} };
  const toggle = { addEventListener() {} };
  vm.runInNewContext(fs.readFileSync('src/js/ship-picker.js', 'utf8'), {
    document: { querySelector: selector => ({ '.ship': ship, '#ship-picker': panel, '#ship-picker-toggle': toggle })[selector],
      createElement: () => ({ setAttribute() {} }), addEventListener() {} },
    window: { addEventListener(type, fn) { events[type] = fn; } },
    localStorage: { getItem() { if (blocked) throw Error('Storage unavailable'); return saved; } }
  });
  return { ship, image, source, decodes, events };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test('saved ship stays hidden until its selected image has decoded', async () => {
  const s = setup();
  assert.equal(s.image.src, 'img/enterprise-photo.webp');
  assert.equal(s.source.srcset, s.image.src);
  assert.equal(s.ship.dataset.ready, undefined);
  s.decodes[0].resolve();
  await flush();
  assert.equal(s.ship.dataset.ready, 'true');
});

test('storage unavailable still reveals the default after decode', async () => {
  const s = setup(null, true);
  assert.equal(s.image.src, 'img/serenity.webp');
  s.decodes[0].resolve();
  await flush();
  assert.equal(s.ship.dataset.ready, 'true');
});

test('stale decodes cannot reveal a newer selection', async () => {
  const s = setup();
  s.events.storage({ key: 'portfolio.ship.v1', newValue: 'smuggler' });
  s.decodes[0].resolve();
  await flush();
  assert.equal(s.ship.dataset.ready, undefined);
  s.decodes[1].resolve();
  await flush();
  assert.equal(s.ship.dataset.design, 'smuggler');
  assert.equal(s.ship.dataset.ready, 'true');
});

test('failed saved image falls back to Serenity before being revealed', async () => {
  const s = setup();
  s.decodes[0].reject(Error('Missing image'));
  await flush();
  assert.equal(s.image.src, 'img/serenity.webp');
  assert.equal(s.ship.dataset.ready, undefined);
  s.decodes[1].resolve();
  await flush();
  assert.equal(s.ship.dataset.ready, 'true');
});
