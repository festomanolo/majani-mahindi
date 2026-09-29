import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PcShell } from "@/components/pc-shell";
import { ResultView } from "@/components/result-view";
import { StageList } from "@/components/diagnostic";
import { useMaizeVision } from "@/lib/maizevision-store";

export const Route = createFileRoute("/sample/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Sample ${params.id} — MaizeVision` }],
  }),
  component: SamplePage,
});

function SamplePage() {
  const { id } = Route.useParams();
  const { samples, startAnalysis } = useMaizeVision();
  const sample = samples.find(s => s.id === id);

  if (!sample) {
    return (
      <PcShell title="Sample not found">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-xl font-semibold">Sample not found</h2>
          <p className="text-sm text-muted-foreground">
            Sample <span className="font-mono">{id}</span> doesn't exist or has been cleared.
          </p>
          <a
            href="/history"
            className="mt-2 flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-4" /> Back to history
          </a>
        </div>
      </PcShell>
    );
  }

  return (
    <PcShell title={sample.id} subtitle="Sample report">
      <div className="mb-6">
        <a
          href="/history"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> History
        </a>
      </div>

      {sample.status === "complete" ? (
        <ResultView sample={sample} />
      ) : sample.status === "analyzing" || sample.status === "sending" || sample.status === "received" ? (
        <div className="panel p-6 space-y-4">
          <p className="font-medium">Analysis in progress…</p>
          <StageList stage={sample.stage} />
        </div>
      ) : sample.status === "failed" ? (
        <div className="panel flex flex-col items-center gap-4 p-10 text-center">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-semibold text-destructive">Analysis failed</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {sample.error ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => startAnalysis(sample.id)}
            className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="panel p-6">
          <p className="text-muted-foreground text-sm">This sample hasn't been analysed yet.</p>
          <button
            onClick={() => startAnalysis(sample.id)}
            className="mt-4 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Analyse now
          </button>
        </div>
      )}
    </PcShell>
  );
}
