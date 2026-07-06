import { useEffect, useState } from "react";

export type SystemStats = {
  deviceMemoryGB: number | null;
  hardwareConcurrency: number;
  wasmSupported: boolean;
  simdSupported: boolean | null;
  online: boolean;
};

export function useSystemStats(): SystemStats {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return {
    deviceMemoryGB: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    hardwareConcurrency: navigator.hardwareConcurrency,
    wasmSupported: typeof WebAssembly !== "undefined",
    simdSupported: null, // detected async in newer browsers
    online,
  };
}
