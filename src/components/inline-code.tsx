import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Inline code span styled like a code element */
export function InlineCode({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn("rounded bg-secondary px-1 py-0.5 font-mono text-xs", className)}>
      {children}
    </code>
  );
}
