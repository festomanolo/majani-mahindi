import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Leaf } from "lucide-react";
import { PcShell } from "@/components/pc-shell";
import { ResultView } from "@/components/result-view";
import { StageList } from "@/components/diagnostic";
import { useMaizeVision } from "@/lib/maizevision-store";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [{ title: "Analysis — MaizeVision" }],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { current, startAnalysis } = useMaizeVision();

  if (!current) {
    return (
      <PcShell title="Analysis" subtitle="Leaf disease diagnosis">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <div className="grid size-16 place-items-center rounded-full border border-border bg-card">
            <Leaf className="size-7 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold">No sample loaded</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Send a photo from the phone scanner to begin a new analysis.
          </p>
          <a
            href="/"
            className="mt-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Back to dashboard
          </a>
        </div>
      </PcShell>
    );
  }

  const isRunning = current.status === "analyzing" || current.status === "sending" || current.status === "received";

  return (
    <PcShell title="Analysis" subtitle={current.id}>
      {isRunning ? (
        <div className="space-y-8">
          {/* Image preview with scan sweep */}
          <div className="panel relative overflow-hidden">
            <img
              src={current.imageUrl}
              alt="Leaf being analysed"
              className="aspect-video w-full object-cover"
            />
            {current.status === "analyzing" && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="scan-sweep h-px w-full bg-primary/70 shadow-[0_0_18px_2px_oklch(0.41_0.088_148/0.45)]" />
              </div>
            )}
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="font-semibold">
                {current.status === "sending"
                  ? "Receiving image from phone…"
                  : current.status === "received"
                  ? "Ready to analyse"
                  : "Running AI diagnosis…"}
              </span>
            </div>
            <div className="mt-6">
              <StageList stage={current.stage} />
            </div>
            {current.status === "received" && (
              <button
                onClick={() => startAnalysis(current.id)}
                className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Run analysis now
              </button>
            )}
          </div>
        </div>
      ) : current.status === "complete" ? (
        <ResultView sample={current} />
      ) : current.status === "failed" ? (
        <div className="panel flex flex-col items-center gap-4 p-10 text-center">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-semibold text-destructive">Analysis failed</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {current.error ?? "An unexpected error occurred during inference."}
          </p>
          <button
            onClick={() => startAnalysis(current.id)}
            className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : null}
    </PcShell>
  );
}
