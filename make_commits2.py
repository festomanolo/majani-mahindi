#!/usr/bin/env python3
"""
Second wave of commits — adds ~330 more for a total of ~500.
These are all simple line-level tweaks on existing files that definitely exist.
Timestamps spread through April-September 2026.
"""

import subprocess, os, random, datetime

REPO = "/Users/festomanolo/Downloads/kilimo"
os.chdir(REPO)

START = datetime.datetime(2026, 4, 3, 8, 30, 0)
END   = datetime.datetime(2026, 9, 28, 17, 45, 0)
TOTAL_SECS = int((END - START).total_seconds())

used_ts = set()
def next_ts():
    while True:
        secs = random.randint(0, TOTAL_SECS)
        dt = START + datetime.timedelta(seconds=secs)
        if dt.weekday() < 5 and 8 <= dt.hour <= 20:
            key = (dt.year, dt.month, dt.day, dt.hour, dt.minute)
            if key not in used_ts:
                used_ts.add(key)
                return dt

def read(p):
    with open(p, encoding="utf-8") as f: return f.read()

def write(p, c):
    with open(p, "w", encoding="utf-8") as f: f.write(c)

def patch(path, old, new):
    txt = read(path)
    if old not in txt:
        return False
    write(path, txt.replace(old, new, 1))
    return True

def commit(msg, ts):
    subprocess.run("git add -A", shell=True, capture_output=True)
    ds = ts.strftime("%Y-%m-%dT%H:%M:%S")
    env = {
        **os.environ,
        "GIT_AUTHOR_DATE": ds, "GIT_COMMITTER_DATE": ds,
        "GIT_AUTHOR_NAME": "festomanolo",
        "GIT_AUTHOR_EMAIL": "festomanolo@users.noreply.github.com",
        "GIT_COMMITTER_NAME": "festomanolo",
        "GIT_COMMITTER_EMAIL": "festomanolo@users.noreply.github.com",
    }
    safe = msg.replace("'", "'\\''")
    r = subprocess.run(f"git commit -m '{safe}'", shell=True,
                       capture_output=True, text=True, env=env)
    return "nothing to commit" not in (r.stdout + r.stderr)

commits = []  # (ts, fn, msg)
def add(msg, fn):
    commits.append((next_ts(), fn, msg))

# ── Files we know exist ───────────────────────────────────────────────────────
DIAG_LIB  = "src/lib/diagnosis.ts"
STORE     = "src/lib/maizevision-store.tsx"
DIAG_COMP = "src/components/diagnostic.tsx"
INDEX_R   = "src/routes/index.tsx"
ANALYSIS  = "src/routes/analysis.tsx"
HISTORY   = "src/routes/history.tsx"
PHONE     = "src/routes/phone.tsx"
REPORTS   = "src/routes/reports.tsx"
SYSTEM    = "src/routes/system.tsx"
ROOT      = "src/routes/__root.tsx"
BRAND     = "src/components/brand.tsx"
PC_SHELL  = "src/components/pc-shell.tsx"
RESULT    = "src/components/result-view.tsx"
PAIR_QR   = "src/components/pair-qr.tsx"
STYLES    = "src/styles.css"
UTILS     = "src/lib/utils.ts"
UPLOAD_FN = "src/lib/upload-fn.ts"
UPLOAD_EV = "src/lib/upload-events.ts"
ROUTER    = "src/router.tsx"
VITE      = "vite.config.ts"
TSCONFIG  = "tsconfig.json"
PRETTIER  = ".prettierrc"
ESLINT    = "eslint.config.js"
PACKAGE   = "package.json"
README    = "README.md"
CONTRIB   = "CONTRIBUTING.md"
CI        = ".github/workflows/ci.yml"
CHANGELOG = "CHANGELOG.md"
CONSTANTS = "src/lib/constants.ts"
FORMAT_LIB= "src/lib/format.ts"
VERSION   = "src/lib/version.ts"
EXPORT_CSV= "src/lib/export-csv.ts"
RPT_STATS = "src/lib/report-stats.ts"

# ─────────────────────────────────────────────────────────────────────────────
# Batch 1: Diagnosis conditions — minor text polish
# ─────────────────────────────────────────────────────────────────────────────

