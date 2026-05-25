/** Shared formatting utilities for the MaizeVision station */

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 45_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return formatDate(ts);
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export function formatNumber(n: number, locale = 'en-KE'): string {
  return new Intl.NumberFormat(locale).format(n);
}

export function formatPlural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
