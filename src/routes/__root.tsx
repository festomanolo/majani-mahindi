import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";

import appCss from "../styles.css?url";
import { MaizeVisionProvider, useMaizeVision, type ImageQuality } from "@/lib/maizevision-store";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-6xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This screen is not part of the MaizeVision station.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This screen didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on the station. Try again or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MaizeVision Local AI" },
      {
        name: "description",
        content: "Local-network maize leaf analysis: phone scanner, on-site AI diagnosis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MaizeVisionProvider>
        <PhoneImageListener />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-center" />
      </MaizeVisionProvider>
    </QueryClientProvider>
  );
}

/**
 * Runs at the root level (always mounted) and listens for SSE events from the
 * phone. When a photo arrives it:
 *  1. Calls sendSample() to register it in the store
 *  2. Navigates to the Dashboard (/)
 *  3. Immediately starts ONNX analysis (auto-analyze is always on here)
 *  4. Shows a toast so the user knows something arrived
 */
function PhoneImageListener() {
  const { sendSample, startAnalysis, autoAnalyze } = useMaizeVision();
  const navigate = useNavigate();

  const sendSampleRef    = useRef(sendSample);
  const startAnalysisRef = useRef(startAnalysis);
  const autoAnalyzeRef   = useRef(autoAnalyze);
  sendSampleRef.current    = sendSample;
  startAnalysisRef.current = startAnalysis;
  autoAnalyzeRef.current   = autoAnalyze;

  useEffect(() => {
    let es: EventSource | null = null;
    let stopped = false;

    function connect() {
      if (stopped) return;
      es = new EventSource("/api/events");

      es.onmessage = (e: MessageEvent) => {
        try {
          const event = JSON.parse(e.data as string) as {
            id: string;
            imageDataUrl: string;
            device: string;
            capturedAt: number;
          };

          // Placeholder quality — real metrics computed during ONNX preprocessing
          const quality: ImageQuality = {
            overall: "Good",
            lighting: true,
            focus: true,
            visibility: true,
            background: true,
          };

          const sampleId = sendSampleRef.current({
            imageUrl: event.imageDataUrl,
            quality,
          });

          // Navigate to dashboard regardless of current page
          void navigate({ to: "/" });

          toast.success("Photo received from phone", {
            description: "Analysing leaf…",
            duration: 3000,
          });

          // Always auto-analyze immediately — don't wait for the button
          // Give the store one tick to commit the new sample before starting
          window.setTimeout(() => {
            startAnalysisRef.current(sampleId);
          }, 100);

        } catch {
          // malformed event — ignore
        }
      };

      es.onerror = () => {
        es?.close();
        if (!stopped) window.setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      stopped = true;
      es?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
