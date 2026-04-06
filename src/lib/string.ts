/** Capitalise the first letter of a string */
export function capitalize(s: string): string {
  return s.length > 0 ? s[0]!.toUpperCase() + s.slice(1) : s;
}

/** Convert camelCase or snake_case to Title Case */
export function toTitleCase(s: string): string {
  return s.replace(/[_-](.)/g, (_, c: string) => ' ' + c.toUpperCase())
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .split(' ')
          .map(capitalize)
          .join(' ');
}

/** Truncate a string to maxLen, appending ellipsis if needed */
export function truncate(s: string, maxLen: number): string {
  return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + '…';
}
