/**
 * Development-only assertion. Throws in dev, no-ops in production.
 * Use to catch programmer errors early without shipping dead branches.
 */
export function assert(condition: unknown, message: string): asserts condition {
  // Only throws in development builds
  if (import.meta.env.DEV && !condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
