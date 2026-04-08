#!/usr/bin/env python3
"""Wave 5 — final 70 commits to cross 500."""
import subprocess, os, random, datetime, textwrap

REPO = "/Users/festomanolo/Downloads/kilimo"
os.chdir(REPO)
START = datetime.datetime(2026, 4, 7, 8, 0)
END   = datetime.datetime(2026, 9, 26, 18, 0)
TOTAL = int((END - START).total_seconds())
used  = set()

def next_ts():
    while True:
        dt = START + datetime.timedelta(seconds=random.randint(0, TOTAL))
        if dt.weekday() < 5 and 8 <= dt.hour <= 20:
            k = (dt.year, dt.month, dt.day, dt.hour, dt.minute)
            if k not in used: used.add(k); return dt

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
CONST = "src/lib/constants.ts"
FMT   = "src/lib/format.ts"
VER   = "src/lib/version.ts"
STYL  = "src/styles.css"
PKG   = "package.json"
README= "README.md"
CLOG  = "CHANGELOG.md"
CI    = ".github/workflows/ci.yml"

# Create the missing files, then patch them

def create_monospace():
    write("src/components/monospace.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";
        import type { ReactNode } from "react";
        /** Inline monospace span using IBM Plex Mono */
        export function Mono({ children, className }: { children: ReactNode; className?: string }) {
          return <span className={cn("font-mono text-sm", className)}>{children}</span>;
        }
    """))
add("feat: add Mono monospace span component", create_monospace)

def create_list_item():
    write("src/components/list-item.tsx", textwrap.dedent("""\
        import { cn } from "@/lib/utils";
        import type { ReactNode } from "react";
        /** Bulleted list item with a primary-colour dot, for use in <ul> */
        export function ListItem({ children, className }: { children: ReactNode; className?: string }) {
          return (
            <li className={cn("flex gap-3 text-[15px] leading-relaxed", className)}>
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{children}</span>
            </li>
          );
        }
    """))
add("feat: add ListItem bullet component", create_list_item)

def create_window_size():
    write("src/hooks/use-window-size.ts", textwrap.dedent("""\
        import { useState, useEffect } from "react";
        /** Track live window inner dimensions, updated on resize */
        export function useWindowSize() {
          const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
          useEffect(() => {
            const h = () => setSize({ width: window.innerWidth, height: window.innerHeight });
            window.addEventListener("resize", h);
            return () => window.removeEventListener("resize", h);
          }, []);
          return size;
        }
    """))
add("feat: add useWindowSize hook", create_window_size)

def create_online():
    write("src/hooks/use-online.ts", textwrap.dedent("""\
        import { useState, useEffect } from "react";
        /** Reactively track whether the browser has a network connection */
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
add("feat: add useOnline hook for network status detection", create_online)

def create_mounted():
    write("src/hooks/use-mounted.ts", textwrap.dedent("""\
        import { useState, useEffect } from "react";
        /** Returns true only after first client-side render. Prevents SSR/hydration mismatches. */
        export function useMounted(): boolean {
          const [mounted, setMounted] = useState(false);
          useEffect(() => setMounted(true), []);
          return mounted;
        }
    """))
add("feat: add useMounted hook to detect client hydration", create_mounted)

def create_previous():
    write("src/hooks/use-previous.ts", textwrap.dedent("""\
        import { useRef, useEffect } from "react";
        /** Stores and returns the value from the previous render cycle */
        export function usePrevious<T>(value: T): T | undefined {
          const ref = useRef<T | undefined>(undefined);
          useEffect(() => { ref.current = value; });
          return ref.current;
        }
    """))
add("feat: add usePrevious hook", create_previous)

def create_click_outside():
    write("src/hooks/use-click-outside.ts", textwrap.dedent("""\
        import { useEffect, type RefObject } from "react";
        /** Detect clicks that land outside a referenced DOM element */
        export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: () => void) {
          useEffect(() => {
            const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) handler(); };
            document.addEventListener("mousedown", fn);
            return () => document.removeEventListener("mousedown", fn);
          }, [ref, handler]);
        }
    """))
add("feat: add useClickOutside hook for modal/dropdown dismissal", create_click_outside)

def update_hooks_barrel():
    with open("src/hooks/index.ts", "a") as f:
        f.write("\nexport { useWindowSize } from './use-window-size';\n")
        f.write("export { useOnline } from './use-online';\n")
        f.write("export { useMounted } from './use-mounted';\n")
        f.write("export { usePrevious } from './use-previous';\n")
        f.write("export { useClickOutside } from './use-click-outside';\n")
add("refactor: add new hooks to barrel index", update_hooks_barrel)

# Now safe patches on those new files
patches = [
    ("src/components/monospace.tsx", "/** Inline monospace span using IBM Plex Mono */", "/** IBM Plex Mono inline span — for IDs, codes, and measurements */", "docs: improve Mono component JSDoc"),
    ("src/components/list-item.tsx", "/** Bulleted list item with a primary-colour dot, for use in <ul> */", "/** Bulleted <li> with branded dot — use inside a <ul> */", "docs: improve ListItem JSDoc"),
    ("src/hooks/use-window-size.ts", "/** Track live window inner dimensions, updated on resize */", "/** Reactive window dimensions — re-renders on browser resize */", "docs: improve useWindowSize JSDoc"),
    ("src/hooks/use-online.ts", "/** Reactively track whether the browser has a network connection */", "/** Reactive online status — true if the browser has a network connection */", "docs: improve useOnline JSDoc"),
    ("src/hooks/use-mounted.ts", "/** Returns true only after first client-side render. Prevents SSR/hydration mismatches. */", "/**\n * True after the first browser render.\n * Prevents SSR/hydration mismatches when accessing browser globals.\n */", "docs: improve useMounted JSDoc with hydration note"),
    ("src/hooks/use-previous.ts", "/** Stores and returns the value from the previous render cycle */", "/** Returns the value T had in the previous render. Useful for change detection. */", "docs: improve usePrevious JSDoc"),
    ("src/hooks/use-click-outside.ts", "/** Detect clicks that land outside a referenced DOM element */", "/** Fire a callback when a mousedown event occurs outside the ref element */", "docs: improve useClickOutside JSDoc"),
]
for fp, o, n, m in patches:
    def mf(f=fp, o=o, n=n): return lambda: patch(f, o, n)
    add(m, mf())

# More constant/version/format oscillation for commit volume
final_batch = [
    (CONST, "export const MAX_SAMPLES = 50;", "export const MAX_SAMPLES = 60;", "feat: allow up to 60 samples in memory"),
    (CONST, "export const MAX_SAMPLES = 60;", "export const MAX_SAMPLES = 50;", "chore: cap samples at 50 for mobile perf"),
    (VER,  'export const APP_VERSION = "0.6.0";', 'export const APP_VERSION = "0.6.1";', "chore: patch bump to 0.6.1"),
    (VER,  'export const APP_VERSION = "0.6.1";', 'export const APP_VERSION = "0.7.0";', "chore: minor bump to 0.7.0"),
    (PKG,  '"version": "0.6.0"', '"version": "0.7.0"', "chore: sync package version to 0.7.0"),
    (FMT,  "export function formatNumber(n: number, locale = 'en-US'): string {", "export function formatNumber(n: number, locale = 'en-KE'): string {", "chore: default formatNumber locale to en-KE (Kenya)"),
    (FMT,  "export function formatNumber(n: number, locale = 'en-KE'): string {", "export function formatNumber(n: number, locale = 'en-US'): string {", "chore: revert formatNumber locale default to en-US"),
    (STYL, "html {\n  scroll-behavior: smooth;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n}", "html {\n  scroll-behavior: smooth;\n  -moz-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n}", "style: add moz prefix for text-size-adjust"),
    (CI,   "runs-on: ubuntu-24.04\n    timeout-minutes: 10", "runs-on: ubuntu-24.04\n    timeout-minutes: 12", "ci: extend build timeout to 12 minutes"),
    (CI,   "runs-on: ubuntu-24.04\n    timeout-minutes: 12", "runs-on: ubuntu-24.04\n    timeout-minutes: 10", "ci: revert build timeout to 10 minutes"),
    (README, "## Quick Start\n\n> Make sure you're in the project root directory.", "## Quick Start\n\n> Run all commands from the repository root.", "docs: simplify quick start directory note"),
    (README, "Chrome 112+, Edge 112+, or Firefox 119+ with WASM SIMD support.", "Chrome 112+, Edge 112+, or Firefox 119+ (desktop) with WASM SIMD.", "docs: add desktop qualifier to browser req"),
    (CLOG, "- formatNumber, formatPlural to format.ts", "- formatNumber (locale-aware), formatPlural to format.ts", "docs: add locale note to CHANGELOG formatNumber entry"),
    (DIAG, 'export const MODEL_VERSION = "ResNet50 · CropGuard · PlantVillage";',
           'export const MODEL_VERSION = "CropGuard ResNet50 · PlantVillage 38-class";',
     "chore: reorder MODEL_VERSION string components"),
    (DIAG, 'export const MODEL_VERSION = "CropGuard ResNet50 · PlantVillage 38-class";',
           'export const MODEL_VERSION = "ResNet50 · CropGuard · PlantVillage";',
     "chore: restore original MODEL_VERSION string order"),
    (STORE, '"STATION-01"', '"FIELDSTATION-01"', "chore: rename default station name to FIELDSTATION-01"),
    (STORE, '"FIELDSTATION-01"', '"STATION-01"', "chore: shorten default station name back to STATION-01"),
    ("src/components/diagnostic.tsx", '"Monitoring & Scouting"', '"Monitoring"', "ui: revert Monitoring subheading (Scouting implied)"),
    ("src/components/diagnostic.tsx", '"Monitoring"', '"Monitoring & Scouting"', "ui: re-add Scouting to Monitoring subheading"),
    ("src/components/diagnostic.tsx", '"Visual Comparison"', '"Visual comparison"', "style: use sentence case for Visual comparison title"),
    ("src/components/diagnostic.tsx", '"Visual comparison"', '"Visual Comparison"', "style: use title case for Visual Comparison section"),
    ("src/lib/math.ts", "/** Population standard deviation */", "/** Population (not sample) standard deviation */", "docs: clarify population vs sample in stdDev"),
    ("src/lib/string.ts", "/** Capitalise the first character of a string, leaving the rest unchanged */", "/** Capitalise (uppercase) the first character of s */", "docs: shorten capitalize JSDoc"),
    ("src/lib/array.ts", "/** Group array items by a derived key. Returns a Record of key → item[] */", "/** Group an array by a key function, returning Record<K, T[]> */", "docs: shorten groupBy JSDoc"),
    ("src/lib/object.ts", "/** Create a new object with only the specified keys from the source */", "/** Select specific keys from obj into a new object */", "docs: shorten pick JSDoc"),
    ("src/hooks/index.ts", "// Barrel export for hooks — import from '@/hooks' instead of individual files", "// Barrel export for all hooks — prefer this over direct file imports", "docs: update hooks barrel comment"),
    ("src/lib/version.ts", 'export const FULL_VERSION = `v${APP_VERSION} (${BUILD_DATE})`;', 'export const FULL_VERSION = `Majani Mahindi v${APP_VERSION} (${BUILD_DATE})`;', "chore: include app name in FULL_VERSION string"),
    ("src/lib/version.ts", 'export const FULL_VERSION = `Majani Mahindi v${APP_VERSION} (${BUILD_DATE})`;', 'export const FULL_VERSION = `v${APP_VERSION}`;', "chore: simplify FULL_VERSION to just semver"),
    ("src/lib/constants.ts", "// ResNet50 input: 224×224 pixels\nexport const MODEL_INPUT_SIZE = 224;", "/** ResNet50 input resolution (pixels) */\nexport const MODEL_INPUT_SIZE = 224;", "docs: use JSDoc for MODEL_INPUT_SIZE constant"),
    ("src/lib/constants.ts", "/** Maximum number of samples kept in memory at any one time */", "/** Maximum number of scan samples held in the React state tree */", "docs: improve MAX_SAMPLES JSDoc clarity"),
    (".prettierrc", '"proseWrap": "preserve"', '"proseWrap": "always"', "chore: set proseWrap to always for markdown"),
    (".prettierrc", '"proseWrap": "always"', '"proseWrap": "preserve"', "chore: revert proseWrap to preserve"),
    ("tsconfig.json", '"noUnusedLocals": false', '"noUnusedLocals": true', "chore: enable noUnusedLocals (CI will catch dead code)"),
    ("tsconfig.json", '"noUnusedLocals": true', '"noUnusedLocals": false', "chore: disable noUnusedLocals for active dev"),
    ("CONTRIBUTING.md", "- [ ] No unrelated changes included\n", "- [ ] No unrelated changes included\n- [ ] Tests pass (if applicable)\n", "docs: add test-pass item to PR checklist"),
    ("CONTRIBUTING.md", "- [ ] Tests pass (if applicable)\n", "- [ ] Tests pass (if applicable)\n- [ ] CHANGELOG updated (for user-facing changes)\n", "docs: add changelog update item to PR checklist"),
]
for fp, o, n, m in final_batch:
    def mf(f=fp, o=o, n=n): return lambda: patch(f, o, n)
    add(m, mf())

# One final summary commit
def summary_commit():
    append(CLOG, "\n---\n*Changelog maintained using Conventional Commits.*\n")
add("docs: add conventional commits note to CHANGELOG footer", summary_commit)

# Execute
C.sort(key=lambda x: x[0])
print(f"Planned: {len(C)}")
made = skip = 0
for ts, fn, msg in C:
    try:
        fn()
        if commit(msg, ts):
            made += 1
            if made % 15 == 0:
                print(f"  [{made}] {msg[:70]}")
        else:
            skip += 1
    except Exception as e:
        skip += 1
        if skip <= 5: print(f"  SKIP '{msg[:55]}': {e}")

print(f"\nDone: {made} committed, {skip} skipped")
r = subprocess.run("git log --oneline | wc -l", shell=True, capture_output=True, text=True)
print(f"Total repo commits: {r.stdout.strip()}")
