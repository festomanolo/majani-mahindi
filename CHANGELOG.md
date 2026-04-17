# Changelog

All notable changes to Majani Mahindi are documented here.

## [Unreleased]
<!-- Add new entries above this line -->


### Added
- Dark mode support with system preference detection
- Swahili (sw) localisation scaffold
- CSV export for scan results
- Pagination hook for history list
- Processing time breakdown component
- Keyboard shortcut hook
- System stats hook
- Report stats utility
- useTheme, useLocale, useDebounce, useInterval, useEventListener, useKeyboardShortcut, usePagination, useSystemStats, useWarmupState, useLocalStorage hooks
- EmptyState, Spinner, CopyButton, StatusBadge, SectionHeader UI components
- ErrorBoundary component
- format.ts: formatBytes, formatDuration, formatPercent, formatDate, formatRelative
- logger.ts: production-safe console wrapper
- assert.ts: dev-only assertion utility
- constants.ts: centralised magic-number constants
- GitHub Actions CI workflow (lint, build, typecheck)
- CONTRIBUTING.md
- .editorconfig
- .nvmrc

### Fixed
- Confidence bar animation jitter (will-change: width)
- Retry button now resets stage progress
- Image quality lighting threshold lowered for overcast shots
- Transfer progress visible before auto-analyze starts
- Simulated ONNX warm-up state exposed via event system

### Removed
- Large ONNX/WASM binaries from git tracking (use releases for downloads)
- Placeholder package name (tanstack_start_ts)

### Changed
- Border radius token adjusted
- Storage key bumped to v2
- Broadcast channel name bumped to v2
- Default PC name updated to STATION-01
- Low-confidence threshold adjusted to 45%
- Focus Laplacian threshold reduced from 200 → 150 for field images
- Green-dominance threshold relaxed for shaded leaf images
- Sample ID suffix widened from 3 to 4 digits
- In-memory sample limit raised to 50
- Stage animation delay reduced to 400ms
- Transfer progress steps increased for visibility

## [0.4.1] — 2026-09-29

### Fixed
- Various threshold tuning based on field feedback
- CSV BOM for Excel compatibility
- Anchor DOM cleanup in CSV download

## [0.3.0] — 2026-09-29

### Added
- See unreleased section above — promoted to 0.3.0

## [0.1.0] — 2026-04-01

### Added
- Initial project scaffold
- TanStack Start + React 19 + Tailwind v4
- ONNX Runtime Web with CropGuard ResNet50 model
- Mobile phone scanner over local Wi-Fi
- 4-class maize disease classification
- Pairing QR code

## [0.6.0] — 2026-09-29

### Added
- math.ts, string.ts, array.ts, object.ts utility libraries
- formatNumber (locale-aware), formatPlural to format.ts
- repeat(), stdDev() utilities
- CONTRIBUTING: security and feature request sections
