export const en = {
  dashboard: {
    title: "Diagnostic Station",
    subtitle: "Local AI maize leaf analysis",
    readyForLeaf: "Ready for a new leaf",
    waitingPhone: "Waiting for mobile scanner. Pair a phone on this network to begin.",
    scanNow: "Scan a maize leaf from the connected phone to begin analysis.",
    openPhoneScanner: "Open phone scanner",
    recentScans: "Recent scans",
    noScans: "No scans yet. Completed analyses are stored on this computer only.",
    viewAll: "View all",
  },
  analysis: {
    title: "Analysis",
    confidence: "Confidence",
    openReport: "Open full report",
    analyzeLeaf: "Analyze leaf",
  },
  quality: {
    good: "Good",
    fair: "Fair",
    low: "Low",
    lighting: "Lighting",
    focus: "Focus",
    leafVisibility: "Leaf visibility",
    background: "Background",
  },
  common: {
    loading: "Loading…",
    error: "Error",
    retry: "Retry",
    back: "Back",
  },
} as const;
export type I18nKeys = typeof en;
