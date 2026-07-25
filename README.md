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

Node.js 20+, Chrome 112+, Edge 112+, or Firefox 119+ (desktop) with WASM SIMD.

## Quick Start

> Run all commands from the repository root.

```bash
# 1. Install dependencies
npm install

# 2. Download model (see Model section)
# 3. Start dev server
npm run dev
```

The dev server runs on `http://localhost:3000` by default.

## Model

> ResNet50 trained on PlantVillage (38 classes, macro-F1 0.9865, leaf-grouped split).


Download `cropguard.onnx` from the releases page and place it in `public/models/`.

## Contributing

Pull requests welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (React 19) |
| Styling | Tailwind CSS v4 |
| Inference | ONNX Runtime Web |
| State | React Context + localStorage |
| Comms | Server-Sent Events (SSE) |