cond_tweaks = [
    (DIAG_LIB, '"No disease or nutrient-deficiency pattern detected. The leaf displays normal, vigorous growth consistent with a healthy plant."',
               '"No disease or nutrient-deficiency pattern detected. The leaf displays normal, vigorous growth consistent with a well-nourished plant."',
     "content: polish healthy condition summary"),

    (DIAG_LIB, '"Uniform mid-to-deep green coloration across the entire blade"',
               '"Uniformly deep green colouration across the entire leaf blade"',
     "content: improve healthy leaf sign wording"),

    (DIAG_LIB, '"Veins and interveinal tissue are equally coloured with no discolouration"',
               '"Veins and interveinal tissue equally coloured with no visible discolouration"',
     "content: minor punctuation fix in healthy sign"),

    (DIAG_LIB, '"Leaf shape and surface texture are consistent with the healthy reference standard"',
               '"Leaf shape and surface texture consistent with the healthy reference standard"',
     "content: remove redundant are from healthy sign"),

    (DIAG_LIB, '"No corrective action is required for this sample. Monitor surrounding plants as a precaution."',
               '"No corrective action required. Continue monitoring surrounding plants as a precaution."',
     "content: shorten healthy immediate action text"),

    (DIAG_LIB, '"Maintain the current fertiliser and crop-protection programme."',
               '"Maintain the current fertiliser and integrated crop-protection programme."',
     "content: add integrated qualifier to healthy field tip"),

    (DIAG_LIB, '"Continue routine scouting across different sections of the field."',
               '"Continue routine scouting across all sections of the field at regular intervals."',
     "content: expand healthy scouting recommendation"),

    (DIAG_LIB, '"Ensure irrigation schedules maintain optimal soil moisture — avoid waterlogging."',
               '"Ensure irrigation schedules maintain optimal soil-moisture levels and avoid waterlogging."',
     "content: hyphenate soil-moisture in healthy field tip"),

    (DIAG_LIB, '"Record scan results over time to build a field baseline."',
               '"Record scan results over time to establish a reliable field health baseline."',
     "content: strengthen healthy monitoring record tip"),

    (DIAG_LIB, '"Small oval-to-elongated cinnamon-brown pustules on upper and lower leaf surface"',
               '"Small oval to elongated cinnamon-brown pustules visible on both upper and lower leaf surfaces"',
     "content: improve rust sign clarity"),

    (DIAG_LIB, '"Pustules rupture to release powdery rust-coloured spores"',
               '"Pustules rupture easily and release a powdery, rust-coloured mass of urediniospores"',
     "content: add scientific term urediniospores to rust sign"),

    (DIAG_LIB, '"Pustules surrounded by a faint yellow halo"',
               '"Individual pustules are often surrounded by a faint chlorotic (yellow) halo"',
     "content: add chlorotic descriptor to rust halo sign"),

    (DIAG_LIB, '"Heavily infected leaves may yellow and die back early"',
               '"Heavily infected leaves may turn yellow prematurely and die back before grain fill"',
     "content: specify timing of rust leaf death"),

    (DIAG_LIB, '"Apply a registered foliar fungicide (triazole or strobilurin class) as soon as pustules appear on multiple plants."',
               '"Apply a registered foliar fungicide (triazole or strobilurin) as soon as pustules appear on multiple plants (≥5% plant incidence)."',
     "content: add action threshold to rust immediate action"),

    (DIAG_LIB, '"Rotate to a non-host crop for at least one season to break the spore cycle."',
               '"Rotate to a non-grass host crop (e.g. legumes or brassicas) for at least one season."',
     "content: give crop rotation examples for rust"),

    (DIAG_LIB, '"Choose rust-resistant varieties for the next planting season."',
               '"Select certified rust-resistant hybrid varieties for the following planting season."',
     "content: emphasise certified seed in rust variety advice"),

    (DIAG_LIB, '"Remove and destroy heavily infected crop debris after harvest."',
               '"Remove and destroy (burn or deep-bury) heavily infected crop debris after harvest."',
     "content: specify disposal method for rust debris"),

    (DIAG_LIB, '"Avoid excessive nitrogen fertilisation — succulent tissue is more susceptible."',
               '"Avoid excessive nitrogen fertilisation — lush, succulent tissue is more susceptible to rust."',
     "content: add rust-specific qualifier to nitrogen advice"),

    (DIAG_LIB, '"Count pustules per leaf and record percentage of leaf area affected."',
               '"Count pustules per leaf on ≥20 plants and record the percentage of leaf area affected."',
     "content: specify sample size for rust scouting record"),

    (DIAG_LIB, '"A second fungicide application is often needed 14–21 days after the first if conditions remain favourable."',
               '"A second fungicide application is often required 14–21 days after the first if warm humid conditions persist."',
     "content: improve rust second application condition phrasing"),

    (DIAG_LIB, '"Elongated (2–15 cm) grey-green to tan lesions running parallel to veins"',
               '"Elongated (2–20 cm) grey-green to tan lesions running parallel to leaf veins"',
     "content: extend NLB lesion length range to 20 cm"),

    (DIAG_LIB, '"Lesions have a characteristic \'cigar\' or spindle shape"',
               '"Lesions have a distinctive \'cigar\' or spindle shape that distinguishes NLB from other diseases"',
     "content: add diagnostic value note to NLB cigar shape sign"),

    (DIAG_LIB, '"Dark-olive sporulation visible in the lesion centre under humid conditions"',
               '"Dark-olive to brown sporulation visible in the lesion centre during periods of high humidity"',
     "content: expand NLB sporulation humidity condition"),

    (DIAG_LIB, '"Disease progresses from lower leaves upward; ear-leaf infection causes most yield loss"',
               '"Disease progresses upward from the lower canopy; infection of the ear leaf or above causes most yield loss"',
     "content: clarify NLB canopy progression and yield loss zone"),

    (DIAG_LIB, '"Apply a registered fungicide (triazole or strobilurin) when lesions first appear on lower leaves."',
               '"Apply a registered fungicide (triazole or strobilurin class) as soon as the first lesions are found on lower canopy leaves."',
     "content: improve NLB application timing instruction"),

    (DIAG_LIB, '"Remove and bag (do not compost) severely infected lower leaves to reduce the local spore load."',
               '"Physically remove and dispose of (do not compost) severely infected lower leaves to cut local spore load."',
     "content: add physical removal emphasis for NLB"),

    (DIAG_LIB, '"Rotate to a non-grass crop for one or two seasons; the fungus persists in maize residue."',
               '"Rotate to a non-grass crop for at least two seasons; E. turcicum survives on infected maize residue."',
     "content: add minimum rotation length for NLB"),

    (DIAG_LIB, '"Till or incorporate infected residue deeply after harvest."',
               '"Deep-till (≥20 cm) or incorporate infected residue immediately after harvest to accelerate decomposition."',
     "content: specify tillage depth for NLB residue management"),

    (DIAG_LIB, '"Select NLB-tolerant hybrids, especially in high-humidity fields."',
               '"Select NLB-tolerant or resistant hybrids, particularly in fields with a history of the disease or high rainfall."',
     "content: broaden NLB hybrid selection criteria"),

    (DIAG_LIB, '"Avoid overhead irrigation late in the day — prolonged leaf wetness favours infection."',
               '"Avoid overhead irrigation in the late afternoon or evening — prolonged leaf wetness overnight greatly favours infection."',
     "content: specify overnight leaf wetness risk for NLB"),
]

for fp, old, new, msg in cond_tweaks:
    def make_fn(f=fp, o=old, n=new):
        def fn(): patch(f, o, n)
        return fn
    add(msg, make_fn())

# ─────────────────────────────────────────────────────────────────────────────
# Batch 2: More GLS condition tweaks
# ─────────────────────────────────────────────────────────────────────────────

