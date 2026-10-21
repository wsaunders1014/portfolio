const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/js/wheel-chase.js', 'utf8');
const modulePromise = import(`data:text/javascript,${encodeURIComponent(source)}`);

test('ship initially lags, catches center smoothly, and does not overshoot a fixed target', async () => {
  const { chaseWheelTarget } = await modulePromise;
  let position = 500, velocity = 0;
  for (let i = 0; i < 240; i++) {
    const next = chaseWheelTarget(position, velocity, 800, 1 / 60);
    assert.ok(next.position >= position && next.position <= 800);
    position = next.position; velocity = next.velocity;
    if (i === 0) assert.ok(position < 505);
  }
  assert.ok(Math.abs(position - 800) < .01);
  assert.ok(Math.abs(velocity) < .01);
});

test('retargeting preserves world position and momentum in either direction', async () => {
  const { chaseWheelTarget } = await modulePromise;
  for (const sign of [-1, 1]) {
    const first = chaseWheelTarget(500, 0, 500 + sign * 300, .1);
    const next = chaseWheelTarget(first.position, first.velocity, 500 + sign * 600, .016);
    assert.ok(sign * (next.position - first.position) > 0);
    assert.ok(Math.abs(next.velocity) > Math.abs(first.velocity));
  }
});

test('spring motion is consistent across frame rates', async () => {
  const { chaseWheelTarget } = await modulePromise;
  const run = fps => {
    let state = { position: 0, velocity: 0 };
    for (let i = 0; i < fps; i++) state = chaseWheelTarget(state.position, state.velocity, 600, 1 / fps);
    return state.position;
  };
  assert.ok(Math.abs(run(30) - run(144)) < .0001);
});

test('mouse handoff keeps camera still until the ship crosses center, then follows', async () => {
  const { followCenteredShip } = await modulePromise;
  assert.equal(followCenteredShip(400, 800, 750, 1000, 3000), 400);
  assert.equal(followCenteredShip(400, 950, 800, 1000, 3000), 450);
  assert.equal(followCenteredShip(400, 1000, 1100, 1000, 3000), 400);
  assert.equal(followCenteredShip(400, 850, 1000, 1000, 3000), 350);
  assert.equal(followCenteredShip(400, 750, 800, 1000, 3000), 350);
  assert.equal(followCenteredShip(400, 1100, 1000, 1000, 3000), 500);
  assert.equal(followCenteredShip(0, 200, 250, 1000, 3000), 0);
  assert.equal(followCenteredShip(2900, 4000, 3900, 1000, 3000), 3000);
});
