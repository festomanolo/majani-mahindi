import { cn } from "@/lib/utils";

export function MaizeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6 text-primary", className)} aria-hidden="true">
      <path
        d="M12 2.5c3.6 2.4 5.4 5.6 5.4 9.1 0 4.2-2.4 7.5-5.4 9.9-3-2.4-5.4-5.7-5.4-9.9 0-3.5 1.8-6.7 5.4-9.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M12 4v17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M12 9 8.6 11M12 13l-3.4 2M12 9l3.4 2M12 13l3.4 2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Wordmark({ subtitle, compact }: { subtitle?: string; compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <MaizeMark className={compact ? "size-5 shrink-0" : "size-7 shrink-0"} />
      <div className="min-w-0">
        <div
          className={cn(
            "truncate font-semibold tracking-[-0.02em] text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          MaizeVision
        </div>
        {subtitle ? <div className="label-caps truncate">{subtitle}</div> : null}
      </div>
    </div>
  );
}

export function StatusDot({
  tone = "neutral",
  live,
}: {
  tone?: "ok" | "warn" | "bad" | "neutral";
  live?: boolean;
}) {
  const color =
    tone === "ok"
      ? "bg-success"
      : tone === "warn"
        ? "bg-warning"
        : tone === "bad"
          ? "bg-destructive"
          : "bg-border-strong";
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full", color, live && "live-dot")}
      aria-hidden="true"
    />
  );
}

/** Key-value field for metadata grids */
export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="label-caps">{label}</div>
      <div className="mt-1 truncate font-mono text-sm text-foreground">{value}</div>
    </div>
  );
}
