// Shared travel intent: ordinary scrolling and manual flight never enable warp.
export let menuFlightActive = false;
export let menuFlightTrailStrength = 0;
export let menuFlightDirection = 1;
export let menuFlightCruising = false;
export function beginMenuFlight(distance, viewport, { force = false, waitForTurn = false } = {}) {
  menuFlightActive = Math.abs(distance) >= (force ? 4 : viewport * 1.25);
  menuFlightDirection = Math.sign(distance) || 1;
  menuFlightTrailStrength = menuFlightActive ? 1 : 0;
  menuFlightCruising = menuFlightActive && !waitForTurn;
}
// Desktop departure is armed only after the curved turn is over and the ship
// is moving toward the destination. Once cruising, retain the arrival fade.
export function updateMenuFlightDeparture(turning, forwardSpeed) {
  if (menuFlightActive && !turning && forwardSpeed > 0) menuFlightCruising = true;
}
// Anticipate arrival independently of ship speed, then keep fading monotonically.
export function updateMenuFlightApproach(remaining, speed, braking, viewport) {
  if (!menuFlightActive) return;
  const stoppingDistance = speed * speed / (2 * braking);
  const fadeDistance = Math.max(viewport * .75, speed * 1.1);
  const t = Math.max(0, Math.min(1, (Math.abs(remaining) - stoppingDistance) / fadeDistance));
  menuFlightTrailStrength = Math.min(menuFlightTrailStrength, t * t * (3 - 2 * t));
}
export function endMenuFlight() {
  menuFlightActive = false;
  menuFlightTrailStrength = 0;
  menuFlightCruising = false;
}
