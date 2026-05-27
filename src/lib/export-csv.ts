import type { Sample } from "./maizevision-store";

const CSV_HEADERS = ["Sample ID", "Date", "Device", "Condition", "Confidence (%)", "Quality"];

function escapeCsv(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function samplesToCSV(samples: Sample[]): string {
  const rows = samples
    .filter((s) => s.status === "complete")
    .map((s) => [
      s.id,
      new Date(s.capturedAt).toISOString(),
      s.device,
      s.result?.primary.name ?? "",
      String(s.result?.primary.confidence ?? ""),
      s.quality.overall,
    ].map(escapeCsv).join(","));

  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

export function downloadCSV(csv: string, filename = "maizevision-export.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.style.display = "none";
  document.body.appendChild(a);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
