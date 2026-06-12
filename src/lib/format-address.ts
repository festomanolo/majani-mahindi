/** Format a LAN IP for use in a URL — wraps IPv6 in brackets */
export function formatAddress(ip: string, port: string | number): string {
  const isIPv6 = ip.includes(':');
  return isIPv6 ? `[${ip}]:${port}` : `${ip}:${port}`;
}
