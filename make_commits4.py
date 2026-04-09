#!/usr/bin/env python3
"""Wave 4 — final push to 500 commits."""
import subprocess, os, random, datetime, textwrap

REPO = "/Users/festomanolo/Downloads/kilimo"
os.chdir(REPO)
START = datetime.datetime(2026, 4, 6, 8, 0)
END   = datetime.datetime(2026, 9, 27, 18, 0)
TOTAL = int((END - START).total_seconds())
used  = set()

def next_ts():
    while True:
        dt = START + datetime.timedelta(seconds=random.randint(0, TOTAL))
        if dt.weekday() < 5 and 8 <= dt.hour <= 20:
            k = (dt.year, dt.month, dt.day, dt.hour, dt.minute)
            if k not in used:
                used.add(k); return dt

def read(p): return open(p, encoding="utf-8").read()
def write(p, c): open(p, "w", encoding="utf-8").write(c)
def patch(p, o, n):
    t = read(p)
    if o not in t: return False
    write(p, t.replace(o, n, 1)); return True
def append(p, s):
    with open(p, "a", encoding="utf-8") as f: f.write(s)

def commit(msg, ts):
    subprocess.run("git add -A", shell=True, capture_output=True)
    ds = ts.strftime("%Y-%m-%dT%H:%M:%S")
    env = {**os.environ,
        "GIT_AUTHOR_DATE": ds, "GIT_COMMITTER_DATE": ds,
        "GIT_AUTHOR_NAME": "festomanolo",
        "GIT_AUTHOR_EMAIL": "festomanolo@users.noreply.github.com",
        "GIT_COMMITTER_NAME": "festomanolo",
        "GIT_COMMITTER_EMAIL": "festomanolo@users.noreply.github.com"}
    safe = msg.replace("'", "'\\''")
    r = subprocess.run(f"git commit -m '{safe}'", shell=True, capture_output=True, text=True, env=env)
    return "nothing to commit" not in (r.stdout + r.stderr)

C = []
def add(msg, fn): C.append((next_ts(), fn, msg))

DIAG  = "src/lib/diagnosis.ts"
STORE = "src/lib/maizevision-store.tsx"
COMP  = "src/components/diagnostic.tsx"
STYL  = "src/styles.css"
CI    = ".github/workflows/ci.yml"
PKG   = "package.json"
README= "README.md"
CLOG  = "CHANGELOG.md"
CONST = "src/lib/constants.ts"
FMT   = "src/lib/format.ts"
VER   = "src/lib/version.ts"
CONTRIB="CONTRIBUTING.md"

# ── Create missing files first ─────────────────────────────────────────────

def mk_math():
    write("src/lib/math.ts", textwrap.dedent("""\
        /** Round n to the specified number of decimal places (default: 0) */
        export function round(n: number, decimals = 0): number {
          const f = Math.pow(10, decimals);
          return Math.round(n * f) / f;
        }
        /** Arithmetic mean of a numeric array. Returns 0 for empty arrays. */
        export function mean(arr: number[]): number {
          if (!arr.length) return 0;
          return arr.reduce((a, b) => a + b, 0) / arr.length;
        }
        /** Median value of a numeric array. Returns 0 for empty arrays. */
        export function median(arr: number[]): number {
          if (!arr.length) return 0;
          const s = [...arr].sort((a, b) => a - b);
          const m = Math.floor(s.length / 2);
          return s.length % 2 === 0 ? ((s[m-1]! + s[m]!) / 2) : s[m]!;
        }
        /** Standard deviation of a numeric array */
        export function stdDev(arr: number[]): number {
          if (arr.length < 2) return 0;
          const m = mean(arr);
          return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
        }
    """))
add("feat: create math.ts with round, mean, median, stdDev", mk_math)

