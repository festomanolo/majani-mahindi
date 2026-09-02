import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Renders children in the IBM Plex Mono font at small size */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-sm", className)}>{children}</span>;
}
