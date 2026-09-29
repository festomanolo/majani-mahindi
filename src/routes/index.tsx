import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf } from "lucide-react";
import { PcShell } from "@/components/pc-shell";
import { PairQr } from "@/components/pair-qr";
import { Field, StatusDot } from "@/components/brand";
import { QualityChecks, StageList } from "@/components/diagnostic";
import { DATASET, MODEL_VERSION } from "@/lib/diagnosis";
import { formatTime, useMaizeVision } from "@/lib/maizevision-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diagnostic Station — MaizeVision Local AI" },
      {
        name: "description",
        content:
          "Local AI diagnostic station for maize leaf analysis. Receive scans from a connected phone and get nutrient deficiency diagnoses on your own network.",
      },
      { property: "og:title", content: "Diagnostic Station — MaizeVision Local AI" },
      {
        property: "og:description",
        content: "Receive maize leaf scans from a connected phone and analyse them locally.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { connection, samples, current, startAnalysis, autoAnalyze, setAutoAnalyze } =
    useMaizeVision();
  const connected = connection.status === "connected";
  const completed = samples.filter((s) => s.status === "complete").length;

  return (
    <PcShell title="Diagnostic Station" subtitle="Local AI maize leaf analysis">
      <div className="space-y-8">
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-5">
          {[
            {
              label: "Connected device",
              value: connected ? connection.phoneName : "None",
              tone: connected ? ("ok" as const) : ("warn" as const),
            },
            { label: "Network", value: connection.network, tone: "ok" as const },
            { label: "AI model", value: "Ready", tone: "ok" as const },
            { label: "Scans stored", value: `${samples.length} local`, tone: "neutral" as const },
            { label: "Model version", value: MODEL_VERSION, tone: "neutral" as const },
          ].map((item) => (
            <div key={item.label} className="bg-card px-4 py-4">
              <div className="label-caps">{item.label}</div>
              <div className="mt-2 flex items-center gap-2">
                <StatusDot tone={item.tone} live={item.tone === "ok"} />
                <span className="truncate font-mono text-sm">{item.value}</span>
              </div>
            </div>
          ))}
        </section>

        {current ? (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <figure className="panel relative overflow-hidden">
              <img
                src={current.imageUrl}
                alt="Incoming maize leaf sample"
                className="aspect-4/3 w-full object-cover"
              />
              {current.status === "analyzing" ? (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="scan-sweep h-px w-full bg-primary/70 shadow-[0_0_18px_2px_oklch(0.41_0.088_148/0.45)]" />
                </div>
              ) : null}
              <figcaption className="flex items-center justify-between border-t border-border px-4 py-3">
                <span className="label-caps">{current.id}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatTime(current.capturedAt)}
                </span>
              </figcaption>
            </figure>

            <div className="panel p-6">
              <div className="label-caps">
                {current.status === "complete" ? "Analysis complete" : "New sample"}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                {current.status === "sending"
                  ? "Receiving image"
                  : current.status === "received"
                    ? "Sample ready for analysis"
                    : current.status === "analyzing"
                      ? "Analysing leaf"
                      : current.result?.primary.name}
              </h2>

              <dl className="mt-6 grid grid-cols-2 gap-5">
                <Field label="Sample ID" value={current.id} />
                <Field label="Timestamp" value={formatTime(current.capturedAt)} />
                <Field label="Device" value={current.device} />
                <Field label="Image quality" value={current.quality.overall} />
              </dl>

              <div className="mt-6 border-t border-border pt-5">
                {current.status === "received" ? (
                  <>
                    <QualityChecks quality={current.quality} />
                    <button
                      onClick={() => {
                        startAnalysis(current.id);
                        window.location.href = "/analysis";
                      }}
                      className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Analyze leaf
                    </button>
                  </>
                ) : current.status === "complete" ? (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="label-caps">Confidence</span>
                      <span className="font-mono text-2xl">
                        {current.result?.primary.confidence}%
                      </span>
                    </div>
                    <Link
                      to="/analysis"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Open full report <ArrowRight className="size-4" />
                    </Link>
                  </>
                ) : (
                  <StageList stage={current.stage} compact />
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="panel hairline-grid flex min-h-[340px] flex-col items-center justify-center px-8 py-14 text-center">
              <div className="grid size-16 place-items-center rounded-full border border-border bg-card">
                <Leaf className="size-7 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                Ready for a new leaf
              </h2>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                {connected
                  ? "Scan a maize leaf from the connected phone to begin analysis."
                  : "Waiting for mobile scanner. Pair a phone on this network to begin."}
              </p>
              <Link
                to="/phone"
                className="mt-6 rounded-md border border-border-strong px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Open phone scanner
              </Link>
            </div>

            <div className="panel p-6">
              <div className="label-caps">Pair a phone</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Make sure your phone is on the <strong>same Wi-Fi</strong> as this computer, then scan the QR code or type the address into the phone browser.
              </p>
              <div className="mt-5 flex flex-col items-center gap-4">
                <PairQr url={`http://${connection.address}/phone`} />
                <div className="text-center">
                  <div className="label-caps">Phone scanner URL</div>
                  <div className="font-mono text-sm tracking-wide break-all select-all">
                    http://{connection.address}/phone
                  </div>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
                <Field label="Station" value={connection.pcName} />
                <Field label="Address" value={connection.address} />
              </dl>
            </div>
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="panel">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="label-caps">Recent scans</h3>
              <Link to="/history" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {samples.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">
                No scans yet. Completed analyses are stored on this computer only.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {samples.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/sample/$id"
                      params={{ id: s.id }}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary/60"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-mono text-xs text-muted-foreground">{s.id}</div>
                        <div className="truncate text-sm">
                          {s.result?.primary.name ?? "Awaiting analysis"}
                        </div>
                      </div>
                      <span className="font-mono text-sm">
                        {s.result ? `${s.result.primary.confidence}%` : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel p-5">
            <h3 className="label-caps">Station settings</h3>
            <label className="mt-4 flex items-start justify-between gap-4">
              <span className="text-sm">
                Analyse automatically
                <span className="mt-1 block text-xs text-muted-foreground">
                  Start analysis as soon as an image arrives from the phone.
                </span>
              </span>
              <input
                type="checkbox"
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-[oklch(0.41_0.088_148)]"
              />
            </label>
            <dl className="mt-5 space-y-3 border-t border-border pt-5">
              <Field label="Dataset" value={DATASET} />
              <Field label="Completed analyses" value={String(completed)} />
              <Field label="Storage" value="Local disk · 2.1 GB free" />
            </dl>
          </div>
        </section>
      </div>
    </PcShell>
  );
}
