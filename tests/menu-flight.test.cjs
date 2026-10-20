const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/js/menu-flight.js'), 'utf8');
let instance = 0;
const freshFlight = () => import(`data:text/javascript,${encodeURIComponent(source + `\n// instance ${instance++}`)}`);
const options = { force: true, waitForTurn: true };

test('trip speed scales proportionally with distance in either direction, with a safe cap', async () => {
  const flight = await freshFlight();
  for (const viewport of [844, 1440]) {
    for (const direction of [-1, 1]) {
      for (const [screens, scale] of [[1, 1], [2, 1], [4, 2], [10, 5], [30, 6]]) {
        flight.beginMenuFlight(direction * viewport * screens, viewport, { force: true });
        assert.equal(flight.menuFlightSpeedScale, scale);
      }
    }
  }
});

test('arrival keeps the departure scale; nearby retargets and stopping reset it', async () => {
  const flight = await freshFlight();
  flight.beginMenuFlight(14400, 1440, options);
  flight.updateMenuFlightApproach(1000, 4000, 12000, 1440);
  assert.equal(flight.menuFlightSpeedScale, 5);
  flight.beginMenuFlight(500, 1440);
  assert.equal(flight.menuFlightSpeedScale, 1);
  flight.beginMenuFlight(14400, 1440, options);
  flight.endMenuFlight();
  assert.equal(flight.menuFlightSpeedScale, 1);
});

test('held mobile cruising can enable trails without distance-based speed', async () => {
  const flight = await freshFlight();
  flight.beginMenuFlight(30000, 844, { force: true, scaleWithDistance: false });
  assert.equal(flight.menuFlightActive, true);
  assert.equal(flight.menuFlightSpeedScale, 1);
});

test('a nearby centering trip clears warp even when retargeted from a cruise', async () => {
  const flight = await freshFlight();
  flight.beginMenuFlight(5000, 1440, options);
  flight.updateMenuFlightDeparture(false, 1500);
  flight.beginMenuFlight(500, 1440, { waitForTurn: true });
  assert.equal(flight.menuFlightActive, false);
  assert.equal(flight.menuFlightCruising, false);
  assert.equal(flight.menuFlightTrailStrength, 0);
});

test('extending a cruising journey keeps trails armed and restores their range', async () => {
  const flight = await freshFlight();
  flight.beginMenuFlight(5000, 1440, options);
  flight.updateMenuFlightDeparture(false, 1500);
  flight.updateMenuFlightApproach(1200, 1500, 2400, 1440);
  assert.ok(flight.menuFlightTrailStrength < 1);
  flight.beginMenuFlight(10000, 1440, options);
  assert.equal(flight.menuFlightCruising, true);
  assert.equal(flight.menuFlightTrailStrength, 1);
  flight.beginMenuFlight(14000, 1440, options);
  assert.equal(flight.menuFlightCruising, true);
});

test('reversing a cruise waits for the turn before enabling trails', async () => {
  const flight = await freshFlight();
  flight.beginMenuFlight(5000, 1440, options);
  flight.updateMenuFlightDeparture(false, 1500);
  flight.beginMenuFlight(-4000, 1440, options);
  assert.equal(flight.menuFlightDirection, -1);
  assert.equal(flight.menuFlightCruising, false);
  flight.updateMenuFlightDeparture(true, 200);
  assert.equal(flight.menuFlightCruising, false);
  flight.updateMenuFlightDeparture(false, 200);
  assert.equal(flight.menuFlightCruising, true);
});

test('retargeting before departure does not bypass the turn delay', async () => {
  const flight = await freshFlight();
  flight.beginMenuFlight(5000, 1440, options);
  flight.beginMenuFlight(10000, 1440, options);
  assert.equal(flight.menuFlightCruising, false);
  flight.endMenuFlight();
  flight.beginMenuFlight(5000, 1440, options);
  assert.equal(flight.menuFlightCruising, false);
});
