import { useEffect } from "react";

type Options = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  enabled?: boolean;
};

export function useKeyboardShortcut(options: Options, handler: () => void) {
  const { key, ctrl = false, meta = false, shift = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        e.ctrlKey === ctrl &&
        e.metaKey === meta &&
        e.shiftKey === shift &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, ctrl, meta, shift, enabled, handler]);
}
