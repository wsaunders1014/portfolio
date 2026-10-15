const tau = Math.PI * 2;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

function turningCourse(start, target, heading, radius, side) {
  const center = {
    x: start.x - side * radius * Math.sin(heading),
    y: start.y + side * radius * Math.cos(heading)
  };
  const dx = target.x - center.x;
  const dy = target.y - center.y;
  const bearing = Math.atan2(dy, dx);
  const offset = Math.acos(clamp(radius / Math.hypot(dx, dy), -1, 1));
  const startAngle = heading - side * Math.PI / 2;
  // Choose the circle tangent that points toward the destination, not away.
  const endAngle = [bearing + offset, bearing - offset].find(angle => {
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    return (target.x - x) * (-side * Math.sin(angle)) + (target.y - y) * (side * Math.cos(angle)) > 0;
  });
  const sweep = ((side * (endAngle - startAngle)) % tau + tau) % tau;
  const tangent = {
    x: center.x + radius * Math.cos(endAngle),
    y: center.y + radius * Math.sin(endAngle)
  };
  const lineLength = Math.hypot(target.x - tangent.x, target.y - tangent.y);
  return { start, target, center, radius, side, startAngle, sweep, tangent,
    arcLength: sweep * radius, lineLength, length: sweep * radius + lineLength,
    finalHeading: endAngle + side * Math.PI / 2 };
}

// Like the original flight, leave in the current forward direction and turn
// onto the approach. A circle-to-tangent course avoids the sharp cusps possible
// in the legacy Bezier handles while preserving position/heading continuity.
export function createFlightPath(start, target, heading, bounds) {
  const distance = Math.hypot(target.x - start.x, target.y - start.y);
  let radius = Math.min(120, distance * .35);
  let best;
  for (let attempt = 0; attempt < 12; attempt++) {
    const candidates = [-1, 1].map(side => {
      const path = turningCourse({ ...start }, { ...target }, heading, radius, side);
      let violation = 0;
      for (let i = 0; i <= 120; i++) {
        const angle = path.startAngle + side * path.sweep * i / 120;
        const y = path.center.y + radius * Math.sin(angle);
        violation = Math.max(violation, bounds.top - y, y - bounds.bottom);
      }
      return { path, violation };
    }).sort((a, b) => a.violation - b.violation || a.path.length - b.path.length);
    best = candidates[0];
    if (best.violation < .01) break;
    radius *= .75;
  }
  return best.path;
}

export function sampleFlightPath(path, distance) {
  distance = clamp(distance, 0, path.length);
  if (distance < path.arcLength) {
    const angle = path.startAngle + path.side * distance / path.radius;
    return {
      x: path.center.x + path.radius * Math.cos(angle),
      y: path.center.y + path.radius * Math.sin(angle),
      heading: angle + path.side * Math.PI / 2
    };
  }
  const fraction = path.lineLength ? (distance - path.arcLength) / path.lineLength : 1;
  return {
    x: path.tangent.x + (path.target.x - path.tangent.x) * fraction,
    y: path.tangent.y + (path.target.y - path.tangent.y) * fraction,
    heading: path.finalHeading
  };
}
