/** Capitalise the first character of a string, leaving the rest unchanged */
export function capitalize(s: string): string {
  return s.length > 0 ? s[0]!.toUpperCase() + s.slice(1) : s;
}
/** Convert camelCase / snake_case to Title Case */
export function toTitleCase(s: string): string {
  return s.replace(/[_-](.)/g, (_, c: string) => ' ' + c.toUpperCase())
          .replace(/([A-Z])/g, ' $1').trim()
          .split(' ').map(capitalize).join(' ');
}
/** Truncate a string to maxLen, appending ellipsis if needed */
export function truncate(s: string, maxLen: number): string {
  return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + '…';
}
/** Pad a string on the left to a minimum length */
export function padStart(s: string, len: number, fill = ' '): string {
  return s.padStart(len, fill);
}

/** Repeat a string n times */
export function repeat(s: string, n: number): string {
  return s.repeat(Math.max(0, n));
}
