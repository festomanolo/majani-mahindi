/** Round to a given number of decimal places */
export function round(n: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

/** Calculate the arithmetic mean of an array */
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/** Calculate the median of an array */
export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1]! + sorted[mid]!) / 2)
    : sorted[mid]!;
}