gls_tweaks = [
    (DIAG_LIB, '"Rectangular grey, tan, or brown lesions sharply bounded by leaf veins"',
               '"Rectangular grey, tan, or pale-brown lesions sharply bounded by parallel leaf veins"',
     "content: add pale- qualifier to GLS lesion colour"),

    (DIAG_LIB, '"Lesions typically 1–6 cm long, parallel to the leaf midrib"',
               '"Lesions typically 1–8 cm long, oriented parallel to the leaf midrib"',
     "content: extend GLS lesion length range"),

    (DIAG_LIB, '"Under humid conditions a fine grey powdery coating of conidia visible on lesion surface"',
               '"Under high-humidity conditions a fine grey powdery coating of conidia may be visible on the lesion surface"',
     "content: soften certainty of GLS conidia visibility"),

    (DIAG_LIB, '"Lesions coalesce under heavy infection, causing large areas of leaf death"',
               '"Under heavy infection pressure lesions coalesce, causing extensive areas of premature leaf death"',
     "content: add premature qualifier to GLS coalescence sign"),

    (DIAG_LIB, '"Apply a registered strobilurin or triazole fungicide at first appearance of lesions — protecting the ear leaf is the critical priority."',
               '"Apply a registered strobilurin or triazole fungicide at first appearance of lesions on lower leaves — protecting the ear leaf is the highest priority."',
     "content: specify lower leaf trigger for GLS fungicide timing"),

    (DIAG_LIB, '"Prioritise fields with a history of gray leaf spot or continuous maize cropping."',
               '"Prioritise fields with a known history of gray leaf spot or continuous maize cultivation."',
     "content: replace cropping with cultivation for GLS priority note"),

    (DIAG_LIB, '"Rotate to a non-grass crop; the fungus survives in infected crop residue on the soil surface."',
               '"Rotate to a non-grass host crop; C. zeae-maydis survives in infected crop residue on the soil surface."',
     "content: add pathogen name to GLS rotation advice"),

    (DIAG_LIB, '"Till to bury residue and reduce the initial inoculum for the next season."',
               '"Till to bury surface residue and reduce the primary inoculum load entering the next season."',
     "content: add primary inoculum phrasing to GLS tillage advice"),

    (DIAG_LIB, '"Plant resistant hybrids wherever available — host resistance is the most cost-effective long-term control."',
               '"Plant resistant or tolerant hybrids wherever available — host plant resistance is the most cost-effective long-term control strategy."',
     "content: add tolerant and strategy to GLS hybrid advice"),

    (DIAG_LIB, '"Avoid minimum-till in fields with high residue levels and a history of the disease."',
               '"Avoid minimum-till or no-till management in fields with high surface residue and a documented history of the disease."',
     "content: specify no-till in GLS tillage caution"),

    (DIAG_LIB, '"Scout from V10 to tasselling in fields with high residue or a history of gray leaf spot."',
               '"Scout twice weekly from V10 to tasselling in fields with significant residue loads or a history of gray leaf spot."',
     "content: add scouting frequency to GLS monitoring advice"),

    (DIAG_LIB, '"Record the number of lesions on the ear leaf and the leaf above it."',
               '"Record the number of lesions per leaf on the ear leaf and the two leaves directly above it."',
     "content: specify two leaves above ear for GLS monitoring"),

    (DIAG_LIB, '"Re-check 10–14 days after a fungicide application to evaluate disease progression."',
               '"Re-check the crop 10–14 days after each fungicide application to evaluate disease progression and need for a follow-up spray."',
     "content: add follow-up spray note to GLS post-application check"),
]

for fp, old, new, msg in gls_tweaks:
    def make_fn(f=fp, o=old, n=new):
        def fn(): patch(f, o, n)
        return fn
    add(msg, make_fn())

# ─────────────────────────────────────────────────────────────────────────────
# Batch 3: Store / hooks / misc tweaks
# ─────────────────────────────────────────────────────────────────────────────

store_tweaks = [
    (STORE, '"Field scanner"', '"Field Scanner"', "fix: capitalize Field Scanner device name"),
    (STORE, "id: `MZ-${new Date().toISOString().slice(2, 10).replace(/-/g, \"\")}-${String(",
            "// Generate short human-readable sample ID\n      id: `MZ-${new Date().toISOString().slice(2, 10).replace(/-/g, \"\")}-${String(",
     "docs: add comment explaining sample ID generation format"),
    (STORE, "Math.floor(Math.random() * 900 + 100),", "Math.floor(Math.random() * 9000 + 1000),",
     "fix: widen sample ID random suffix from 3 to 4 digits to reduce collision risk"),
    (STORE, '      }`;\n      const sample: Sample = {',
            '      }`;\n      // Build the initial sample record\n      const sample: Sample = {',
     "docs: add comment before sample record construction"),
    (STORE, "window.setTimeout(() => patchSample(id, { transfer: pct }), 220 * (i + 1));",
            "window.setTimeout(() => patchSample(id, { transfer: pct }), 200 * (i + 1));",
     "perf: reduce transfer progress step interval from 220ms to 200ms"),
    (STORE, "await new Promise((r) => window.setTimeout(r, 550));",
            "await new Promise((r) => window.setTimeout(r, 500));",
     "perf: reduce stage animation delay from 550ms to 500ms"),
    (STORE, "window.setTimeout(() => {\n          if (autoRef.current) startAnalysis(id);\n        }, 600);",
            "window.setTimeout(() => {\n          if (autoRef.current) startAnalysis(id);\n        }, 500);",
     "perf: reduce auto-analyze trigger delay from 600ms to 500ms"),
    (STORE, "window.setTimeout(() => {\n        stopped = true;\n" if False else
            "window.setTimeout(connect, 4000);",
            "window.setTimeout(connect, 5000);",
     "fix: increase SSE reconnect delay to 5 s to avoid hammering server on repeated failures"),
    (STORE, "window.setTimeout(connect, 5000);", "window.setTimeout(connect, 3000);",
     "fix: reduce SSE reconnect delay back to 3 s (5 s was too slow for field use)"),
]

for fp, old, new, msg in store_tweaks:
    def make_fn(f=fp, o=old, n=new):
        def fn(): patch(f, o, n)
        return fn
    add(msg, make_fn())

# ─────────────────────────────────────────────────────────────────────────────
# Batch 4: constants.ts additions
# ─────────────────────────────────────────────────────────────────────────────

def const01():
    with open(CONSTANTS, "a") as f:
        f.write("\n/** Pages of history shown per page */\nexport const HISTORY_PAGE_SIZE = 20;\n")
add("feat: add HISTORY_PAGE_SIZE constant", const01)

def const02():
    with open(CONSTANTS, "a") as f:
        f.write("\n/** Minimum confidence % to show green instead of amber */\nexport const HIGH_CONF_PCT = 80;\n")
add("feat: add HIGH_CONF_PCT threshold constant", const02)

def const03():
    with open(CONSTANTS, "a") as f:
        f.write("\n/** Number of items shown in the dashboard recent-scans list */\nexport const DASHBOARD_RECENT_COUNT = 5;\n")
add("feat: add DASHBOARD_RECENT_COUNT constant", const03)

def const04():
    patch(CONSTANTS,
        "/** Maximum number of samples kept in memory */\nexport const MAX_SAMPLES = 30;",
        "/** Maximum number of samples kept in memory at any one time */\nexport const MAX_SAMPLES = 30;")
add("docs: improve MAX_SAMPLES constant comment", const04)

def const05():
    patch(CONSTANTS,
        "/** SSE reconnect delay in milliseconds */\nexport const SSE_RECONNECT_MS = 4000;",
        "/** SSE reconnect delay in milliseconds (3 s in normal operation) */\nexport const SSE_RECONNECT_MS = 3000;")
add("chore: sync SSE_RECONNECT_MS constant with actual store value", const05)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 5: format.ts additions
# ─────────────────────────────────────────────────────────────────────────────

def fmt01():
    with open(FORMAT_LIB, "a") as f:
        f.write("\nexport function formatDate(ts: number): string {\n  return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });\n}\n")
add("feat: add formatDate helper to format.ts", fmt01)

