import { Check, Minus } from "lucide-react";
import { CONDITIONS, type AnalysisResult } from "@/lib/diagnosis";
import { STAGES, type ImageQuality } from "@/lib/maizevision-store";
import { cn } from "@/lib/utils";
import leafHealthy from "@/assets/leaf-healthy.jpg";

export function ConfidenceBar({ value, tone }: { value: number; tone?: "low" }) {
  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700",
            tone === "low" ? "bg-warning" : "bg-primary",
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <div aria-label={label} className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export function StageList({ stage, compact }: { stage: number; compact?: boolean }) {
  return (
    <ol className="space-y-3">
      {STAGES.map((label, i) => {
        const done = stage > i;
        const active = stage === i;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full border",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground",
              )}
            >
              {done ? (
                <Check className="size-3" strokeWidth={3} />
              ) : active ? (
                <span className="size-1.5 rounded-full bg-primary live-dot" />
              ) : (
                <Minus className="size-3" />
              )}
            </span>
            <span
              className={cn(
                compact ? "text-sm" : "text-[15px]",
                done || active ? "text-foreground" : "text-muted-foreground",
                active && "font-medium",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function QualityChecks({ quality }: { quality: ImageQuality }) {
  const rows: [string, boolean][] = [
    ["Lighting", quality.lighting],
    ["Focus", quality.focus],
    ["Leaf visibility", quality.visibility],
    ["Background", quality.background],
  ];
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
      {rows.map(([label, ok]) => (
        <li key={label} className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className={cn("font-mono text-xs", ok ? "text-success" : "text-warning")}>
            {ok ? "PASS" : "WEAK"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="label-caps border-b border-border pb-2">{children}</h3>;
}

export function ObservedSigns({ result }: { result: AnalysisResult }) {
  const condition = CONDITIONS[result.primary.key];
  return (
    <section className="space-y-3">
      <SectionTitle>Observed signs</SectionTitle>
      <ul className="space-y-2">
        {condition.signs.map((s) => (
          <li key={s} className="flex gap-3 text-[15px] leading-relaxed">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-maize" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Recommendations({ result }: { result: AnalysisResult }) {
  const condition = CONDITIONS[result.primary.key];
  const groups: [string, string[]][] = [
    ["Immediate action", condition.immediate],
    ["Field management", condition.field],
    ["Monitoring", condition.monitoring],
  ];
  return (
    <section className="space-y-5">
      <SectionTitle>Recommended action</SectionTitle>
      {groups.map(([title, items]) => (
        <div key={title} className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
          <h4 className="text-sm font-semibold tracking-[-0.01em] text-primary">{title}</h4>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item} className="text-[15px] leading-relaxed text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function AdvisoryNote() {
  return (
    <p className="rounded-md border border-border bg-accent/60 px-4 py-3 text-sm leading-relaxed text-accent-foreground">
      AI-assisted diagnosis. Confirm severe cases with an agricultural specialist before applying
      large-scale treatment.
    </p>
  );
}

export function LowConfidenceNote({ onRetake }: { onRetake?: () => void }) {
  return (
    <div className="rounded-md border border-warning/50 bg-warning/10 px-4 py-4">
      <p className="text-sm font-semibold text-warning-foreground">Low-confidence result</p>
      <p className="mt-1 text-sm leading-relaxed text-warning-foreground/90">
        Image characteristics do not strongly match a known condition. Retake the image with better
        lighting and a clear view of a single flat leaf.
      </p>
      {onRetake ? (
        <button
          onClick={onRetake}
          className="mt-3 rounded-md border border-warning px-3 py-1.5 text-sm font-medium text-warning-foreground"
        >
          Retake photo
        </button>
      ) : null}
    </div>
  );
}

export function LeafComparison({ imageUrl }: { imageUrl: string }) {
  return (
    <section className="space-y-3">
      <SectionTitle>Visual comparison</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Current leaf", src: imageUrl },
          { label: "Healthy reference", src: leafHealthy },
        ].map((item) => (
          <figure key={item.label} className="panel overflow-hidden">
            <img
              src={item.src}
              alt={item.label}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="label-caps border-t border-border px-3 py-2">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
