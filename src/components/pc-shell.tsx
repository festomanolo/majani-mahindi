// pc-shell.tsx — top-level desktop chrome
import { Link, useRouterState } from "@tanstack/react-router";
import React from "react";
import {
  Activity,
  CircleGauge,
  FileText,
  History,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";
import { MODEL_VERSION } from "@/lib/diagnosis";
import { useMaizeVision } from "@/lib/maizevision-store";
import { StatusDot, Wordmark } from "@/components/brand";
import { LangToggle } from "@/components/lang-toggle";
import { useI18n } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

/**
 * Desktop application chrome: top nav, page header, and content area.
 * Wraps every PC-side route.
 */
export function PcShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { connection, samples } = useMaizeVision();
  const { strings } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const connected = connection.status === "connected";

  const NAV = [
    { to: "/",         label: strings.nav.dashboard,    icon: CircleGauge },
    { to: "/analysis", label: strings.nav.analysis,     icon: Activity },
    { to: "/history",  label: strings.nav.history,      icon: History },
    { to: "/reports",  label: strings.nav.reports,      icon: FileText },
    { to: "/system",   label: strings.nav.system,       icon: SlidersHorizontal },
  ] as const;

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Wordmark subtitle={strings.shell.wordmarkSubtitle} />
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/phone"
            className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <Smartphone className="size-4 shrink-0" strokeWidth={1.75} />
            {strings.nav.phoneScanner}
          </Link>
        </nav>

        <div className="hidden border-t border-sidebar-border p-5 lg:block">
          <div className="label-caps">{strings.shell.station}</div>
          <dl className="mt-3 space-y-2 text-xs">
            {([
              [strings.shell.device,  connected ? connection.phoneName : strings.common.none],
              [strings.shell.network, connection.network],
              [strings.shell.model,   MODEL_VERSION],
              [strings.shell.scans,   String(samples.length)],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="truncate font-mono text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {strings.shell.aiLocal}
          </p>
          {/* Language toggle */}
          <div className="mt-4">
            <LangToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-[-0.02em] lg:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {/* Language toggle visible on mobile/top bar */}
            <LangToggle className="hidden sm:flex" />
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
              <StatusDot tone={connected ? "ok" : "warn"} live={connected} />
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase">
                {connected ? strings.shell.phoneConnected : strings.shell.waitingScanner}
              </span>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
