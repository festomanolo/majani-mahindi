import * as ort from "onnxruntime-web";

// ── Model: CropGuard ResNet50 (AbhiCommits/cropguard-models) ─────────────────
// 38-class PlantVillage, macro-F1 0.9865, leaf-grouped train/test split.
// Input: NCHW float32, ImageNet mean/std normalised, values in [-~2.1, ~2.6].
// Output: "logits" — raw logits over 38 classes (apply softmax yourself).
// Corn classes: 7=GrayLeafSpot  8=CommonRust  9=NorthernLeafBlight  10=Healthy

export type ConditionKey = "healthy" | "rust" | "blight" | "gray_leaf_spot";

export type Condition = {
  key: ConditionKey;
  name: string;
  summary: string;
  signs: string[];
  immediate: string[];
  field: string[];
  monitoring: string[];
};

export const CONDITIONS: Record<ConditionKey, Condition> = {
  healthy: {
    key: "healthy",
    name: "Healthy Leaf",
    summary: "No disease or deficiency pattern detected. The leaf shows normal, vigorous growth.",
    signs: [
      "Uniform mid-to-deep green coloration across the entire blade",
      "Veins and interveinal tissue equally coloured",
      "No lesions, spots, pustules, or necrotic areas",
      "Leaf shape and texture match the healthy reference image",
    ],
    immediate: ["No corrective action required for this sample."],
    field: [
      "Maintain the current fertiliser and crop-protection programme.",
      "Continue routine scouting across different sections of the field.",
      "Ensure irrigation schedules keep soil moisture optimal.",
    ],
    monitoring: [
      "Scan a representative sample of plants from each field zone weekly.",
      "Prioritise older lower leaves early in the season — deficiencies appear there first.",
      "Record scan results over time to build a field baseline.",
    ],
  },

  rust: {
    key: "rust",
    name: "Common Rust",
    summary:
      "Puccinia sorghi infection producing cinnamon-brown pustules scattered over both leaf surfaces.",
    signs: [
      "Small oval-to-elongated cinnamon-brown pustules on upper and lower leaf surface",
      "Pustules rupture to release powdery rust-coloured spores",
      "Pustules surrounded by a faint yellow halo",
      "Heavily infected leaves may yellow and die back early",
    ],
    immediate: [
      "Apply a registered foliar fungicide (triazole or strobilurin class) once pustules appear on multiple plants.",
      "Time application in the early morning to maximise retention.",
      "Avoid spraying at tasselling to protect pollinators.",
    ],
    field: [
      "Rotate to a non-host crop for at least one season to break the spore cycle.",
      "Choose rust-resistant varieties for the next planting season.",
      "Remove and destroy heavily infected crop debris after harvest.",
      "Avoid excessive nitrogen fertilisation — succulent tissue is more susceptible.",
    ],
    monitoring: [
      "Scout weekly from V6 onwards, especially during warm (16–23 °C), humid weather.",
      "Count pustules per leaf and record percentage of leaf area affected.",
      "A second fungicide application may be needed 14–21 days after the first.",
    ],
  },

  blight: {
    key: "blight",
    name: "Northern Leaf Blight",
    summary:
      "Exserohilum turcicum infection producing long cigar-shaped grey-green lesions parallel to the leaf veins.",
    signs: [
      "Elongated (2–15 cm) grey-green to tan lesions running parallel to veins",
      "Lesions have a characteristic 'cigar' or spindle shape",
      "Dark-olive sporulation visible in the lesion centre under humid conditions",
      "Disease progresses from lower leaves upward; ear-leaf infection causes most yield loss",
    ],
    immediate: [
      "Apply a registered fungicide (triazole or strobilurin) when lesions first appear on lower leaves.",
      "Do not delay: yield losses increase sharply if the ear leaf is infected before silking.",
      "Remove and bag severely infected lower leaves to reduce the local spore load.",
    ],
    field: [
      "Rotate to a non-grass crop for one or two seasons; the fungus persists in maize residue.",
      "Till or incorporate infected residue deeply after harvest.",
      "Select NLB-tolerant hybrids, especially in high-humidity fields.",
      "Avoid overhead irrigation late in the day — prolonged leaf wetness favours infection.",
    ],
    monitoring: [
      "Scout twice weekly from V8 onwards, focusing on the ear leaf and leaves above it.",
      "Record lesion count per plant and percentage of leaf area affected.",
      "If lesions reach the ear leaf before silking, a second fungicide pass in 14 days may be warranted.",
    ],
  },

  gray_leaf_spot: {
    key: "gray_leaf_spot",
    name: "Gray Leaf Spot",
    summary:
      "Cercospora zeae-maydis infection producing rectangular grey-to-tan lesions bounded by leaf veins.",
    signs: [
      "Rectangular grey, tan, or brown lesions sharply bounded by leaf veins",
      "Lesions typically 1–6 cm long, parallel to the leaf midrib",
      "Under humid conditions a fine grey powdery coating of conidia visible on lesion surface",
      "Lesions coalesce under heavy infection, causing large areas of leaf death",
    ],
    immediate: [
      "Apply a strobilurin or triazole fungicide at the first appearance of lesions — the ear leaf is the critical target.",
      "Prioritise fields with a history of gray leaf spot or continuous maize cropping.",
    ],
    field: [
      "Rotate to a non-grass crop; the fungus survives in infected crop residue on the soil surface.",
      "Till to bury residue and reduce the initial inoculum for the next season.",
      "Plant resistant hybrids wherever available — host resistance is the most cost-effective long-term control.",
      "Avoid minimum-till in fields with high residue levels and a history of the disease.",
    ],
    monitoring: [
      "Scout from V10 to tasselling in fields with high residue or a history of gray leaf spot.",
      "Record the number of lesions on the ear leaf and the leaf above it.",
      "Re-check 10–14 days after a fungicide application to evaluate disease progression.",
    ],
  },
};

