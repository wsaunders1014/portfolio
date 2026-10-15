const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
// Positive distance is ahead of the ship; negative distance has already passed.
export function starPassProfile(distance, extent) {
  if (distance >= 0) {
    const approach = smooth(1 - distance / extent);
    return { length: approach, visibility: 1 };
  }
  const receding = smooth(1 + distance / (extent * .85));
  return { length: receding * receding, visibility: receding };
}
