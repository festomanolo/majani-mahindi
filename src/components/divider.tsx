import { cn } from "@/lib/utils";

export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) {
    return <hr className={cn("border-border", className)} />;
  }
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <hr className="flex-1 border-border" />
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <hr className="flex-1 border-border" />
    </div>
  );
}