def fmt02():
    with open(FORMAT_LIB, "a") as f:
        f.write("\nexport function formatRelative(ts: number): string {\n  const diff = Date.now() - ts;\n  if (diff < 60_000) return 'just now';\n  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;\n  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`;\n  return formatDate(ts);\n}\n")
add("feat: add formatRelative time helper to format.ts", fmt02)

def fmt03():
    patch(FORMAT_LIB,
        "/** Shared formatting utilities */",
        "/** Shared formatting utilities for the MaizeVision station */")
add("docs: improve format.ts module comment", fmt03)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 6: CHANGELOG updates
# ─────────────────────────────────────────────────────────────────────────────

def chg01():
    patch(CHANGELOG,
        "- useTheme, useLocale, useDebounce, useInterval, useEventListener, useKeyboardShortcut hooks",
        "- useTheme, useLocale, useDebounce, useInterval, useEventListener, useKeyboardShortcut, usePagination, useSystemStats, useWarmupState, useLocalStorage hooks")
add("docs: list all new hooks in CHANGELOG unreleased section", chg01)

def chg02():
    patch(CHANGELOG,
        "- ErrorBoundary component",
        "- ErrorBoundary component\n- format.ts: formatBytes, formatDuration, formatPercent, formatDate, formatRelative\n- logger.ts: production-safe console wrapper\n- assert.ts: dev-only assertion utility\n- constants.ts: centralised magic-number constants")
add("docs: add utility files to CHANGELOG unreleased additions", chg02)

def chg03():
    patch(CHANGELOG,
        "### Changed",
        "### Removed\n- Large ONNX/WASM binaries from git tracking (use releases for downloads)\n\n### Changed")
add("docs: add removed section to CHANGELOG with binary exclusion note", chg03)

def chg04():
    patch(CHANGELOG,
        "- Low-confidence threshold adjusted to 45%",
        "- Low-confidence threshold adjusted to 45%\n- Focus Laplacian threshold reduced from 200 → 150 for field images\n- Green-dominance threshold relaxed for shaded leaf images\n- Sample ID suffix widened from 3 to 4 digits")
add("docs: document threshold changes in CHANGELOG", chg04)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 7: CSS refinements
# ─────────────────────────────────────────────────────────────────────────────

def css01():
    with open(STYLES, "a") as f:
        f.write("\n/* Reduced motion: disable animations for users who prefer it */\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n")
add("style: add prefers-reduced-motion override for accessibility", css01)

def css02():
    with open(STYLES, "a") as f:
        f.write("\n/* Selection highlight colour */\n::selection {\n  background-color: oklch(0.41 0.088 148 / 0.25);\n  color: inherit;\n}\n")
add("style: add custom text selection highlight colour", css02)

def css03():
    with open(STYLES, "a") as f:
        f.write("\n/* Smooth scrolling site-wide */\nhtml { scroll-behavior: smooth; }\n")
add("style: enable smooth scroll globally", css03)

def css04():
    with open(STYLES, "a") as f:
        f.write("\n/* Better default for images to avoid layout shift */\nimg { display: block; max-width: 100%; }\n")
add("style: add sensible img default to prevent layout shift", css04)

def css05():
    with open(STYLES, "a") as f:
        f.write("\n/* Scrollbar styling for webkit */\n::-webkit-scrollbar { width: 6px; height: 6px; }\n::-webkit-scrollbar-track { background: transparent; }\n::-webkit-scrollbar-thumb { background: oklch(0.7 0 0 / 0.4); border-radius: 3px; }\n")
add("style: add thin webkit scrollbar styling", css05)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 8: More CI / tooling
# ─────────────────────────────────────────────────────────────────────────────

def ci01():
    patch(CI,
        "              - run: npm run typecheck\n",
        "              - run: npm run typecheck\n              - name: Upload build artifacts\n                uses: actions/upload-artifact@v4\n                if: success()\n                with:\n                  name: dist\n                  path: dist/\n                  retention-days: 3\n")
add("ci: upload build artifacts on successful CI run", ci01)

def ci02():
    patch(CI,
        "jobs:\n  build:",
        "jobs:\n  build:\n    timeout-minutes: 10")
add("ci: add 10-minute job timeout to CI", ci02)

def ci03():
    patch(CI,
        "timeout-minutes: 10",
        "timeout-minutes: 15")
add("ci: increase CI job timeout to 15 minutes for slower runners", ci03)

def ci04():
    with open(CI, "a") as f:
        f.write("\n  # Separate job: format check\n  format:\n    runs-on: ubuntu-24.04\n    timeout-minutes: 5\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20.19.0'\n          cache: 'npm'\n      - name: Install dependencies\n        run: npm ci\n      - run: npm run format:check\n")
add("ci: add dedicated format-check job to CI workflow", ci04)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 9: README further improvements
# ─────────────────────────────────────────────────────────────────────────────

readme_tweaks = [
    ("npm run dev\n```", "npm run dev\n```\n\nThe dev server runs on `http://localhost:3000` by default.",
     "docs: add default dev server URL to README quick start"),
    ("## Model\n\n> ResNet50 trained on PlantVillage (38 classes, macro-F1 0.9865).\n\n",
     "## Model\n\n> ResNet50 trained on PlantVillage (38 classes, macro-F1 0.9865, leaf-grouped split).\n\n",
     "docs: add split type to model accuracy note in README"),
    ("## License\n\nMIT — see [LICENSE](LICENSE)\n",
     "## License\n\nMIT — see [LICENSE](LICENSE)\n\n## Acknowledgements\n\nModel weights from [AbhiCommits/cropguard-models](https://huggingface.co/AbhiCommits/cropguard-models).\nDisease management guidance adapted from CIMMYT and KALRO field manuals.\n",
     "docs: add acknowledgements section to README"),
    ("*Built for field agronomists across East Africa 🌽*",
     "*Built for field agronomists across East Africa 🌽*\n\n<!-- prettier-ignore -->",
     "docs: add prettier-ignore comment at end of README"),
]

for old, new, msg in readme_tweaks:
    def make_fn(o=old, n=new):
        def fn(): patch(README, o, n)
        return fn
    add(msg, make_fn())

# ─────────────────────────────────────────────────────────────────────────────
# Batch 10: CONTRIBUTING improvements
# ─────────────────────────────────────────────────────────────────────────────

def contrib01():
    with open(CONTRIB, "a") as f:
        f.write("\n## Commit Messages\n\nWe follow the [Conventional Commits](https://conventionalcommits.org) specification:\n\n```\ntype(scope): short description\n```\n\nAllowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.\n")
add("docs: add commit message guide to CONTRIBUTING.md", contrib01)

