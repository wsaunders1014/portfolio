const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/projects/nick/dayofplay/js/scripts.js', 'utf8');
for (const [button, flag, show, close] of [
  ['gallery-btn', 'galleryOpen', 'showGallery', 'closeGallery'],
  ['starplayer-btn', 'starPlayerOpen', 'showStarPlayer', 'closeStarPlayer']
]) {
  test(`${button} opens and closes using the existing Back behavior`, () => {
    const start = source.indexOf(`$("#${button}").on(isTouch, function(){`);
    assert.ok(start >= 0);
    const handlerSource = source.slice(start, source.indexOf('\n});', start) + 4);
    let handler;
    const calls = [];
    const element = {};
    const context = {
      isTouch: 'click', [flag]: false,
      $: () => ({on: (_event, callback) => handler = callback}),
      trackLanding: () => calls.push('landing'),
      [show]: function() { assert.equal(this, element); context[flag] = true; calls.push('open'); },
      [close]: () => { context[flag] = false; calls.push('close'); }
    };
    vm.runInNewContext(handlerSource, context);
    handler.call(element);
    handler.call(element);
    handler.call(element);
    assert.deepEqual(calls, ['open', 'landing', 'close', 'open']);
  });
}
