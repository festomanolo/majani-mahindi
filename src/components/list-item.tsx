import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
/** Bulleted <li> with branded dot — use inside a <ul> */
export function ListItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <li className={cn("flex gap-3 text-[15px] leading-relaxed", className)}>
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}
