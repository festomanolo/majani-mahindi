import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
/** Inline monospace span using IBM Plex Mono */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-sm", className)}>{children}</span>;
}