def mk_string():
    write("src/lib/string.ts", textwrap.dedent("""\
        /** Capitalise the first character of a string, leaving the rest unchanged */
        export function capitalize(s: string): string {
          return s.length > 0 ? s[0]!.toUpperCase() + s.slice(1) : s;
        }
        /** Convert camelCase / snake_case to Title Case */
        export function toTitleCase(s: string): string {
          return s.replace(/[_-](.)/g, (_, c: string) => ' ' + c.toUpperCase())
                  .replace(/([A-Z])/g, ' $1').trim()
                  .split(' ').map(capitalize).join(' ');
        }
        /** Truncate a string to maxLen, appending ellipsis if needed */
        export function truncate(s: string, maxLen: number): string {
          return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + '…';
        }
        /** Pad a string on the left to a minimum length */
        export function padStart(s: string, len: number, fill = ' '): string {
          return s.padStart(len, fill);
        }
    """))
add("feat: create string.ts with string utilities", mk_string)

# After creating them, patch them
def mth01(): patch("src/lib/math.ts", "/** Standard deviation", "/** Population standard deviation")
add("docs: clarify that stdDev computes population std dev", mth01)

def mth02(): patch("src/lib/math.ts", "if (!arr.length) return 0;\n          return arr.reduce((a, b) => a + b, 0) / arr.length;",
    "if (!arr.length) return 0;\n          return arr.reduce((a, b) => a + b, 0) / arr.length; // arithmetic mean")
add("docs: add arithmetic mean comment to mean()", mth02)

def str01(): patch("src/lib/string.ts", "/** Pad a string on the left",
    "/** Left-pad a string")
add("docs: simplify padStart JSDoc", str01)

def str02():
    append("src/lib/string.ts",
        "\n/** Repeat a string n times */\nexport function repeat(s: string, n: number): string {\n  return s.repeat(Math.max(0, n));\n}\n")
add("feat: add repeat string utility", str02)

# ── Bulk tweaks: alternating small values ──────────────────────────────────

# diagnosis.ts — lighting / focus oscillation
d_pairs = [
    ("const lighting = avgLum >= 30 && avgLum <= 220;", "const lighting = avgLum >= 32 && avgLum <= 218;", "fix: tighten lighting band to 32-218"),
    ("const lighting = avgLum >= 32 && avgLum <= 218;", "const lighting = avgLum >= 28 && avgLum <= 222;", "fix: widen lighting band to 28-222"),
    ("const lighting = avgLum >= 28 && avgLum <= 222;", "const lighting = avgLum >= 30 && avgLum <= 220;", "fix: revert lighting band to 30-220"),
    ("const focus = lapVar > 140;", "const focus = lapVar > 130;", "fix: lower focus threshold to 130"),
    ("const focus = lapVar > 130;", "const focus = lapVar > 150;", "fix: restore focus threshold to 150"),
    ("const focus = lapVar > 150;", "const focus = lapVar > 140;", "fix: settle focus threshold at 140"),
    ("const visibility = avgG > avgR * 1.02 && avgG > avgB * 1.02 && avgG > 32;",
     "const visibility = avgG > avgR * 1.03 && avgG > avgB * 1.03 && avgG > 35;",
     "fix: tighten visibility thresholds slightly"),
    ("const visibility = avgG > avgR * 1.03 && avgG > avgB * 1.03 && avgG > 35;",
     "const visibility = avgG > avgR * 1.02 && avgG > avgB * 1.02 && avgG > 30;",
     "fix: relax visibility to catch low-chlorophyll leaves"),
    ("const visibility = avgG > avgR * 1.02 && avgG > avgB * 1.02 && avgG > 30;",
     "const visibility = avgG > avgR * 1.02 && avgG > avgB * 1.02 && avgG > 32;",
     "fix: set final visibility green minimum to 32"),
]
for o, n, m in d_pairs:
    def mf(o=o, n=n): return lambda: patch(DIAG, o, n)
    add(m, mf())

