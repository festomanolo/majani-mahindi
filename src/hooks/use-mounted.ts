import { useState, useEffect } from "react";

/**
 * True after the first browser render.
 * Prevents SSR/hydration mismatches when accessing browser globals.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
