import { useEffect, type RefObject } from "react";
/** Fire a callback when a mousedown event occurs outside the ref element */
export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: () => void) {
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) handler(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, handler]);
}