export type Prediction = { key: ConditionKey; name: string; confidence: number };

export type AnalysisResult = {
  primary: Prediction;
  alternatives: Prediction[];
  otherConfidence: number;
  processingMs: number;
  modelVersion: string;
  lowConfidence: boolean;
  notMaize?: boolean;
};

export const MODEL_VERSION = "ResNet50 · CropGuard · PlantVillage";
export const DATASET = "PlantVillage · 38 classes · leaf-grouped split";

// ── ImageNet normalisation constants ─────────────────────────────────────────
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD  = [0.229, 0.224, 0.225];

// Corn class indices in the 38-class PlantVillage label order
const CORN_INDICES: Record<number, ConditionKey> = {
  7:  "gray_leaf_spot",
  8:  "rust",
  9:  "blight",
  10: "healthy",
};

// If non-corn classes collectively score above this the image is probably not a maize leaf
const NOT_MAIZE_THRESHOLD = 0.60;
const LOW_CONF_THRESHOLD  = 50; // percent

// ── ONNX session singleton ────────────────────────────────────────────────────
ort.env.wasm.wasmPaths = "/";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create("/models/cropguard.onnx", {
      executionProviders: ["wasm"],
    });
  }
  return sessionPromise;
}

export function prewarmModel(): void {
  getSession().catch(() => { sessionPromise = null; });
}

// ── Image quality analysis ────────────────────────────────────────────────────

export type ImageQualityMetrics = {
  overall: "Good" | "Fair" | "Low";
  lighting: boolean;
  focus: boolean;
  visibility: boolean; // green dominance → likely a leaf
  background: boolean;
};

function analyseQuality(data: Uint8ClampedArray, size: number): ImageQualityMetrics {
  const n = size * size;
  let sumR = 0, sumG = 0, sumB = 0;
  for (let i = 0; i < n; i++) {
    sumR += data[i * 4 + 0] ?? 0;
    sumG += data[i * 4 + 1] ?? 0;
    sumB += data[i * 4 + 2] ?? 0;
  }
  const avgR = sumR / n, avgG = sumG / n, avgB = sumB / n;
  const avgLum = avgR * 0.299 + avgG * 0.587 + avgB * 0.114;

  // Lighting: reject too dark or blown-out
  const lighting = avgLum >= 40 && avgLum <= 215;

  // Focus: Laplacian variance (sample every other row/col for speed)
  let lapSum = 0, lapCount = 0;
  for (let y = 1; y < size - 1; y += 2) {
    for (let x = 1; x < size - 1; x += 2) {
      const lum = (px: number) =>
        (data[px] ?? 0) * 0.299 + (data[px + 1] ?? 0) * 0.587 + (data[px + 2] ?? 0) * 0.114;
      const c = lum((y * size + x) * 4);
      const t = lum(((y - 1) * size + x) * 4);
      const b = lum(((y + 1) * size + x) * 4);
      const l = lum((y * size + (x - 1)) * 4);
      const r = lum((y * size + (x + 1)) * 4);
      const lap = Math.abs(4 * c - t - b - l - r);
      lapSum += lap * lap; lapCount++;
    }
  }
  const lapVar = lapCount > 0 ? lapSum / lapCount : 0;
  const focus = lapVar > 200;

  // Leaf visibility: green channel dominance
  const visibility = avgG > avgR * 1.05 && avgG > avgB * 1.05 && avgG > 45;

  const passCount = [lighting, focus, visibility].filter(Boolean).length;
  const overall: "Good" | "Fair" | "Low" =
    passCount === 3 ? "Good" : passCount === 2 ? "Fair" : "Low";

  return { overall, lighting, focus, visibility, background: true };
}

