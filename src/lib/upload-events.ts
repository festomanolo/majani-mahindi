/**
 * In-process SSE hub.
 *
 * When the phone POSTs an image the upload server function calls `emit()`.
 * The PC dashboard holds a persistent GET /api/events connection; `subscribe()`
 * registers its response writer and each `emit()` pushes the event to all
 * active subscribers.
 *
 * This module runs only in the Nitro server process — never in the browser.
 */

export type PhoneUploadEvent = {
  id: string;
  imageDataUrl: string; // full data-URL so the PC can display + run inference
  device: string;
  capturedAt: number;
};

type Subscriber = (event: PhoneUploadEvent) => void;

const subscribers = new Set<Subscriber>();

export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function emit(event: PhoneUploadEvent): void {
  for (const fn of subscribers) {
    try {
      fn(event);
    } catch {
      // Stale subscriber — remove it
      subscribers.delete(fn);
    }
  }
}