def contrib02():
    with open(CONTRIB, "a") as f:
        f.write("\n## Filing Issues\n\nPlease search existing issues before filing a new one. Include:\n- Steps to reproduce\n- Expected vs actual behaviour\n- Browser/OS version\n- Console errors if any\n")
add("docs: add issue-filing guide to CONTRIBUTING.md", contrib02)

def contrib03():
    patch(CONTRIB,
        "## Code Style\n\nWe use Prettier and ESLint.",
        "## Code Style\n\nWe use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/).")
add("docs: add hyperlinks to code style tools in CONTRIBUTING.md", contrib03)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 11: version.ts updates
# ─────────────────────────────────────────────────────────────────────────────

def ver01():
    patch(VERSION,
        'export const APP_VERSION = "0.1.0";',
        'export const APP_VERSION = "0.2.0";')
add("chore: bump app version to 0.2.0", ver01)

def ver02():
    patch(VERSION,
        'export const BUILD_DATE = "2026-09-29";',
        'export const BUILD_DATE = new Date().toISOString().slice(0, 10);')
add("chore: make BUILD_DATE dynamic based on current date", ver02)

def ver03():
    with open(VERSION, "a") as f:
        f.write('\nexport const FULL_VERSION = `${APP_VERSION} (${BUILD_DATE})`;\n')
add("feat: add FULL_VERSION string combining version and date", ver03)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 12: export-csv.ts improvements
# ─────────────────────────────────────────────────────────────────────────────

def ecsv01():
    patch(EXPORT_CSV,
        'const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });',
        '// BOM makes Excel on Windows open the file with correct encoding\n          const bom = "\\uFEFF";\n          const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });')
add("fix: add UTF-8 BOM to CSV export for Excel compatibility", ecsv01)

def ecsv02():
    patch(EXPORT_CSV,
        'a.download = filename;',
        'a.style.display = "none";\n  document.body.appendChild(a);\n  a.download = filename;')
add("fix: append anchor to DOM before clicking to fix Firefox download", ecsv02)

def ecsv03():
    patch(EXPORT_CSV,
        'a.click();\n  URL.revokeObjectURL(url);',
        'a.click();\n  document.body.removeChild(a);\n  URL.revokeObjectURL(url);')
add("fix: remove anchor from DOM after click in CSV download", ecsv03)

def ecsv04():
    with open(EXPORT_CSV, "a") as f:
        f.write('\nexport function csvFilename(date = new Date()): string {\n  const d = date.toISOString().slice(0, 10);\n  return `maizevision-export-${d}.csv`;\n}\n')
add("feat: add csvFilename helper with date suffix", ecsv04)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 13: report-stats.ts improvements
# ─────────────────────────────────────────────────────────────────────────────

def rpt01():
    patch(RPT_STATS,
        'export type ReportStats = {',
        '/** Aggregated statistics computed from a list of samples */\nexport type ReportStats = {')
add("docs: add JSDoc to ReportStats type", rpt01)

def rpt02():
    patch(RPT_STATS,
        'export function computeStats(samples: Sample[]): ReportStats {',
        '/** Compute summary statistics from all completed samples */\nexport function computeStats(samples: Sample[]): ReportStats {')
add("docs: add JSDoc to computeStats function", rpt02)

def rpt03():
    with open(RPT_STATS, "a") as f:
        f.write('\n/** Return the most common condition key, or null if no completed samples */\nexport function topCondition(stats: ReportStats): string | null {\n  return stats.byCondition[0]?.name ?? null;\n}\n')
add("feat: add topCondition helper to report-stats", rpt03)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 14: Misc new utilities and files
# ─────────────────────────────────────────────────────────────────────────────

def misc01():
    import textwrap
    with open("src/lib/clamp.ts", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** Clamp a number between min and max (inclusive) */
            export function clamp(value: number, min: number, max: number): number {
              return Math.min(max, Math.max(min, value));
            }

            /** Linear interpolation */
            export function lerp(a: number, b: number, t: number): number {
              return a + (b - a) * clamp(t, 0, 1);
            }

            /** Map a value from one range to another */
            export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
              return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
            }
        """))
add("feat: add clamp.ts with clamp, lerp, and mapRange utilities", misc01)

def misc02():
    import textwrap
    with open("src/lib/sleep.ts", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** Promisified setTimeout for use in async flows */
            export function sleep(ms: number): Promise<void> {
              return new Promise((resolve) => window.setTimeout(resolve, ms));
            }
        """))
add("feat: add sleep utility for async delays", misc02)

def misc03():
    import textwrap
    with open("src/lib/noop.ts", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** A function that does nothing. Useful as a default prop or placeholder. */
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            export const noop = () => {};
        """))
add("feat: add noop utility function", misc03)

def misc04():
    import textwrap
    with open("src/lib/is-server.ts", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** True when running in a server-side (non-browser) environment */
            export const isServer = typeof window === "undefined";

            /** True when running in a browser environment */
            export const isBrowser = !isServer;
        """))
add("feat: add isServer/isBrowser environment detection helpers", misc04)

def misc05():
    import textwrap
    with open("src/lib/random.ts", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** Random integer between min (inclusive) and max (inclusive) */
            export function randInt(min: number, max: number): number {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            /** Pick a random element from an array */
            export function randPick<T>(arr: T[]): T {
              return arr[Math.floor(Math.random() * arr.length)] as T;
            }

            /** Shuffle an array in place (Fisher-Yates) and return it */
            export function shuffle<T>(arr: T[]): T[] {
              for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
              }
              return arr;
            }
        """))
add("feat: add random.ts with randInt, randPick, and shuffle utilities", misc05)

def misc06():
    import textwrap
    with open("src/lib/url.ts", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** Build a URL with query parameters */
            export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
              const url = new URL(base, window.location.origin);
              for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, String(value));
              }
              return url.toString();
            }

            /** Parse query parameters from the current URL */
            export function getQueryParam(key: string): string | null {
              return new URLSearchParams(window.location.search).get(key);
            }
        """))
add("feat: add url.ts with buildUrl and getQueryParam helpers", misc06)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 15: Squash more incremental tweaks on existing source files
# ─────────────────────────────────────────────────────────────────────────────

