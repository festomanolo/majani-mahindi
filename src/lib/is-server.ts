/** True when code is executing in a non-browser (server-side) environment */
export const isServer = typeof window === "undefined";

/** True when running in a browser environment */
export const isBrowser = !isServer;
