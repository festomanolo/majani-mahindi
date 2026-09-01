import type { Sample } from "./maizevision-store";
import type { ConditionKey } from "./diagnosis";

export type ConditionCount = { key: ConditionKey; name: string; count: number; pct: number };

/** Aggregated statistics computed from a list of samples */
export type ReportStats = {
  total: number;
  completed: number;
  byCondition: ConditionCount[];
  avgConfidence: number;
  thisWeek: number;
  lastWeek: number;
};

// Display names for each condition key
const CONDITION_NAMES: Record<ConditionKey, string> = {
  healthy: "Healthy",
  rust: "Common Rust",
  blight: "Northern Leaf Blight",
  gray_leaf_spot: "Gray Leaf Spot",
};

/** Get the Unix ms timestamp for the start of Monday (or N weeks ago) */
function weekStart(offset = 0): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() - offset * 7);
  return d.getTime();
}

/** Compute summary statistics from all completed samples */
export function computeStats(samples: Sample[]): ReportStats {
  const completed = samples.filter((s) => s.status === "complete");
  const total = samples.length;

  const counts: Partial<Record<ConditionKey, number>> = {};
  let confSum = 0;
  for (const s of completed) {
    if (!s.result) continue;
    const k = s.result.primary.key;
    counts[k] = (counts[k] ?? 0) + 1;
    confSum += s.result.primary.confidence;
  }

  const byCondition: ConditionCount[] = (Object.entries(counts) as [ConditionKey, number][]).map(
    ([key, count]) => ({
      key,
      name: CONDITION_NAMES[key],
      count,
      pct: completed.length > 0 ? Math.round((count / completed.length) * 100) : 0,
    }),
  ).sort((a, b) => b.count - a.count);

  const thisWeekStart = weekStart(0);
  const lastWeekStart = weekStart(1);
  const thisWeek = samples.filter((s) => s.capturedAt >= thisWeekStart).length;
  const lastWeek = samples.filter((s) => s.capturedAt >= lastWeekStart && s.capturedAt < thisWeekStart).length;

  return {
    total,
    completed: completed.length,
    byCondition,
    avgConfidence: completed.length > 0 ? Math.round(confSum / completed.length) : 0,
    thisWeek,
    lastWeek,
  };
}

/** Return the most common condition key, or null if no completed samples */
export function topCondition(stats: ReportStats): string | null {
  return stats.byCondition[0]?.name ?? null;
}
