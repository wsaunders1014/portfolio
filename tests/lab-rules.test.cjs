const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
function load(file) {
  const module = { exports: {} };
  vm.runInNewContext(esbuild.transformSync(fs.readFileSync(path.join(root, file), 'utf8'), { loader: 'ts', format: 'cjs', target: 'es2022' }).code, { module, exports: module.exports, URL, URLSearchParams });
  return module.exports;
}
const { evaluateRule } = load('src/lab/source/rules.ts');
const audience = { cart: ['MAT'], campaign: '?utm_campaign=launch&utm_source=email', assignment: 'treatment' };
test('cart rules distinguish any/all and inclusion/exclusion', () => {
  const rule = { kind: 'cart', skus: ['MAT', 'BAND'], match: 'any', present: true };
  assert.equal(evaluateRule(rule, audience).matches, true);
  assert.equal(evaluateRule({ ...rule, match: 'all' }, audience).matches, false);
  assert.equal(evaluateRule({ ...rule, present: false }, audience).matches, false);
  assert.equal(evaluateRule({ ...rule, match: 'all', present: false }, audience).matches, true);
  assert.equal(evaluateRule({ ...rule, match: 'all' }, { ...audience, cart: ['MAT', 'BAND'] }).matches, true);
});
test('empty rules fail closed, including exclusion; duplicates and whitespace normalize', () => {
  for (const present of [true, false]) assert.equal(evaluateRule({ kind: 'cart', skus: [], match: 'all', present }, audience).matches, false);
  assert.equal(evaluateRule({ kind: 'cart', skus: [' MAT ', 'MAT', ''], match: 'all', present: true }, audience).matches, true);
});
test('campaign values are literal, URL-decoded, and support repeated keys', () => {
  const rule = { kind: 'campaign', key: 'tag', value: 'a.b', operator: 'equals' };
  assert.equal(evaluateRule(rule, { ...audience, campaign: '?tag=axb' }).matches, false);
  assert.equal(evaluateRule(rule, { ...audience, campaign: 'https://example.com/?tag=x&tag=a.b' }).matches, true);
  assert.equal(evaluateRule({ ...rule, value: 'a b' }, { ...audience, campaign: '?tag=a%20b' }).matches, true);
});
test('missing parameters cannot satisfy not-equals; invalid URLs explain failures', () => {
  const rule = { kind: 'campaign', key: 'missing', value: 'value', operator: 'notEquals' };
  assert.equal(evaluateRule(rule, audience).matches, false);
  assert.ok(evaluateRule(rule, { ...audience, campaign: 'not a URL' }).error);
  assert.ok(evaluateRule({ ...rule, key: '' }, audience).error);
  assert.equal(evaluateRule({ ...rule, key: 'utm_campaign', operator: 'exists' }, audience).matches, true);
});
test('experiment fallback only applies to unassigned visitors', () => {
  const rule = { kind: 'experiment', variant: 'treatment', includeUnassigned: false };
  assert.equal(evaluateRule(rule, audience).matches, true);
  assert.equal(evaluateRule({ ...rule, includeUnassigned: true }, { ...audience, assignment: 'control' }).matches, false);
  assert.equal(evaluateRule(rule, { ...audience, assignment: 'off' }).matches, false);
  assert.equal(evaluateRule({ ...rule, includeUnassigned: true }, { ...audience, assignment: 'off' }).matches, true);
});
test('preserved originals match their digests and public excerpts are verbatim', t => {
  const originals = load('src/lab/source/original-snippets.ts').originals;
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'reference/bodi-components/manifest.json'), 'utf8'));
  if (!manifest.every(item => fs.existsSync(path.join(root, 'reference/bodi-components', item.snapshot)))) {
    t.skip('Full source snapshots are local references and are not committed.');
    return;
  }
  for (const [index, item] of manifest.entries()) {
    const bytes = fs.readFileSync(path.join(root, 'reference/bodi-components', item.snapshot));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), item.sha256);
    const [first, last] = item.public_excerpt_lines;
    assert.equal(originals[index === 0 ? 'conditions' : 'carousel'].code, bytes.toString().split(/\r?\n/).slice(first - 1, last).join('\n'));
  }
});
