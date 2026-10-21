const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const helper = import(`data:text/javascript,${encodeURIComponent(fs.readFileSync('src/js/held-flight.js', 'utf8'))}`);

test('arrival and a press over the ship latch a stable resting pointer', async () => {
  const { heldRestPoint } = await helper;
  assert.deepEqual(heldRestPoint({ x: 500, y: 400 }, { x: 510, y: 400 }, { x: 510, y: 400 }, null), { x: 510, y: 400 });
  assert.ok(heldRestPoint({ x: 500, y: 400 }, { x: 500, y: 400 }, { x: 500, y: 400 }, null));
});

test('small jitter retains the original latch, rather than accumulating movement', async () => {
  const { heldRestPoint } = await helper;
  const resting = { x: 500, y: 400 };
  assert.equal(heldRestPoint({ x: 500, y: 400 }, { x: 508, y: 405 }, { x: 508, y: 405 }, resting), resting);
  assert.equal(heldRestPoint({ x: 500, y: 400 }, { x: 509, y: 405 }, { x: 509, y: 405 }, resting), resting);
});

test('moving beyond the threshold toward a new waypoint resumes flight', async () => {
  const { heldRestPoint } = await helper;
  assert.equal(heldRestPoint({ x: 500, y: 400 }, { x: 550, y: 430 }, { x: 550, y: 430 }, { x: 500, y: 400 }), null);
  assert.equal(heldRestPoint({ x: 500, y: 400 }, { x: 700, y: 400 }, { x: 700, y: 400 }, null), null);
});
