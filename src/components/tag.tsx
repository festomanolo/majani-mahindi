import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Small tag / pill label component */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground", className)}>
      {children}
    </span>
  );
}
