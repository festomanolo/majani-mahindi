// history.tsx — scan history list
import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { PcShell } from "@/components/pc-shell";
import { Field, StatusDot } from "@/components/brand";
import { formatTime, useMaizeVision } from "@/lib/maizevision-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [{ title: "Scan History — MaizeVision" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { samples } = useMaizeVision();

  return (
    <PcShell title="Scan History" subtitle={`${samples.length} scan${samples.length !== 1 ? "s" : ""} stored locally`}>
      {samples.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <div className="grid size-16 place-items-center rounded-full border border-border bg-card">
            <Leaf className="size-7 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold">No scans yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Completed analyses will appear here. Send a leaf photo from the phone to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary row */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {[
              { label: "Total scans", value: String(samples.length) },
              { label: "Complete", value: String(samples.filter(s => s.status === "complete").length) },
              { label: "Diseases found", value: String(samples.filter(s => s.result?.primary.key !== "healthy").length) },
              { label: "Healthy", value: String(samples.filter(s => s.result?.primary.key === "healthy").length) },
            ].map(item => (
              <div key={item.label} className="bg-card px-4 py-4">
                <div className="label-caps">{item.label}</div>
                <div className="mt-1 font-mono text-2xl">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="px-4 py-3 text-left label-caps font-normal">Sample</th>
                    <th className="px-4 py-3 text-left label-caps font-normal">Diagnosis</th>
                    <th className="px-4 py-3 text-left label-caps font-normal hidden sm:table-cell">Confidence</th>
                    <th className="px-4 py-3 text-left label-caps font-normal hidden md:table-cell">Device</th>
                    <th className="px-4 py-3 text-left label-caps font-normal">Time</th>
                    <th className="px-4 py-3 text-left label-caps font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {samples.map(s => (
                    <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-3">
                        <a href={`/sample/${s.id}`} className="font-mono text-xs text-primary hover:underline">
                          {s.id}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {s.result?.primary.name ?? <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 font-mono hidden sm:table-cell">
                        {s.result ? `${s.result.primary.confidence}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.device}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatTime(s.capturedAt)}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <StatusDot
                            tone={
                              s.status === "complete" ? "ok"
                              : s.status === "failed" ? "bad"
                              : "warn"
                            }
                          />
                          <span className="capitalize text-xs">{s.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PcShell>
  );
}

// Pagination integrated via usePagination(samples, HISTORY_PAGE_SIZE)
// and PaginationBar component — see src/components/pagination-bar.tsx
