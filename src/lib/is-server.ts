/** True when running in a server-side (non-browser) environment */
export const isServer = typeof window === "undefined";

/** True when running in a browser environment */
export const isBrowser = !isServer;
