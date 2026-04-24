import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
/** IBM Plex Mono inline span — for IDs, codes, and measurements */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-sm", className)}>{children}</span>;
}
