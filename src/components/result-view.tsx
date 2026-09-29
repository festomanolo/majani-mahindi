import { CONDITIONS } from "@/lib/diagnosis";
import { CONDITIONS_SW } from "@/lib/diagnosis-sw";
import { formatTime, type Sample } from "@/lib/maizevision-store";
import { useI18n } from "@/lib/locale-context";
import {
  AdvisoryNote,
  ConfidenceBar,
  LeafComparison,
  LowConfidenceNote,
  ObservedSigns,
  QualityChecks,
  Recommendations,
  SectionTitle,
} from "@/components/diagnostic";
import { Field } from "@/components/brand";

/**
 * Full analysis result page.
 * Displays confidence, condition, signs, and recommendations.
 * All text is locale-aware via useI18n.
 */
export function ResultView({ sample }: { sample: Sample }) {
  const result = sample.result;
  const { locale, strings } = useI18n();
  const s = strings;

  if (!result) return null;

  const conditions = locale === "sw" ? CONDITIONS_SW : CONDITIONS;
  const condition = conditions[result.primary.key];

  return (
    <div className="space-y-10">
      <section className="panel p-6 lg:p-8">
        <div className="label-caps">{s.analysis.analysisResult}</div>
        <h2 className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.03em] lg:text-4xl">
          {condition.name}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {condition.summary}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <div className="label-caps">{s.analysis.confidence}</div>
            <div className="mt-1 font-mono text-4xl tracking-[-0.03em]">
              {result.primary.confidence}%
            </div>
            <div className="mt-3 max-w-md">
              <ConfidenceBar
                value={result.primary.confidence}
                {...(result.lowConfidence ? { tone: "low" as const } : {})}
              />
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-1 sm:text-right">
            <Field label={s.analysis.processingTime} value={`${(result.processingMs / 1000).toFixed(2)} s`} />
            <Field label={s.analysis.model} value={result.modelVersion} />
          </dl>
        </div>

        {result.lowConfidence ? (
          <div className="mt-6">
            {result.notMaize ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-4">
                <p className="text-sm font-semibold text-destructive">{s.analysis.notMaizeTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-destructive/80">
                  {s.analysis.notMaizeBody}
                </p>
              </div>
            ) : (
              <LowConfidenceNote />
            )}
          </div>
        ) : null}
      </section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          <ObservedSigns result={result} />
          <Recommendations result={result} />
          <AdvisoryNote />
        </div>

        <aside className="space-y-8">
          <section className="space-y-3">
            <SectionTitle>{s.result.predictionDetails}</SectionTitle>
            <ul className="space-y-3">
              <li>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{condition.name}</span>
                  <span className="font-mono">{result.primary.confidence}%</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${result.primary.confidence}%` }}
                  />
                </div>
              </li>
              {result.alternatives.map((alt) => {
                const altCondition = conditions[alt.key];
                return (
                  <li key={alt.key}>
                    <div className="flex items-baseline justify-between gap-3 text-sm text-muted-foreground">
                      <span>{altCondition.name}</span>
                      <span className="font-mono">{alt.confidence}%</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-border-strong"
                        style={{ width: `${alt.confidence}%` }}
                      />
                    </div>
                  </li>
                );
              })}
              <li className="flex items-baseline justify-between gap-3 text-sm text-muted-foreground">
                <span>{s.result.other}</span>
                <span className="font-mono">{result.otherConfidence}%</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <SectionTitle>{s.result.sampleMetadata}</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label={s.result.sampleId}    value={sample.id} />
              <Field label={s.result.captured}     value={formatTime(sample.capturedAt)} />
              <Field label={s.result.device}       value={sample.device} />
              <Field label={s.result.imageQuality} value={sample.quality.overall} />
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle>{s.result.imageQualitySection}</SectionTitle>
            <QualityChecks quality={sample.quality} />
          </section>
        </aside>
      </div>

      <LeafComparison imageUrl={sample.imageUrl} />
    </div>
  );
}
