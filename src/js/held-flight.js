// Latch at arrival so tiny pointer jitter cannot restart a turning course.
export function heldRestPoint(position, target, pointer, resting) {
  if (resting && Math.hypot(pointer.x - resting.x, pointer.y - resting.y) < 12) return resting;
  if (Math.hypot(target.x - position.x, target.y - position.y) <= 20) return { ...pointer };
  return null;
}
