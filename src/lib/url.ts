/** Build a URL with query parameters */
export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(base, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/** Parse query parameters from the current URL */
export function getQueryParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}
