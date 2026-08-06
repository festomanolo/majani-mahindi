/** Construct a URL with serialised query parameters */
export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(base, window.location.origin);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  return url.toString();
}
/** Parse a query parameter from the current URL */
export function getQueryParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}
