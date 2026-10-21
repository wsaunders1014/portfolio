// Exact critically damped spring step: frame-rate independent, with momentum
// retained when successive wheel events move the target.
export function chaseWheelTarget(position, velocity, target, dt, response = 4.5) {
  const offset = position - target;
  const impulse = velocity + response * offset;
  const decay = Math.exp(-response * dt);
  return {
    position: target + (offset + impulse * dt) * decay,
    velocity: (velocity - response * impulse * dt) * decay
  };
}

// An offset ship reaches the center before its motion starts moving the camera.
export function followCenteredShip(camera, shipX, previousShipX, viewport, maximum) {
  const centered = shipX - viewport / 2;
  const movement = shipX - previousShipX;
  const offset = previousShipX - camera - viewport / 2;
  // Flying away from center carries the existing camera offset with the ship;
  // it must not snap back to center or let the ship fly out of the viewport.
  const next = offset * movement >= 0 ? camera + movement
    : shipX > previousShipX ? Math.max(camera, centered)
    : shipX < previousShipX ? Math.min(camera, centered) : camera;
  return Math.max(0, Math.min(maximum, next));
}
