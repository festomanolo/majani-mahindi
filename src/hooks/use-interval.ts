import { useEffect, useRef } from "react";

/** Run a callback on a stable interval; clears on unmount or when delay is null */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; });

  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => savedCallback.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}
