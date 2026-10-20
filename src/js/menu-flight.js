// Shared travel intent: ordinary scrolling and manual flight never enable warp.
export let menuFlightActive = false;
export let menuFlightTrailStrength = 0;
export let menuFlightDirection = 1;
export let menuFlightCruising = false;
export let menuFlightSpeedScale = 1;
export function beginMenuFlight(distance, viewport, { force = false, waitForTurn = false, scaleWithDistance = true } = {}) {
  const direction = Math.sign(distance) || 1;
  const continuingCruise = menuFlightActive && menuFlightCruising && direction === menuFlightDirection;
  menuFlightActive = Math.abs(distance) >= (force ? 4 : viewport * 1.25);
  // Fix the multiplier at departure, rather than reducing cruise speed as
  // the destination approaches. Two screens is the baseline section hop.
  menuFlightSpeedScale = menuFlightActive && scaleWithDistance
    ? Math.max(1, Math.min(6, Math.abs(distance) / Math.max(1, viewport * 2))) : 1;
  menuFlightDirection = direction;
  menuFlightTrailStrength = menuFlightActive ? 1 : 0;
  // Extending a journey must not re-arm departure and blank the live trails.
  // A reversal still waits for the ship to complete its turn.
  menuFlightCruising = menuFlightActive && (!waitForTurn || continuingCruise);
}
// Desktop departure is armed only after the curved turn is over and the ship
// is moving toward the destination. Once cruising, retain the arrival fade.
export function updateMenuFlightDeparture(turning, forwardSpeed) {
  if (menuFlightActive && !turning && forwardSpeed > 0) menuFlightCruising = true;
}
// Anticipate arrival independently of ship speed, then keep fading monotonically.
export function updateMenuFlightApproach(remaining, speed, braking, viewport, arrivalLead = 1) {
  if (!menuFlightActive) return;
  const stoppingDistance = speed * speed / (2 * braking) * arrivalLead;
  const fadeDistance = Math.max(viewport * .75, speed * 1.1) * arrivalLead;
  const t = Math.max(0, Math.min(1, (Math.abs(remaining) - stoppingDistance) / fadeDistance));
  menuFlightTrailStrength = Math.min(menuFlightTrailStrength, t * t * (3 - 2 * t));
}
export function endMenuFlight() {
  menuFlightSpeedScale = 1;
  menuFlightActive = false;
  menuFlightTrailStrength = 0;
  menuFlightCruising = false;
}
