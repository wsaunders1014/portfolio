const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { minifyAsset } = require('../scripts/minify-assets.cjs');

test('minification preserves globals shared between classic scripts', () => {
  const source = '/*! License stays */\nvar shared = 2; function legacyAdd(value) { return shared + value; }';
  const output = minifyAsset(Buffer.from(source), 'legacy.js').toString();
  const context = vm.createContext({});
  vm.runInContext(output, context);
  assert.equal(vm.runInContext('legacyAdd(3)', context), 5);
  assert.ok(output.includes('License stays'));
  assert.ok(output.length < source.length);
});

test('browser module exports and relative import paths survive', async () => {
  const output = minifyAsset(Buffer.from('export const value = 7;\nexport function calculate(input) { return value * input; }'), 'module.js');
  const module = await import(`data:text/javascript,${encodeURIComponent(output.toString())}`);
  assert.equal(module.calculate(3), 21);
  const importing = minifyAsset(Buffer.from("import { value } from './module.js'; export { value };"), 'importer.js');
  assert.match(importing.toString(), /\.\/module\.js/);
});

test('CSS keeps relative assets and custom properties; other files are unchanged', () => {
  const css = '/* comment */\n.ship { --thrust: 0.5; background: url(../img/ship.webp); opacity: var(--thrust); }';
  const output = minifyAsset(Buffer.from(css), 'flight.css').toString();
  assert.ok(output.length < css.length);
  assert.match(output, /\.\.\/img\/ship\.webp/);
  assert.match(output, /var\(--thrust\)/);
  const html = Buffer.from('<p>Keep the HTML intact</p>');
  assert.equal(minifyAsset(html, 'index.html'), html);
});
