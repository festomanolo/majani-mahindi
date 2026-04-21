/**
 * Lightweight logger that suppresses output in production.
 */
// Suppress all non-error logs in production
const isDev = import.meta.env.DEV;

export const logger = {
  log:   (...args: unknown[]) => { if (isDev) console.log("[MV]", ...args); },
  warn:  (...args: unknown[]) => { if (isDev) console.warn("[MV]", ...args); },
  error: (...args: unknown[]) => console.error("[MV]", ...args), // always log errors
  time:  (label: string)      => { if (isDev) console.time(label); },
  timeEnd:(label: string)     => { if (isDev) console.timeEnd(label); },
};