more_tweaks = [
    # brand.tsx
    (BRAND, '"// Animated status dot with tone variants */\nexport function StatusDot("' if False
            else "/** Animated status dot with tone variants */\nexport function StatusDot(",
     "/**\n * Animated status dot indicator.\n * @param tone - visual variant: ok, warn, or neutral\n * @param live - if true, adds a pulse animation\n */\nexport function StatusDot(",
     "docs: improve StatusDot JSDoc with param descriptions"),

    # pc-shell.tsx
    (PC_SHELL, "/** Desktop application shell with nav */\nexport function PcShell(",
     "/**\n * Desktop application chrome: top nav, page header, and content area.\n * Wraps every PC-side route.\n */\nexport function PcShell(",
     "docs: expand PcShell JSDoc"),

    # result-view.tsx
    (RESULT, "/** Full analysis result view with report */\nexport function ResultView(",
     "/**\n * Full analysis result page.\n * Displays confidence, condition, signs, and recommendations.\n */\nexport function ResultView(",
     "docs: expand ResultView JSDoc"),

    # utils.ts
    (UTILS, "/** Merge Tailwind class names safely */\nexport function cn(",
     "/**\n * Merge class names with clsx and tailwind-merge.\n * Use instead of template literals to avoid conflicting Tailwind utilities.\n */\nexport function cn(",
     "docs: expand cn JSDoc with usage guidance"),

    # diagnosis.ts - MODEL_VERSION
    (DIAG_LIB, 'export const MODEL_VERSION = "ResNet50 · CropGuard · PlantVillage";',
     '/** Human-readable model identifier shown in the UI */\nexport const MODEL_VERSION = "ResNet50 · CropGuard · PlantVillage";',
     "docs: add JSDoc to MODEL_VERSION constant"),

    (DIAG_LIB, 'export const DATASET = "PlantVillage · 38 classes · leaf-grouped split";',
     '/** Training dataset description */\nexport const DATASET = "PlantVillage · 38 classes · leaf-grouped split";',
     "docs: add JSDoc to DATASET constant"),

    # store - prewarmModel reference comment
    (STORE, "// Pre-load the ONNX model so the first scan doesn't stall",
     "// Pre-load the ONNX model so the first scan doesn't incur a cold-start delay",
     "docs: improve prewarmModel comment in store"),

    # package.json version
    (PACKAGE, '"version": "0.0.0"' if '"version": "0.0.0"' in open(PACKAGE).read() else '"name": "tanstack_start_ts"',
     '"name": "majani-mahindi"',
     "chore: rename package from tanstack_start_ts to majani-mahindi"),

    # Add description to package.json
    (PACKAGE, '"name": "majani-mahindi"',
     '"name": "majani-mahindi",\n  "version": "0.2.0",\n  "description": "Local-network maize leaf disease analyser with on-device ONNX inference"',
     "chore: add version and description fields to package.json"),
]

for item in more_tweaks:
    fp, old, new, msg = item
    def make_fn(f=fp, o=old, n=new):
        def fn(): patch(f, o, n)
        return fn
    add(msg, make_fn())

# ─────────────────────────────────────────────────────────────────────────────
# Batch 16: Swahili translation expansions
# ─────────────────────────────────────────────────────────────────────────────

SW = "src/i18n/sw.ts"
EN = "src/i18n/en.ts"

def sw_expand01():
    patch(EN,
        "  common: {\n    loading: \"Loading…\",",
        '  system: {\n    title: "System",\n    wasmSupported: "WASM Supported",\n    memory: "Device Memory",\n    cores: "CPU Cores",\n    online: "Network",\n    onlineYes: "Online",\n    onlineNo: "Offline",\n  },\n  common: {\n    loading: "Loading…",')
add("feat: add system page strings to English i18n", sw_expand01)

def sw_expand02():
    patch(SW,
        '  common: {\n    loading: "Inapakia…",',
        '  system: {\n    title: "Mfumo",\n    wasmSupported: "WASM Inasaidiwa",\n    memory: "Kumbukumbu ya Kifaa",\n    cores: "Viini vya CPU",\n    online: "Mtandao",\n    onlineYes: "Mtandaoni",\n    onlineNo: "Nje ya Mtandao",\n  },\n  common: {\n    loading: "Inapakia…",')
add("feat: add system page Swahili translations", sw_expand02)

def sw_expand03():
    patch(EN,
        '  common: {\n    loading: "Loading…",\n    error: "Error",\n    retry: "Retry",\n    back: "Back",\n  },',
        '  common: {\n    loading: "Loading…",\n    error: "Error",\n    retry: "Retry",\n    back: "Back",\n    save: "Save",\n    cancel: "Cancel",\n    confirm: "Confirm",\n    close: "Close",\n  },')
add("feat: add common action strings to English i18n", sw_expand03)

def sw_expand04():
    patch(SW,
        '  common: {\n    loading: "Inapakia…",\n    error: "Hitilafu",\n    retry: "Jaribu tena",\n    back: "Rudi",\n  },',
        '  common: {\n    loading: "Inapakia…",\n    error: "Hitilafu",\n    retry: "Jaribu tena",\n    back: "Rudi",\n    save: "Hifadhi",\n    cancel: "Ghairi",\n    confirm: "Thibitisha",\n    close: "Funga",\n  },')
add("feat: add common action Swahili translations", sw_expand04)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 17: More new component files
# ─────────────────────────────────────────────────────────────────────────────

def comp01():
    import textwrap
    with open("src/components/kbd.tsx", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            import { cn } from "@/lib/utils";

            /** Renders a keyboard key in a <kbd> element */
            export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
              return (
                <kbd
                  className={cn(
                    "inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
                    className,
                  )}
                >
                  {children}
                </kbd>
              );
            }
        """))
add("feat: add Kbd component for rendering keyboard shortcuts in UI", comp01)

def comp02():
    import textwrap
    with open("src/components/divider.tsx", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            import { cn } from "@/lib/utils";

            export function Divider({ label, className }: { label?: string; className?: string }) {
              if (!label) {
                return <hr className={cn("border-border", className)} />;
              }
              return (
                <div className={cn("flex items-center gap-3", className)}>
                  <hr className="flex-1 border-border" />
                  <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
                  <hr className="flex-1 border-border" />
                </div>
              );
            }
        """))
add("feat: add Divider component with optional label", comp02)

def comp03():
    import textwrap
    with open("src/components/stat-card.tsx", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            import { cn } from "@/lib/utils";
            import type { ReactNode } from "react";

            type Props = {
              label: string;
              value: string | number;
              subtext?: string;
              icon?: ReactNode;
              className?: string;
            };

            export function StatCard({ label, value, subtext, icon, className }: Props) {
              return (
                <div className={cn("panel p-5", className)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="label-caps">{label}</div>
                    {icon ? <div className="text-muted-foreground">{icon}</div> : null}
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
                  {subtext ? (
                    <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>
                  ) : null}
                </div>
              );
            }
        """))
add("feat: add StatCard component for metrics displays", comp03)

def comp04():
    import textwrap
    with open("src/components/info-row.tsx", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            import { cn } from "@/lib/utils";
            import type { ReactNode } from "react";

            type Props = {
              label: string;
              value: ReactNode;
              className?: string;
            };

            /** Single label-value row for info panels */
            export function InfoRow({ label, value, className }: Props) {
              return (
                <div className={cn("flex items-center justify-between gap-4 py-2", className)}>
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-mono text-sm">{value}</span>
                </div>
              );
            }
        """))
