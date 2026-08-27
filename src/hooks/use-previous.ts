import { useRef, useEffect } from "react";
/** Stores and returns the value from the previous render cycle */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; });
  return ref.current;
}
