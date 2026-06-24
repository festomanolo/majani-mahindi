import { useEffect, useRef } from "react";

/** Attach a typed window event listener; removes it on unmount or when disabled */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  enabled = true,
) {
  const handlerRef = useRef(handler);
  useEffect(() => { handlerRef.current = handler; });

  useEffect(() => {
    if (!enabled) return;
    const fn = (e: WindowEventMap[K]) => handlerRef.current(e);
    window.addEventListener(type, fn);
    return () => window.removeEventListener(type, fn);
  }, [type, enabled]);
}
