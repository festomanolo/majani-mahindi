import { createFileRoute } from "@tanstack/react-router";
import { PcShell } from "@/components/pc-shell";
import { Field } from "@/components/brand";
import { CONDITIONS } from "@/lib/diagnosis";
import { formatTime, useMaizeVision } from "@/lib/maizevision-store";
import type { ConditionKey } from "@/lib/diagnosis";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [{ title: "Reports — MaizeVision" }],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { samples } = useMaizeVision();
  const complete = samples.filter(s => s.status === "complete" && s.result);

  // Tally counts per condition key
  const tally = complete.reduce<Record<string, number>>((acc, s) => {
    const key = s.result!.primary.key;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);

  const avgConfidence =
    complete.length === 0
      ? 0
      : Math.round(complete.reduce((sum, s) => sum + (s.result?.primary.confidence ?? 0), 0) / complete.length);

  const avgMs =
    complete.length === 0
      ? 0
      : Math.round(complete.reduce((sum, s) => sum + (s.result?.processingMs ?? 0), 0) / complete.length);

  const firstScan = samples.length ? samples[samples.length - 1] : null;
  const lastScan  = samples.length ? samples[0] : null;

  return (
    <PcShell title="Reports" subtitle="Aggregated diagnostic statistics">
      {complete.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No completed analyses yet. Run a scan to generate reports.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {[
              { label: "Analyses run",      value: String(complete.length) },
              { label: "Avg confidence",    value: `${avgConfidence}%` },
              { label: "Avg process time",  value: `${(avgMs / 1000).toFixed(1)} s` },
              { label: "Unique conditions", value: String(sorted.length) },
            ].map(k => (
              <div key={k.label} className="bg-card px-4 py-4">
                <div className="label-caps">{k.label}</div>
                <div className="mt-1 font-mono text-2xl">{k.value}</div>
              </div>
            ))}
          </div>

          {/* Condition breakdown */}
          <div className="panel">
            <div className="border-b border-border px-5 py-3 label-caps">Condition frequency</div>
            <ul className="divide-y divide-border">
              {sorted.map(([key, count]) => {
                const condition = CONDITIONS[key as ConditionKey];
                const pct = Math.round((count / complete.length) * 100);
                return (
                  <li key={key} className="flex items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{condition?.name ?? key}</span>
                        <span className="font-mono text-sm shrink-0">{count} scan{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-muted-foreground w-10 text-right">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Session info */}
          <div className="panel p-5">
            <div className="label-caps mb-4">Session info</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="First scan" value={firstScan ? formatTime(firstScan.capturedAt) : "—"} />
              <Field label="Last scan"  value={lastScan  ? formatTime(lastScan.capturedAt)  : "—"} />
              <Field label="Total stored" value={`${samples.length} samples`} />
              <Field label="Low confidence" value={`${complete.filter(s => s.result?.lowConfidence).length} scan(s)`} />
            </div>
          </div>
        </div>
      )}
    </PcShell>
  );
}
