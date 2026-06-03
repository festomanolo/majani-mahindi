import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UploadSchema = z.object({
  imageDataUrl: z
    .string()
    .min(100)
    .refine((s) => s.startsWith("data:image/"), {
      message: "Must be a valid image data URL",
    }),
  device: z.string().min(1).max(64).default("Field scanner"),
});

/**
 * POST /api/upload  (called from the phone browser)
 *
 * Accepts a base64 image data-URL, validates it, then broadcasts the event
 * to all active PC SSE subscribers via the in-process hub.
 *
 * The server import is done dynamically so the module only resolves on the
 * server — it is never bundled into the client.
 */
// upload-fn.ts — handles image upload from phone
export const uploadLeafFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => UploadSchema.parse(data))
  .handler(async ({ data }) => {
    // Dynamic import keeps upload-events.ts server-only
    const { emit } = await import("./upload-events");
    const event = {
      id: `MZ-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 900 + 100))}`,
      imageDataUrl: data.imageDataUrl,
      device: data.device,
      capturedAt: Date.now(),
    };
    emit(event);
    return { ok: true, id: event.id };
  });
