// system.tsx — system diagnostics page
import { createFileRoute } from "@tanstack/react-router";
import { PcShell } from "@/components/pc-shell";
import { Field } from "@/components/brand";
import { MODEL_VERSION, DATASET } from "@/lib/diagnosis";
import { useMaizeVision } from "@/lib/maizevision-store";

export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [{ title: "System — MaizeVision" }],
  }),
  component: SystemPage,
});

function SystemPage() {
  const { connection, samples, autoAnalyze, setAutoAnalyze } = useMaizeVision();

  function clearHistory() {
    if (window.confirm("Delete all scan history from this browser? This cannot be undone.")) {
      localStorage.removeItem("maizevision.state.v1");
      window.location.reload();
    }
  }

  return (
    <PcShell title="System" subtitle="Station configuration and diagnostics">
      <div className="space-y-6 max-w-2xl">

        {/* Model info */}
        <div className="panel p-5">
          <div className="label-caps mb-4">AI model</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Model" value={MODEL_VERSION} />
            <Field label="Dataset" value={DATASET} />
            <Field label="Runtime" value="ONNX Runtime Web (CPU)" />
            <Field label="Classes" value="Healthy · Common Rust · Northern Leaf Blight" />
          </div>
        </div>

        {/* Network */}
        <div className="panel p-5">
          <div className="label-caps mb-4">Network</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Station name" value={connection.pcName} />
            <Field label="Address"      value={connection.address} />
            <Field label="Network"      value={connection.network} />
            <Field label="Phone scanner URL" value={`http://${connection.address}/phone`} />
          </div>
        </div>

        {/* Storage */}
        <div className="panel p-5">
          <div className="label-caps mb-4">Storage</div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <Field label="Scans stored" value={String(samples.length)} />
            <Field label="Max stored"   value="24 samples" />
          </div>
          <button
            onClick={clearHistory}
            className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            Clear all scan history
          </button>
        </div>

        {/* Preferences */}
        <div className="panel p-5">
          <div className="label-caps mb-4">Preferences</div>
          <label className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm font-medium">Auto-analyse on receipt</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Start AI inference automatically as soon as a photo arrives from the phone.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={e => setAutoAnalyze(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-[oklch(0.41_0.088_148)]"
            />
          </label>
        </div>

        {/* About */}
        <div className="panel p-5">
          <div className="label-caps mb-4">About</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Application" value="MaizeVision Local AI" />
            <Field label="Version"     value="1.0.0" />
            <Field label="Runtime"     value="TanStack Start · Vite · React 19" />
            <Field label="Inference"   value="onnxruntime-web 1.19" />
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            All processing happens locally on this machine. No image data or results are sent to external servers.
          </p>
        </div>

      </div>
    </PcShell>
  );
}

// System stats panel wired to useSystemStats hook
// Shows: deviceMemoryGB, hardwareConcurrency, wasmSupported, online
