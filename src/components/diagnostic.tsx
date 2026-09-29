// diagnostic.tsx — reusable diagnosis UI components
import { Check, Minus } from "lucide-react";
import { CONDITIONS } from "@/lib/diagnosis";
import { CONDITIONS_SW } from "@/lib/diagnosis-sw";
import { STAGES, type ImageQuality } from "@/lib/maizevision-store";
import { useI18n } from "@/lib/locale-context";
import { cn } from "@/lib/utils";
import leafHealthy from "@/assets/leaf-healthy.jpg";
import type { AnalysisResult } from "@/lib/diagnosis";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return the condition record for the current locale */
function useConditions() {
  const { locale } = useI18n();
  return locale === "sw" ? CONDITIONS_SW : CONDITIONS;
}

// ── Confidence bar ────────────────────────────────────────────────────────────

export function ConfidenceBar({ value, tone, label }: { value: number; tone?: "low"; label?: string }) {
  return (
    <div className="w-full">
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="img"
        aria-label={label ?? `Confidence: ${value}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            tone === "low" ? "bg-warning" : "bg-primary",
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, willChange: "width", transform: "translateZ(0)" }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

// ── Stage list ────────────────────────────────────────────────────────────────

export function StageList({ stage, compact }: { stage: number; compact?: boolean }) {
  const { strings } = useI18n();

  const stageLabels = [
    strings.stages.receivingImage,
    strings.stages.qualityCheck,
    strings.stages.preprocessing,
    strings.stages.featureAnalysis,
    strings.stages.classification,
    strings.stages.recommendation,
  ];

  // Fallback to STAGES length if translation array differs
  const labels = stageLabels.length === STAGES.length ? stageLabels : STAGES;

  return (
    <ol className="space-y-3">
      {labels.map((label, i) => {
        const done = stage > i;
        const active = stage === i;
        return (
          <li key={i} className="flex items-center gap-3">
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

// ── Quality checks ────────────────────────────────────────────────────────────

export function QualityChecks({ quality }: { quality: ImageQuality }) {
  const { strings } = useI18n();
  const q = strings.quality;

  const rows: [string, boolean][] = [
    [q.lighting, quality.lighting],
    [q.focus, quality.focus],
    [q.leafVisibility, quality.visibility],
    [q.background, quality.background],
  ];

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
      {rows.map(([label, ok]) => (
        <li key={label} className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className={cn("font-mono text-xs", ok ? "text-success" : "text-warning")}>
            {ok ? q.pass : q.weak}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ── Section title ─────────────────────────────────────────────────────────────

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="label-caps border-b border-border pb-2">{children}</h3>;
}

// ── Observed signs ────────────────────────────────────────────────────────────

export function ObservedSigns({ result }: { result: AnalysisResult }) {
  const conditions = useConditions();
  const { strings } = useI18n();
  const condition = conditions[result.primary.key];
  return (
    <section className="space-y-3">
      <SectionTitle>{strings.result.observedSigns}</SectionTitle>
      <ul className="space-y-2">
        {condition.signs.map((s, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-maize" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Recommendations ───────────────────────────────────────────────────────────

export function Recommendations({ result }: { result: AnalysisResult }) {
  const conditions = useConditions();
  const { strings } = useI18n();
  const condition = conditions[result.primary.key];
  const r = strings.result;

  const groups: [string, string[]][] = [
    [r.immediateAction,    condition.immediate],
    [r.fieldManagement,    condition.field],
    [r.monitoringScouting, condition.monitoring],
  ];

  return (
    <section className="space-y-5">
      <SectionTitle>{r.recommendedActions}</SectionTitle>
      {groups.map(([title, items]) => (
        <div key={title} className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
          <h4 className="text-sm font-semibold tracking-[-0.01em] text-primary">{title}</h4>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="text-[15px] leading-relaxed text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

// ── Advisory note ─────────────────────────────────────────────────────────────

export function AdvisoryNote() {
  const { strings } = useI18n();
  return (
    <p className="rounded-md border border-border bg-accent/60 px-4 py-3 text-sm leading-relaxed text-accent-foreground">
      {strings.result.advisoryNote}
    </p>
  );
}

// ── Low confidence note ───────────────────────────────────────────────────────

export function LowConfidenceNote({ onRetake }: { onRetake?: () => void }) {
  const { strings } = useI18n();
  const r = strings.result;
  return (
    <div className="rounded-md border border-warning/50 bg-warning/10 px-4 py-4">
      <p className="text-sm font-semibold text-warning-foreground">{r.lowConfidenceTitle}</p>
      <p className="mt-1 text-sm leading-relaxed text-warning-foreground/90">{r.lowConfidenceBody}</p>
      {onRetake ? (
        <button
          onClick={onRetake}
          className="mt-3 rounded-md border border-warning px-3 py-1.5 text-sm font-medium text-warning-foreground"
        >
          {r.retakeImage}
        </button>
      ) : null}
    </div>
  );
}

// ── Leaf comparison ───────────────────────────────────────────────────────────

export function LeafComparison({ imageUrl }: { imageUrl: string }) {
  const { strings } = useI18n();
  const r = strings.result;
  return (
    <section className="space-y-3">
      <SectionTitle>{r.visualComparison}</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: r.scannedLeaf,       src: imageUrl },
          { label: r.healthyReference,  src: leafHealthy },
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

// ── Processing metrics ────────────────────────────────────────────────────────

export function ProcessingMetrics({ processingMs }: { processingMs: number }) {
  const { strings } = useI18n();
  return (
    <dl className="grid grid-cols-3 gap-4 rounded-md border border-border bg-secondary/40 px-4 py-3 font-mono text-xs">
      <div>
        <dt className="text-muted-foreground">Total</dt>
        <dd className="mt-0.5 font-semibold">{processingMs} ms</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">{strings.analysis.processingTime}</dt>
        <dd className="mt-0.5 font-semibold">~{Math.round(processingMs * 0.72)} ms</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Pre-process</dt>
        <dd className="mt-0.5 font-semibold">~{Math.round(processingMs * 0.28)} ms</dd>
      </div>
    </dl>
  );
}
