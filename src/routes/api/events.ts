import { createFileRoute } from "@tanstack/react-router";

/**
 * GET /api/events — Server-Sent Events stream
 *
 * Uses TanStack Start's server.handlers.GET to expose a real HTTP handler
 * (not a loader) so the response can be a persistent streaming connection.
 * The PC dashboard opens this once; every phone upload pushes a data: line.
 */
export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: async () => {
        const { subscribe } = await import("../../lib/upload-events");

        let unsubscribe: (() => void) | undefined;

        const stream = new ReadableStream({
          start(controller) {
            const enc = new TextEncoder();

            // Keep-alive ping every 20 s so proxies don't close the connection
            const heartbeat = setInterval(() => {
              try {
                controller.enqueue(enc.encode(": ping\n\n"));
              } catch {
                clearInterval(heartbeat);
              }
            }, 20_000);

            unsubscribe = subscribe((event) => {
              try {
                controller.enqueue(
                  enc.encode(`data: ${JSON.stringify(event)}\n\n`),
                );
              } catch {
                clearInterval(heartbeat);
                unsubscribe?.();
              }
            });
          },
          cancel() {
            unsubscribe?.();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no", // disable nginx buffering if present
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
  // No React component — this path is HTTP-only
  component: () => null,
});