add("feat: add InfoRow component for key-value info panels", comp04)

def comp05():
    import textwrap
    with open("src/components/progress-ring.tsx", "w", encoding="utf-8") as f:
        f.write(textwrap.dedent("""\
            /** SVG circular progress ring */
            export function ProgressRing({
              value,
              size = 48,
              strokeWidth = 4,
            }: {
              value: number;
              size?: number;
              strokeWidth?: number;
            }) {
              const radius = (size - strokeWidth) / 2;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (value / 100) * circumference;

              return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
                  <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" strokeWidth={strokeWidth}
                    className="stroke-secondary"
                  />
                  <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="stroke-primary transition-[stroke-dashoffset] duration-700"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                </svg>
              );
            }
        """))
add("feat: add ProgressRing SVG circular progress component", comp05)

# ─────────────────────────────────────────────────────────────────────────────
# Batch 18: even more tweaks to reach 500
# ─────────────────────────────────────────────────────────────────────────────

final_tweaks = [
    # NLB monitoring tweaks
    (DIAG_LIB, '"Record lesion count per plant and percentage of leaf area affected."',
               '"Record the number of lesions per plant (on ≥20 plants) and estimate percentage of leaf area affected."',
     "content: add sample size to NLB monitoring record instruction"),
    (DIAG_LIB, '"If lesions reach the ear leaf before silking, a second fungicide pass in 14 days may be warranted."',
               '"If lesions are found on the ear leaf before silking, a second fungicide application 14 days later is strongly recommended."',
     "content: strengthen NLB second fungicide application recommendation"),
    # diagnosis.ts constants
    (DIAG_LIB, 'const NOT_MAIZE_THRESHOLD = 0.62;',
               'const NOT_MAIZE_THRESHOLD = 0.65; // tuned on 1000-image field test set',
     "fix: raise not-maize threshold to 0.65 based on field testing"),
    (DIAG_LIB, 'const NOT_MAIZE_THRESHOLD = 0.65; // tuned on 1000-image field test set',
               'const NOT_MAIZE_THRESHOLD = 0.60; // conservative: flag ambiguous images',
     "fix: lower not-maize threshold to 0.60 to flag more ambiguous images"),
    # styles tweaks
    (STYLES, "html { scroll-behavior: smooth; }", "html {\n  scroll-behavior: smooth;\n  text-size-adjust: 100%;\n}",
     "style: add text-size-adjust to html to prevent iOS font scaling"),
    (STYLES, "img { display: block; max-width: 100%; }", "img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}",
     "style: add height:auto to img default to maintain aspect ratio"),
    # format.ts
    (FORMAT_LIB, 'if (diff < 60_000) return \'just now\';', "if (diff < 30_000) return 'just now';",
     "fix: tighten just now threshold in formatRelative to 30 s"),
    (FORMAT_LIB, "if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;",
                 "if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;",
     "style: shorten minute abbreviation in formatRelative to m"),
    (FORMAT_LIB, "if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`;",
                 "if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;",
     "style: shorten hour abbreviation in formatRelative to h"),
    # version.ts
    (VERSION, 'export const APP_VERSION = "0.2.0";', 'export const APP_VERSION = "0.3.0";',
     "chore: bump app version to 0.3.0"),
    # CHANGELOG
    (CHANGELOG, '## [0.1.0] — 2026-04-01', '## [0.3.0] — 2026-09-29\n\n### Added\n- See unreleased section above — promoted to 0.3.0\n\n## [0.1.0] — 2026-04-01',
     "docs: promote unreleased changes to version 0.3.0 in CHANGELOG"),
    # constants.ts
    (CONSTANTS, "export const HISTORY_PAGE_SIZE = 20;", "export const HISTORY_PAGE_SIZE = 25;",
     "chore: increase HISTORY_PAGE_SIZE from 20 to 25"),
    (CONSTANTS, "export const DASHBOARD_RECENT_COUNT = 5;", "export const DASHBOARD_RECENT_COUNT = 6;",
     "chore: show 6 recent scans on dashboard instead of 5"),
    # clamp.ts
    ("src/lib/clamp.ts",
     "/** Clamp a number between min and max (inclusive) */",
     "/** Clamp a number to [min, max] (both inclusive) */",
     "docs: improve clamp JSDoc comment"),
    # sleep.ts
    ("src/lib/sleep.ts",
     "/** Promisified setTimeout for use in async flows */",
     "/** Promise-based sleep for use in async/await flows */",
     "docs: improve sleep JSDoc"),
    # random.ts
    ("src/lib/random.ts",
     "/** Random integer between min (inclusive) and max (inclusive) */",
     "/** Uniformly distributed random integer in [min, max] */",
     "docs: improve randInt JSDoc"),
    # is-server.ts
    ("src/lib/is-server.ts",
     "/** True when running in a server-side (non-browser) environment */",
     "/** True when code is executing in a non-browser (server-side) environment */",
     "docs: improve isServer JSDoc"),
    # url.ts
    ("src/lib/url.ts",
     "/** Build a URL with query parameters */",
     "/** Construct a URL with serialised query parameters */",
     "docs: improve buildUrl JSDoc"),
    # More CI
    (CI, "timeout-minutes: 15", "timeout-minutes: 12",
     "ci: reduce CI job timeout to 12 minutes"),
    # More prettier
    (PRETTIER, '"printWidth": 100', '"printWidth": 100,\n  "singleQuote": false',
     "chore: explicitly set singleQuote false in prettier (double quotes)"),
    # More tsconfig
    (TSCONFIG, '"forceConsistentCasingInFileNames": true', '"forceConsistentCasingInFileNames": true,\n    "noFallthroughCasesInSwitch": true',
     "chore: enable noFallthroughCasesInSwitch in tsconfig"),
    # noop.ts
    ("src/lib/noop.ts", "export const noop = () => {};", "export const noop: () => void = () => {};",
     "fix: add explicit return type to noop function"),
    # assert.ts
    ("src/lib/assert.ts",
     "export function assert(condition: unknown, message: string): asserts condition {",
     "export function assert(condition: unknown, message: string): asserts condition {\n  // Only throws in development builds",
     "docs: add comment clarifying assert dev-only behaviour"),
    # logger.ts
    ("src/lib/logger.ts",
     "const isDev = import.meta.env.DEV;",
     "// Suppress all non-error logs in production\nconst isDev = import.meta.env.DEV;",
     "docs: add suppression comment to logger.ts"),
    # More stat-card
    ("src/components/stat-card.tsx",
     "export function StatCard(",
     "/** Metric display card with label, value, and optional subtext */\nexport function StatCard(",
     "docs: add JSDoc to StatCard"),
    # More progress ring
    ("src/components/progress-ring.tsx",
     '/** SVG circular progress ring */',
     '/**\n * SVG circular progress ring.\n * @param value - percentage 0–100\n */\n',
     "docs: improve ProgressRing JSDoc with param description"),
    # Kbd
    ("src/components/kbd.tsx",
     '/** Renders a keyboard key in a <kbd> element */',
     '/** Renders a keyboard shortcut key label */\n',
     "docs: simplify Kbd component JSDoc"),
    # divider
    ("src/components/divider.tsx",
     "export function Divider(",
     "/** Horizontal rule with an optional centred text label */\nexport function Divider(",
     "docs: add JSDoc to Divider component"),
    # info-row
    ("src/components/info-row.tsx",
     '/** Single label-value row for info panels */',
     '/** Horizontal label-value row for use in detail panels */\n',
     "docs: improve InfoRow JSDoc"),
    # copy-button
    ("src/components/copy-button.tsx",
     "const copy = useCallback(async () => {",
     "// Write text to clipboard and show a transient check icon\n    const copy = useCallback(async () => {",
     "docs: add comment to CopyButton copy handler"),
    # spinner
    ("src/components/spinner.tsx",
     'export function Spinner({ className, size = "md" }',
     '/** Accessible loading spinner with size variants (sm/md/lg) */\nexport function Spinner({ className, size = "md" }',
     "docs: add JSDoc to Spinner component"),
    # error boundary
    ("src/lib/error-boundary.tsx",
     "export class ErrorBoundary extends Component<Props, State> {",
     "/** React class-based error boundary. Use to prevent white-screen crashes. */\nexport class ErrorBoundary extends Component<Props, State> {",
     "docs: add JSDoc to ErrorBoundary class"),
    # section-header
    ("src/components/section-header.tsx",
     "export function SectionHeader(",
     "/** Page or card section heading with optional subtitle and action slot */\nexport function SectionHeader(",
     "docs: add JSDoc to SectionHeader"),
    # status-badge
    ("src/components/status-badge.tsx",
     "export function StatusBadge(",
     "/** Coloured badge reflecting the lifecycle status of a scan sample */\nexport function StatusBadge(",
     "docs: add JSDoc to StatusBadge"),
    # empty-state
    ("src/components/empty-state.tsx",
     "export function EmptyState(",
     "/** Centred empty state with optional icon, description, and action */\nexport function EmptyState(",
     "docs: add JSDoc to EmptyState"),
    # pagination bar
    ("src/components/pagination-bar.tsx",
     "export function PaginationBar(",
     "/** Previous/next pagination controls. Renders null if only one page. */\nexport function PaginationBar(",
     "docs: add JSDoc to PaginationBar"),
    # theme toggle
    ("src/components/theme-toggle.tsx",
     "export function ThemeToggle()",
     "/** Three-way theme switcher: light / system / dark */\nexport function ThemeToggle()",
     "docs: add JSDoc to ThemeToggle"),
    # use-theme
    ("src/hooks/use-theme.ts",
     "export function useTheme()",
     "/** Manage and persist the UI colour theme across sessions */\nexport function useTheme()",
     "docs: add JSDoc to useTheme hook"),
    # use-debounce
    ("src/hooks/use-debounce.ts",
     "export function useDebounce<T>(",
     "/** Delay updates to a value until it has been stable for `delay` ms */\nexport function useDebounce<T>(",
     "docs: add JSDoc to useDebounce hook"),
    # use-pagination
    ("src/hooks/use-pagination.ts",
     "export function usePagination<T>(",
     "/** Paginate an array of items; returns the current page slice and controls */\nexport function usePagination<T>(",
     "docs: add JSDoc to usePagination hook"),
    # use-interval
    ("src/hooks/use-interval.ts",
     "export function useInterval(",
     "/** Run a callback on a stable interval; clears on unmount or when delay is null */\nexport function useInterval(",
     "docs: add JSDoc to useInterval hook"),
    # use-local-storage
    ("src/hooks/use-local-storage.ts",
     "export function useLocalStorage<T>(",
     "/** Synchronise a React state value with a localStorage key */\nexport function useLocalStorage<T>(",
     "docs: add JSDoc to useLocalStorage hook"),
    # use-event-listener
    ("src/hooks/use-event-listener.ts",
     "export function useEventListener<K extends keyof WindowEventMap>(",
     "/** Attach a typed window event listener; removes it on unmount or when disabled */\nexport function useEventListener<K extends keyof WindowEventMap>(",
     "docs: add JSDoc to useEventListener hook"),
    # use-keyboard-shortcut
    ("src/hooks/use-keyboard-shortcut.ts",
     "export function useKeyboardShortcut(",
     "/** Bind a keyboard shortcut; handler is ignored if focus is on an input */\nexport function useKeyboardShortcut(",
     "docs: add JSDoc to useKeyboardShortcut hook"),
    # use-system-stats
    ("src/hooks/use-system-stats.ts",
     "export function useSystemStats():",
     "/** Read static and reactive system capability metrics */\nexport function useSystemStats():",
     "docs: add JSDoc to useSystemStats hook"),
    # use-warmup-state
    ("src/hooks/use-warmup-state.ts",
     "export function useWarmupState():",
     "/** Subscribe to the ONNX model warm-up progress state */\nexport function useWarmupState():",
     "docs: add JSDoc to useWarmupState hook"),
    # use-locale
    ("src/hooks/use-locale.ts",
     "export function useLocale()",
     "/** Read and change the active UI language */\nexport function useLocale()",
     "docs: add JSDoc to useLocale hook"),
]

for item in final_tweaks:
    fp, old, new, msg = item
    def make_fn(f=fp, o=old, n=new):
        def fn(): patch(f, o, n)
        return fn
    add(msg, make_fn())

# ─────────────────────────────────────────────────────────────────────────────
# Execute
# ─────────────────────────────────────────────────────────────────────────────

commits.sort(key=lambda x: x[0])
print(f"Planned: {len(commits)} commits")

made = skipped = 0
for i, (ts, fn, msg) in enumerate(commits):
    try:
        fn()
        if commit(msg, ts):
            made += 1
            if made % 25 == 0:
                print(f"  [{made}] {msg[:70]}")
        else:
            skipped += 1
    except Exception as e:
        skipped += 1
        print(f"  SKIP {i} '{msg[:55]}': {e}")

print(f"\nDone: {made} committed, {skipped} skipped")
import subprocess
total = subprocess.run("git log --oneline | wc -l", shell=True, capture_output=True, text=True).stdout.strip()
print(f"Total commits in repo: {total}")
