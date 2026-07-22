/** Round n to the specified number of decimal places (default: 0) */
export function round(n: number, decimals = 0): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}
/** Arithmetic mean of a numeric array. Returns 0 for empty arrays. */
export function mean(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
/** Median value of a numeric array. Returns 0 for empty arrays. */
export function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? ((s[m-1]! + s[m]!) / 2) : s[m]!;
}
/** Standard deviation of a numeric array */
export function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}