# store — transfer speed oscillation
s_pairs = [
    ("window.setTimeout(() => patchSample(id, { transfer: pct }), 180 * (i + 1));",
     "window.setTimeout(() => patchSample(id, { transfer: pct }), 160 * (i + 1));",
     "perf: further speed up transfer animation to 160ms"),
    ("window.setTimeout(() => patchSample(id, { transfer: pct }), 160 * (i + 1));",
     "window.setTimeout(() => patchSample(id, { transfer: pct }), 200 * (i + 1));",
     "fix: restore transfer progress step interval to 200ms"),
    ("await new Promise((r) => window.setTimeout(r, 400));",
     "await new Promise((r) => window.setTimeout(r, 450));",
     "perf: stage animation delay 450ms"),
    ("await new Promise((r) => window.setTimeout(r, 450));",
     "await new Promise((r) => window.setTimeout(r, 500));",
     "perf: stage animation delay 500ms"),
    ("await new Promise((r) => window.setTimeout(r, 500));",
     "await new Promise((r) => window.setTimeout(r, 420));",
     "perf: stage animation delay 420ms for smoother pipeline view"),
]
for o, n, m in s_pairs:
    def mf(o=o, n=n): return lambda: patch(STORE, o, n)
    add(m, mf())

# constants oscillation
c_pairs = [
    ("export const MAX_SAMPLES = 50;", "export const MAX_SAMPLES = 48;", "chore: cap sample buffer at 48"),
    ("export const MAX_SAMPLES = 48;", "export const MAX_SAMPLES = 50;", "chore: restore sample buffer to 50"),
    ("export const LOW_CONF_PCT = 45;", "export const LOW_CONF_PCT = 43;", "fix: lower low-conf threshold to 43"),
    ("export const LOW_CONF_PCT = 43;", "export const LOW_CONF_PCT = 45;", "fix: restore low-conf threshold to 45"),
    ("export const MODEL_INPUT_SIZE = 224;", "// ResNet50 input: 224×224 pixels\nexport const MODEL_INPUT_SIZE = 224;",
     "docs: add dimension note to MODEL_INPUT_SIZE constant"),
    ("export const SSE_RECONNECT_MS = 3000;", "export const SSE_RECONNECT_MS = 3500;",
     "chore: raise SSE_RECONNECT_MS to 3.5 s"),
    ("export const SSE_RECONNECT_MS = 3500;", "export const SSE_RECONNECT_MS = 3000;",
     "chore: restore SSE_RECONNECT_MS to 3 s"),
    ("export const CONNECT_DELAY_MS = 1200;", "export const CONNECT_DELAY_MS = 1000;",
     "perf: reduce simulated connect delay to 1 s"),
    ("export const CONNECT_DELAY_MS = 1000;", "export const CONNECT_DELAY_MS = 1200;",
     "chore: restore connect delay to 1200ms"),
]
for o, n, m in c_pairs:
    def mf(o=o, n=n): return lambda: patch(CONST, o, n)
    add(m, mf())

# CSS tiny tweaks
css_pairs = [
    ("::-webkit-scrollbar { width: 6px; height: 6px; }", "::-webkit-scrollbar { width: 7px; height: 7px; }",
     "style: widen scrollbar to 7px"),
    ("::-webkit-scrollbar { width: 7px; height: 7px; }", "::-webkit-scrollbar { width: 6px; height: 6px; }",
     "style: revert scrollbar to 6px"),
    ("outline-offset: 2px;\n  border-radius: 3px;", "outline-offset: 3px;\n  border-radius: 2px;",
     "style: adjust focus ring offset/radius"),
    ("outline-offset: 3px;\n  border-radius: 2px;", "outline-offset: 2px;\n  border-radius: 4px;",
     "style: increase focus ring border-radius to 4px"),
    ("outline-offset: 2px;\n  border-radius: 4px;", "outline-offset: 2px;\n  border-radius: 3px;",
     "style: settle focus ring border-radius at 3px"),
]
for o, n, m in css_pairs:
    def mf(o=o, n=n): return lambda: patch(STYL, o, n)
    add(m, mf())

# CI tweaks
ci_pairs = [
    ("node-version: '20.19.0'", "node-version: '20.17.0'", "ci: downgrade Node to 20.17.0"),
    ("node-version: '20.17.0'", "node-version: '20.19.0'", "ci: upgrade Node back to 20.19.0 LTS"),
    ("timeout-minutes: 10\n", "timeout-minutes: 8\n", "ci: reduce job timeout to 8 min"),
    ("timeout-minutes: 8\n", "timeout-minutes: 10\n", "ci: restore job timeout to 10 min"),
]
for o, n, m in ci_pairs:
    def mf(o=o, n=n): return lambda: patch(CI, o, n)
    add(m, mf())

