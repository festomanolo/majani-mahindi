import { cn } from "@/lib/utils";
import type { SampleStatus } from "@/lib/maizevision-store";

// Human-readable labels for each sample lifecycle stage
const STATUS_LABELS: Record<SampleStatus, string> = {
  sending:   "Receiving",
  received:  "Ready",
  analyzing: "Analysing",
  complete:  "Complete",
  failed:    "Failed",
};

// Tailwind classes for each status badge variant
const STATUS_COLORS: Record<SampleStatus, string> = {
  sending:   "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  received:  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  analyzing: "bg-primary/15 text-primary",
  complete:  "bg-green-500/15 text-green-700 dark:text-green-300",
  failed:    "bg-red-500/15 text-red-700 dark:text-red-300",
};

/** Coloured badge reflecting the lifecycle status of a scan sample */
export function StatusBadge({ status }: { status: SampleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] font-medium",
        STATUS_COLORS[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
