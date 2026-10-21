const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function extract(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0);
  let end = source.indexOf('{', start), depth = 1;
  for (end++; depth; end++) {
    if (source[end] === '{') depth++;
    if (source[end] === '}') depth--;
  }
  return source.slice(start, end);
}

for (const demo of ['si', 'sedan']) {
  const source = fs.readFileSync(`src/projects/rpa/civic/${demo}_parallax/js/main.js`, 'utf8');
  test(`${demo}: wheel deltas respect direction, units and speed limit`, () => {
    const context = vm.createContext({window: {innerHeight: 732}});
    vm.runInContext(extract(source, 'wheelSteps'), context);
    for (const [event, expected] of [
      [{deltaY: 100}, 165], [{deltaY: -100}, -165],
      [{wheelDelta: 120}, -198], [{detail: 3}, 79.2],
      [{deltaY: 3, deltaMode: 1}, 79.2],
      [{deltaY: 1, deltaMode: 2}, 320], [{deltaY: 0}, 0]
    ]) assert.ok(Math.abs(context.wheelSteps(event) - expected) < 1e-9);
  });
  test(`${demo}: exact keyframes restore original values`, () => {
    const context = vm.createContext({yPagePosition: 0});
    vm.runInContext(extract(source, 'propertyValue'), context);
    assert.equal(context.propertyValue('top', 0, 0, 0, 0), 0);
    assert.equal(context.propertyValue('top', 600, 600, -803, -803), -803);
    context.yPagePosition = 300;
    assert.equal(context.propertyValue('top', 0, 600, 0, -803), -401.5);
  });
  test(`${demo}: slide endpoints use rendered offsets without changing timelines`, () => {
    const original = [{selector: '#verticalScrollArea', styles: [{name: 'top', values: [0, -803, -4018]}]}];
    const context = vm.createContext({
      original_animations: original,
      animations: JSON.parse(JSON.stringify(original)),
      document: {}, ORIGINAL_WIDTH: 1152, console: {log() {}},
      $: () => ({width: () => 982, height: () => 732,
        eq: index => ({length: 1, 0: {offsetTop: index * 731}})})
    });
    vm.runInContext(extract(source, 'updateAnimationValues'), context);
    context.updateAnimationValues();
    assert.deepEqual(Array.from(context.animations[0].styles[0].values), [0, -731, -3655]);
    assert.deepEqual(original[0].styles[0].values, [0, -803, -4018]);
  });
}
