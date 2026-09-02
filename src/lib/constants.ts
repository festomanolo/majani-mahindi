/** Application-wide constants */

/** Maximum number of scan samples held in the React state tree */
export const MAX_SAMPLES = 30;

/** Maximum number of samples whose image data is kept (rest use placeholder) */
export const MAX_IMAGE_SAMPLES = 6;

/** Low-confidence threshold in percent */
export const LOW_CONF_PCT = 45;

/** Not-maize probability threshold */
export const NOT_MAIZE_PROB = 0.62;

/** ONNX model input resolution */
/** ResNet50 input resolution (pixels) */
export const MODEL_INPUT_SIZE = 224;

/** SSE reconnect delay in milliseconds (3 s in normal operation) */
export const SSE_RECONNECT_MS = 3000;

/** Simulated connection delay in milliseconds */
/** Delay (ms) before showing connection success */
export const CONNECT_DELAY_MS = 1200;

/** Confidence % threshold above which the result badge is shown in green */
export const HIGH_CONF_PCT = 80;

/** Number of recent scans shown in the dashboard panel */
export const DASHBOARD_RECENT_COUNT = 5;

/** Pages of history shown per page */
export const HISTORY_PAGE_SIZE = 20;

// Image quality thresholds (issue #16 tuning)
// Lighting: [30, 220] | Focus Laplacian: > 140 | Green dominance: 1.02x, min=32
