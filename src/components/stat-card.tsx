import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, subtext, icon, className }: Props) {
  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="label-caps">{label}</div>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      {subtext ? (
        <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>
      ) : null}
    </div>
  );
}