// ── Preprocessing: NCHW + ImageNet normalisation ─────────────────────────────

async function preprocessImage(
  imageUrl: string,
): Promise<{ tensor: ort.Tensor; quality: ImageQualityMetrics }> {
  const SIZE = 224;

  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = new OffscreenCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  const quality = analyseQuality(data, SIZE);

  // NCHW layout: [1, 3, 224, 224]  — one channel plane at a time
  const float32 = new Float32Array(1 * 3 * SIZE * SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const r = (data[i * 4 + 0] ?? 0) / 255.0;
    const g = (data[i * 4 + 1] ?? 0) / 255.0;
    const b = (data[i * 4 + 2] ?? 0) / 255.0;
    float32[0 * SIZE * SIZE + i] = (r - (IMAGENET_MEAN[0] ?? 0.485)) / (IMAGENET_STD[0] ?? 0.229);
    float32[1 * SIZE * SIZE + i] = (g - (IMAGENET_MEAN[1] ?? 0.456)) / (IMAGENET_STD[1] ?? 0.224);
    float32[2 * SIZE * SIZE + i] = (b - (IMAGENET_MEAN[2] ?? 0.406)) / (IMAGENET_STD[2] ?? 0.225);
  }

  return { tensor: new ort.Tensor("float32", float32, [1, 3, SIZE, SIZE]), quality };
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

// ── Public inference function ─────────────────────────────────────────────────

export async function runInference(
  imageUrl: string,
): Promise<{ result: AnalysisResult; quality: ImageQualityMetrics }> {
  const t0 = performance.now();

  const session = await getSession();
  const { tensor, quality } = await preprocessImage(imageUrl);

  const inputName = session.inputNames[0];
  if (!inputName) throw new Error("ONNX model has no input");
  const feeds: Record<string, ort.Tensor> = { [inputName]: tensor };
  const output = await session.run(feeds);

  const outputName = session.outputNames[0];
  if (!outputName) throw new Error("ONNX model has no output");
  const logitsRaw = Array.from(output[outputName]!.data as Float32Array);
  const probs = softmax(logitsRaw); // 38 values

  // Corn class probabilities
  const cornProbs = Object.entries(CORN_INDICES).map(([idxStr, key]) => ({
    key,
    prob: probs[Number(idxStr)] ?? 0,
    confidence: Math.round((probs[Number(idxStr)] ?? 0) * 100),
  })).sort((a, b) => b.prob - a.prob);

  // Non-corn probability mass
  const cornTotal = cornProbs.reduce((s, p) => s + p.prob, 0);
  const otherProb = 1 - cornTotal;
  const notMaize = otherProb >= NOT_MAIZE_THRESHOLD;

  const primary = cornProbs[0] ?? { key: "healthy" as ConditionKey, prob: 0, confidence: 0 };
  const alternatives: Prediction[] = cornProbs
    .slice(1)
    .map((p) => ({ key: p.key, name: CONDITIONS[p.key].name, confidence: p.confidence }));

  const processingMs = Math.round(performance.now() - t0);

  const result: AnalysisResult = {
    primary: {
      key: primary.key,
      name: CONDITIONS[primary.key].name,
      confidence: primary.confidence,
    },
    alternatives,
    otherConfidence: Math.round(otherProb * 100),
    processingMs,
    modelVersion: MODEL_VERSION,
    lowConfidence: primary.confidence < LOW_CONF_THRESHOLD || notMaize,
    notMaize,
  };

  return { result, quality };
}
