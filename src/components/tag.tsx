import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Compact tag / pill for metadata labels */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground", className)}>
      {children}
    </span>
  );
}