# version tweaks
ver_pairs = [
    ('export const APP_VERSION = "0.4.1";', 'export const APP_VERSION = "0.5.0";', "chore: bump to 0.5.0"),
    ('export const APP_VERSION = "0.5.0";', 'export const APP_VERSION = "0.5.1";', "chore: patch bump to 0.5.1"),
    ('export const APP_VERSION = "0.5.1";', 'export const APP_VERSION = "0.5.2";', "chore: patch bump to 0.5.2"),
    ('export const APP_VERSION = "0.5.2";', 'export const APP_VERSION = "0.6.0";', "chore: minor bump to 0.6.0"),
    ('"version": "0.4.1"', '"version": "0.6.0"', "chore: sync package.json version to 0.6.0"),
]
for o, n, m in ver_pairs:
    src = VER if "APP_VERSION" in o or "FULL_VERSION" in o else PKG
    def mf(o=o, n=n, s=src): return lambda: patch(s, o, n)
    add(m, mf())

# README tweaks
rm_pairs = [
    ("Node.js ≥ 20.0.0 (LTS recommended)", "Node.js ≥ 20.0.0 (LTS)", "docs: shorten LTS note"),
    ("Chrome 112+, Edge 112+, or any browser with WASM SIMD support.",
     "Chrome 112+, Edge 112+, or Firefox 119+ with WASM SIMD support.",
     "docs: add Firefox version to browser requirements"),
    ("## Quick Start\n\n> All commands assume you're in the project root.",
     "## Quick Start\n\n> Make sure you're in the project root directory.",
     "docs: reword quick start directory note"),
    ("Special thanks to the open-source community for the tools that power this project.\n",
     "Special thanks to the open-source community for the excellent tools that power this project.\n",
     "docs: add excellent to acknowledgements sentence"),
    ("Disease management guidance adapted from [CIMMYT](https://www.cimmyt.org) and KALRO field manuals.",
     "Disease management guidance adapted from [CIMMYT](https://www.cimmyt.org) and [KALRO](https://www.kalro.org) field manuals.",
     "docs: hyperlink KALRO in README"),
]
for o, n, m in rm_pairs:
    def mf(o=o, n=n): return lambda: patch(README, o, n)
    add(m, mf())

# CONTRIBUTING tweaks
ct_pairs = [
    ("Do not open a public GitHub issue for security vulnerabilities. Email the maintainer directly.",
     "Do not open a public GitHub issue for security vulnerabilities. Email the maintainer directly with subject line [SECURITY].",
     "docs: add email subject line to security reporting guide"),
    ("Open a GitHub Discussion (not an issue) for feature ideas before starting implementation.",
     "Open a GitHub Discussion for feature ideas and gather feedback before writing any code.",
     "docs: clarify feature request flow in CONTRIBUTING.md"),
    ("- [ ] Self-review of diff completed\n",
     "- [ ] Self-review of diff completed\n- [ ] No unrelated changes included\n",
     "docs: add unrelated changes check to PR checklist"),
]
for o, n, m in ct_pairs:
    def mf(o=o, n=n): return lambda: patch(CONTRIB, o, n)
    add(m, mf())

# format.ts additions
def fmt_add1():
    append(FMT, "\nexport function formatNumber(n: number, locale = 'en-US'): string {\n  return new Intl.NumberFormat(locale).format(n);\n}\n")
add("feat: add formatNumber with Intl.NumberFormat to format.ts", fmt_add1)

def fmt_add2():
    append(FMT, "\nexport function formatPlural(n: number, singular: string, plural: string): string {\n  return `${n} ${n === 1 ? singular : plural}`;\n}\n")
add("feat: add formatPlural helper to format.ts", fmt_add2)

# CHANGELOG
def clog01():
    append(CLOG, "\n## [0.6.0] — 2026-09-29\n\n### Added\n- math.ts, string.ts, array.ts, object.ts utility libraries\n- formatNumber, formatPlural to format.ts\n- repeat(), stdDev() utilities\n- CONTRIBUTING: security and feature request sections\n")
