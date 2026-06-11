/** Application-wide constants */

/** Maximum number of samples kept in memory */
export const MAX_SAMPLES = 30;

/** Maximum number of samples whose image data is kept (rest use placeholder) */
export const MAX_IMAGE_SAMPLES = 6;

/** Low-confidence threshold in percent */
export const LOW_CONF_PCT = 45;

/** Not-maize probability threshold */
export const NOT_MAIZE_PROB = 0.62;

/** ONNX model input resolution */
export const MODEL_INPUT_SIZE = 224;

/** SSE reconnect delay in milliseconds */
export const SSE_RECONNECT_MS = 4000;

/** Simulated connection delay in milliseconds */
export const CONNECT_DELAY_MS = 1200;

/** Minimum confidence % to show green instead of amber */
export const HIGH_CONF_PCT = 80;

/** Number of items shown in the dashboard recent-scans list */
export const DASHBOARD_RECENT_COUNT = 5;
