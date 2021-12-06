
export function lerp(a: number, b: number, m: number, x: number, y: number) {
  const t = (m - a) / (b - a)
  return x + (y - x) * t
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}
