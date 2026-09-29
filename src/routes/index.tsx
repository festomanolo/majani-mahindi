import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf } from "lucide-react";
import { PcShell } from "@/components/pc-shell";
import { PairQr } from "@/components/pair-qr";
import { Field, StatusDot } from "@/components/brand";
import { QualityChecks, StageList } from "@/components/diagnostic";
import { DATASET, MODEL_VERSION } from "@/lib/diagnosis";
import { CONDITIONS_SW } from "@/lib/diagnosis-sw";
import { CONDITIONS } from "@/lib/diagnosis";
import { formatTime, useMaizeVision } from "@/lib/maizevision-store";
import { useI18n } from "@/lib/locale-context";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kituo cha Uchunguzi — Majani Mahindi AI" },
      {
        name: "description",
        content:
          "Kituo cha uchunguzi wa AI cha ndani kwa uchambuzi wa majani ya mahindi. Pokea picha kutoka kwa simu iliyounganishwa na upate utambuzi wa magonjwa kwenye mtandao wako.",
      },
      { property: "og:title", content: "Kituo cha Uchunguzi — Majani Mahindi AI" },
      {
        property: "og:description",
        content: "Pokea skani za majani ya mahindi kutoka kwa simu iliyounganishwa na uchanganue ndani.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { connection, samples, current, startAnalysis, autoAnalyze, setAutoAnalyze } =
    useMaizeVision();
  const { locale, strings: s } = useI18n();
  const connected = connection.status === "connected";
  const completed = samples.filter((s) => s.status === "complete").length;
  const conditions = locale === "sw" ? CONDITIONS_SW : CONDITIONS;

  // Keyboard shortcut: Enter triggers analysis when a sample is received
  const canAnalyze = current?.status === "received";
  useKeyboardShortcut(
    { key: "Enter", enabled: canAnalyze },
    () => {
      if (current) {
        startAnalysis(current.id);
        window.location.href = "/analysis";
      }
    },
  );

  return (
    <PcShell title={s.dashboard.title} subtitle={s.dashboard.subtitle}>
      <div className="space-y-8">
        {/* Status bar */}
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-5">
          {[
            {
              label: s.dashboard.connectedDevice,
              value: connected ? connection.phoneName : s.common.none,
              tone: connected ? ("ok" as const) : ("warn" as const),
            },
            { label: s.dashboard.network,       value: connection.network,            tone: "ok" as const },
            { label: s.dashboard.aiModel,        value: s.dashboard.aiReady,           tone: "ok" as const },
            { label: s.dashboard.scansStored,    value: `${samples.length} ${s.common.local}`, tone: "neutral" as const },
            { label: s.dashboard.modelVersion,   value: MODEL_VERSION,                 tone: "neutral" as const },
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

        {/* Current sample */}
        {current ? (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <figure className="panel relative overflow-hidden">
              <img
                src={current.imageUrl}
                alt={locale === "sw" ? "Picha ya jani la mahindi" : "Incoming maize leaf sample"}
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
                {current.status === "complete" ? s.analysis.analysisComplete : s.analysis.newSample}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                {current.status === "sending"
                  ? s.analysis.receivingImage
                  : current.status === "received"
                    ? s.analysis.sampleReady
                    : current.status === "analyzing"
                      ? s.analysis.analysingLeaf
                      : current.result
                        ? conditions[current.result.primary.key].name
                        : "—"}
              </h2>

              <dl className="mt-6 grid grid-cols-2 gap-5">
                <Field label={s.result.sampleId}    value={current.id} />
                <Field label={locale === "sw" ? "Wakati" : "Timestamp"} value={formatTime(current.capturedAt)} />
                <Field label={s.result.device}       value={current.device} />
                <Field label={s.result.imageQuality} value={current.quality.overall} />
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
                      {s.analysis.analyzeLeaf}
                    </button>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {locale === "sw" ? "au bonyeza Enter" : "or press Enter"}
                    </p>
                  </>
                ) : current.status === "complete" ? (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="label-caps">{s.analysis.confidence}</span>
                      <span className="font-mono text-2xl">
                        {current.result?.primary.confidence}%
                      </span>
                    </div>
                    <Link
                      to="/analysis"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {s.analysis.openReport} <ArrowRight className="size-4" />
                    </Link>
                  </>
                ) : (
                  <StageList stage={current.stage} compact />
                )}
              </div>
            </div>
          </section>
        ) : (
          /* Empty state — no current sample */
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="panel hairline-grid flex min-h-[340px] flex-col items-center justify-center px-8 py-14 text-center">
              <div className="grid size-16 place-items-center rounded-full border border-border bg-card">
                <Leaf className="size-7 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                {s.dashboard.readyForLeaf}
              </h2>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                {connected ? s.dashboard.scanNow : s.dashboard.waitingPhone}
              </p>
              <Link
                to="/phone"
                className="mt-6 rounded-md border border-border-strong px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                {s.dashboard.openPhoneScanner}
              </Link>
            </div>

            {/* Pair QR */}
            <div className="panel p-6">
              <div className="label-caps">{s.pair.pairPhone}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.pair.instructions}
              </p>
              <div className="mt-5 flex flex-col items-center gap-4">
                <PairQr url={`http://${connection.address}/phone`} />
                <div className="text-center">
                  <div className="label-caps">{s.pair.phoneUrl}</div>
                  <div className="break-all select-all font-mono text-sm tracking-wide">
                    http://{connection.address}/phone
                  </div>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
                <Field label={s.pair.stationLabel} value={connection.pcName} />
                <Field label={s.pair.addressLabel} value={connection.address} />
              </dl>
            </div>
          </section>
        )}

        {/* Recent scans + settings */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="panel">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="label-caps">{s.dashboard.recentScans}</h3>
              <Link to="/history" className="text-sm text-primary hover:underline">
                {s.dashboard.viewAll}
              </Link>
            </div>
            {samples.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">{s.dashboard.noScans}</p>
            ) : (
              <ul className="divide-y divide-border">
                {samples.slice(0, 5).map((samp) => (
                  <li key={samp.id}>
                    <Link
                      to="/sample/$id"
                      params={{ id: samp.id }}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary/60"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-mono text-xs text-muted-foreground">{samp.id}</div>
                        <div className="truncate text-sm">
                          {samp.result
                            ? conditions[samp.result.primary.key].name
                            : s.history.awaitingAnalysis}
                        </div>
                      </div>
                      <span className="font-mono text-sm">
                        {samp.result ? `${samp.result.primary.confidence}%` : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel p-5">
            <h3 className="label-caps">{s.dashboard.stationSettings}</h3>
            <label className="mt-4 flex items-start justify-between gap-4">
              <span className="text-sm">
                {s.dashboard.autoAnalyze}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {s.dashboard.autoAnalyzeHint}
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
              <Field label={s.dashboard.dataset}            value={DATASET} />
              <Field label={s.dashboard.completedAnalyses}  value={String(completed)} />
              <Field label={s.dashboard.storage}            value={locale === "sw" ? "Diski ya ndani · 2.1 GB huru" : "Local disk · 2.1 GB free"} />
            </dl>
          </div>
        </section>
      </div>
    </PcShell>
  );
}