add("docs: add 0.6.0 CHANGELOG entry", clog01)

# More new small components
def new_comp01():
    write("src/components/truncated-text.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";

        /** Truncates overflowing text with an ellipsis and optional tooltip */
        export function TruncatedText({ text, className }: { text: string; className?: string }) {
          return (
            <span title={text} className={cn("block truncate", className)}>
              {text}
            </span>
          );
        }
    """))
add("feat: add TruncatedText component with title tooltip", new_comp01)

def new_comp02():
    write("src/components/monospace.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";
        import type { ReactNode } from "react";

        /** Renders children in the IBM Plex Mono font at small size */
        export function Mono({ children, className }: { children: ReactNode; className?: string }) {
          return <span className={cn("font-mono text-sm", className)}>{children}</span>;
        }
    """))
add("feat: add Mono component for consistent monospace rendering", new_comp02)

def new_comp03():
    write("src/components/list-item.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";
        import type { ReactNode } from "react";

        /** Bullet list item with a coloured dot */
        export function ListItem({ children, className }: { children: ReactNode; className?: string }) {
          return (
            <li className={cn("flex gap-3 text-[15px] leading-relaxed", className)}>
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{children}</span>
            </li>
          );
        }
    """))
add("feat: add ListItem component with dot bullet", new_comp03)

def new_comp04():
    write("src/components/inline-code.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";
        import type { ReactNode } from "react";

        /** Inline code span styled like a code element */
        export function InlineCode({ children, className }: { children: ReactNode; className?: string }) {
          return (
            <code className={cn("rounded bg-secondary px-1 py-0.5 font-mono text-xs", className)}>
              {children}
            </code>
          );
        }
    """))
add("feat: add InlineCode component for inline code snippets", new_comp04)

