const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('rear-wheel smoke follows the car with the same timing and a fixed offset', () => {
  const tracks = {};
  const edge = {
    registerCompositionDefn() {},
    A: () => ({A(selector) {
      const properties = tracks[selector] = {};
      let property;
      return {
        P(name, value) { property = properties[name] = {value, tweens: []}; return this; },
        T(...args) { property.tweens.push(args); return this; }
      };
    }})
  };
  vm.runInNewContext(fs.readFileSync('src/projects/rpa/civic/si-animation_edge.js', 'utf8'), {
    jQuery: {}, AdobeEdge: edge
  });
  const car = tracks['${_car-top}'].left;
  const smoke = tracks['${__tire-smoke}'].left;
  assert.ok(Math.abs((smoke.value - car.value) - 31.95) < 1e-9);
  const [carTween] = car.tweens, [smokeTween] = smoke.tweens;
  assert.equal(smokeTween[0], carTween[0]);
  assert.equal(smokeTween[2], carTween[2]);
  assert.equal(smokeTween[3], carTween[3]);
  assert.ok(Math.abs((smokeTween[1] - carTween[1]) - 31.95) < 1e-9);
});

test('Performance initializes the Edge composition before attempting replay', () => {
  const source = fs.readFileSync('src/projects/rpa/civic/p7_fun-to-drive.html', 'utf8');
  const helper = source.slice(source.indexOf('function performanceStage()'), source.indexOf('var oldIndex'));
  let composition, launches = 0;
  const stage = {};
  const edge = {
    getComposition: () => composition,
    launchComposition(id) {
      assert.equal(id, 'EDGE-323978359');
      launches++;
      composition = {getStage: () => stage};
    }
  };
  const context = {window: {AdobeEdge: edge}};
  vm.runInNewContext(helper, context);
  assert.equal(context.performanceStage(), stage);
  assert.equal(context.performanceStage(), stage);
  assert.equal(launches, 1);
  context.window.AdobeEdge = {};
  assert.equal(context.performanceStage(), undefined);
});
