/**
 * Linearly interpolate between two numbers.
 * @param a The first parameter.
 * @param b The second parameter.
 * @param t The interpolation factor. 0.0 for a, 1.0 for b.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

interface IBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
/**
 * Test if a point is inside a rectangle.
 * @param x X coordinate of the point.
 * @param y Y coordinate of the point.
 * @param r The rectangle bounds.
 */
export function inbound(x: number, y: number, r: IBounds): boolean {
  if (x < r.x || x > r.x + r.width || y < r.y || y > r.y + r.height) {
    return false;
  } else {
    return true;
  }
}
/**
 * Check if two rectangles overlap each other.
 * @param r1 The first rectangle.
 * @param r2 The second rectangle.
 */
export function overlap(r1: IBounds, r2: IBounds): boolean {
  const check = [
    r1.x + r1.width < r2.x,
    r2.x + r2.width < r1.x,
    r1.y + r1.height < r2.y,
    r2.y + r2.height < r1.y
  ];
  if (check[0] || check[1] || check[2] || check[3]) {
    return false;
  } else {
    return true;
  }
}