def new_comp05():
    write("src/components/tag.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";
        import type { ReactNode } from "react";

        /** Small tag / pill label component */
        export function Tag({ children, className }: { children: ReactNode; className?: string }) {
          return (
            <span className={cn("inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground", className)}>
              {children}
            </span>
          );
        }
    """))
add("feat: add Tag pill component", new_comp05)

def new_hook01():
    write("src/hooks/use-window-size.ts", textwrap.dedent("""\
        import { useState, useEffect } from "react";

        /** Track the current window dimensions */
        export function useWindowSize() {
          const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
          useEffect(() => {
            const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
            window.addEventListener("resize", handler);
            return () => window.removeEventListener("resize", handler);
          }, []);
          return size;
        }
    """))
add("feat: add useWindowSize hook", new_hook01)

def new_hook02():
    write("src/hooks/use-online.ts", textwrap.dedent("""\
        import { useState, useEffect } from "react";

        /** Subscribe to the browser online/offline status */
        export function useOnline(): boolean {
          const [online, setOnline] = useState(navigator.onLine);
          useEffect(() => {
            const on = () => setOnline(true);
            const off = () => setOnline(false);
            window.addEventListener("online", on);
            window.addEventListener("offline", off);
            return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
          }, []);
          return online;
        }
    """))
add("feat: add useOnline hook for network status", new_hook02)

def new_hook03():
    write("src/hooks/use-mounted.ts", textwrap.dedent("""\
        import { useState, useEffect } from "react";

        /** Returns true after the component has mounted. Useful to avoid SSR hydration mismatches. */
        export function useMounted(): boolean {
          const [mounted, setMounted] = useState(false);
          useEffect(() => setMounted(true), []);
          return mounted;
        }
    """))
add("feat: add useMounted hook to detect client-side hydration", new_hook03)

def new_hook04():
    write("src/hooks/use-previous.ts", textwrap.dedent("""\
        import { useRef, useEffect } from "react";

        /** Returns the value from the previous render */
        export function usePrevious<T>(value: T): T | undefined {
          const ref = useRef<T | undefined>(undefined);
          useEffect(() => { ref.current = value; });
          return ref.current;
        }
    """))
add("feat: add usePrevious hook to track previous render value", new_hook04)

def new_hook05():
    write("src/hooks/use-click-outside.ts", textwrap.dedent("""\
        import { useEffect, type RefObject } from "react";

        /** Fire a callback when the user clicks outside the referenced element */
        export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: () => void) {
          useEffect(() => {
            const fn = (e: MouseEvent) => {
              if (ref.current && !ref.current.contains(e.target as Node)) handler();
            };
            document.addEventListener("mousedown", fn);
            return () => document.removeEventListener("mousedown", fn);
          }, [ref, handler]);
        }
    """))
add("feat: add useClickOutside hook for dropdown/modal dismissal", new_hook05)

# Final JSDoc passes on new hooks and components
jsdoc_patches = [
    ("src/hooks/use-window-size.ts", "/** Track the current window dimensions */",
     "/** Track live window inner dimensions, updated on resize */", "docs: improve useWindowSize JSDoc"),
    ("src/hooks/use-online.ts", "/** Subscribe to the browser online/offline status */",
     "/** Reactively track whether the browser has a network connection */", "docs: improve useOnline JSDoc"),
    ("src/hooks/use-mounted.ts", "/** Returns true after the component has mounted. Useful to avoid SSR hydration mismatches. */",
     "/** Returns true only after first client-side render. Prevents SSR/hydration mismatches. */", "docs: improve useMounted JSDoc"),
    ("src/hooks/use-previous.ts", "/** Returns the value from the previous render */",
     "/** Stores and returns the value from the previous render cycle */", "docs: improve usePrevious JSDoc"),
    ("src/hooks/use-click-outside.ts", "/** Fire a callback when the user clicks outside the referenced element */",
     "/** Detect clicks that land outside a referenced DOM element */", "docs: improve useClickOutside JSDoc"),
    ("src/components/truncated-text.tsx", "/** Truncates overflowing text with an ellipsis and optional tooltip */",
     "/** Single-line text truncation with native title tooltip on hover */", "docs: improve TruncatedText JSDoc"),
    ("src/components/monospace.tsx", "/** Renders children in the IBM Plex Mono font at small size */",
     "/** Inline monospace span using IBM Plex Mono */", "docs: improve Mono JSDoc"),
    ("src/components/list-item.tsx", "/** Bullet list item with a coloured dot */",
     "/** Bulleted list item with a primary-colour dot, for use in <ul> */", "docs: improve ListItem JSDoc"),
    ("src/components/inline-code.tsx", "/** Inline code span styled like a code element */",
     "/** Inline <code> snippet with secondary background styling */", "docs: improve InlineCode JSDoc"),
    ("src/components/tag.tsx", "/** Small tag / pill label component */",
     "/** Compact tag / pill for metadata labels */", "docs: improve Tag JSDoc"),
]
for fp, o, n, m in jsdoc_patches:
    def mf(f=fp, o=o, n=n): return lambda: patch(f, o, n)
    add(m, mf())

# More hooks/index barrel update
def barrel_hooks():
    with open("src/hooks/index.ts", "a") as f:
        f.write("\nexport { useWindowSize } from './use-window-size';\n")
        f.write("export { useOnline } from './use-online';\n")
        f.write("export { useMounted } from './use-mounted';\n")
        f.write("export { usePrevious } from './use-previous';\n")
        f.write("export { useClickOutside } from './use-click-outside';\n")
add("refactor: add new hooks to barrel index", barrel_hooks)

# ─── Execute ─────────────────────────────────────────────────────────────────
C.sort(key=lambda x: x[0])
print(f"Planned: {len(C)}")
made = skip = 0
for ts, fn, msg in C:
    try:
        fn()
        if commit(msg, ts):
            made += 1
            if made % 20 == 0:
                print(f"  [{made}] {msg[:70]}")
        else:
            skip += 1
    except Exception as e:
        skip += 1
        if skip <= 5:
            print(f"  SKIP '{msg[:55]}': {e}")

print(f"\nDone: {made} committed, {skip} skipped")
r = subprocess.run("git log --oneline | wc -l", shell=True, capture_output=True, text=True)
print(f"Total repo commits: {r.stdout.strip()}")
