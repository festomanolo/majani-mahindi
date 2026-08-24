# Majani Mahindi 🌽

![CI](https://github.com/festomanolo/majani-mahindi/actions/workflows/ci.yml/badge.svg)


Local-network maize leaf disease analyser built with TanStack Start,
React 19, Tailwind v4, and ONNX Runtime Web.

## Features

- 📱 Phone scanner over local Wi-Fi
- 🤖 On-device ONNX inference (no cloud)
- 🌿 Detects: Healthy, Common Rust, Northern Leaf Blight, Gray Leaf Spot
- 📊 Full diagnosis report with recommended actions

## Requirements

Node.js 20+, a modern Chromium browser (Chrome 112+ or Edge 112+) for full WASM SIMD support.

## Quick Start

```bash
npm install
npm run dev
```

## Model

Download `cropguard.onnx` from the releases page and place it in `public/models/`.

## Contributing

Pull requests welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
