// Include the rotated beam and its glow when deciding whether it has left.
export function laserOutsideViewport(x, y, angle, width, height) {
  const halfX = Math.abs(Math.cos(angle)) * 14 + Math.abs(Math.sin(angle)) * 2 + 8;
  const halfY = Math.abs(Math.sin(angle)) * 14 + Math.abs(Math.cos(angle)) * 2 + 8;
  return x + halfX < 0 || x - halfX > width || y + halfY < 0 || y - halfY > height;
}
