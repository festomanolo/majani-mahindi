import { useState, useEffect } from "react";

/** Returns true only after first client-side render. Prevents SSR/hydration mismatches. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
