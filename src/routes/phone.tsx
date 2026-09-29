import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, RefreshCw, Upload, Leaf } from "lucide-react";
import { uploadLeafFn } from "@/lib/upload-fn";

export const Route = createFileRoute("/phone")({
  head: () => ({
    meta: [
      { title: "Phone Scanner — MaizeVision" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
    ],
  }),
  component: PhoneScanner,
});

type Step = "capture" | "preview" | "sending" | "sent" | "error";

const QUALITY_TIPS = [
  "Hold the phone steady — avoid blur",
  "Fill the frame with one maize leaf",
  "Use natural light, avoid harsh shadows",
  "Plain background preferred",
];

function PhoneScanner() {
  const [step, setStep] = useState<Step>("capture");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  /* ── Camera helpers ──────────────────────────────────────────── */
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      // Fall back to file picker when camera API is unavailable
      fileRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const captureFromVideo = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    stopCamera();
    setImageDataUrl(dataUrl);
    setStep("preview");
  }, [stopCamera]);

  /* ── File picker fallback ────────────────────────────────────── */
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target?.result as string);
      setStep("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  /* ── Upload ──────────────────────────────────────────────────── */
  const send = useCallback(async () => {
    if (!imageDataUrl) return;
    setStep("sending");
    try {
      const result = await uploadLeafFn({
        data: {
          imageDataUrl,
          device: navigator.userAgent.includes("iPhone")
            ? "iPhone"
            : navigator.userAgent.includes("Android")
              ? "Android"
              : "Mobile scanner",
        },
      });
      setSampleId(result.id);
      setStep("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setStep("error");
    }
  }, [imageDataUrl]);

  const reset = useCallback(() => {
    setImageDataUrl(null);
    setSampleId(null);
    setErrorMsg("");
    setStep("capture");
  }, []);

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Leaf className="size-6 text-primary" strokeWidth={1.5} />
        <div>
          <div className="text-sm font-semibold leading-none">MaizeVision</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Leaf scanner</div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ── CAPTURE STEP ── */}
        {step === "capture" && (
          <div className="flex flex-1 flex-col">
            {cameraActive ? (
              /* Live camera viewfinder */
              <div className="relative flex-1 bg-black">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                {/* Overlay guide */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="size-64 rounded-2xl border-2 border-white/60 ring-4 ring-white/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-8 pt-16">
                  <p className="mb-6 text-center text-sm text-white/80">
                    Position the leaf inside the frame
                  </p>
                  <button
                    onClick={captureFromVideo}
                    className="mx-auto flex size-16 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur transition active:scale-95"
                    aria-label="Take photo"
                  >
                    <Camera className="size-7 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              /* Pre-camera screen */
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
                <div className="grid size-20 place-items-center rounded-full border border-border bg-card">
                  <Leaf className="size-9 text-primary" strokeWidth={1.25} />
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-semibold tracking-tight">Scan a maize leaf</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Take a photo and it will be sent to the diagnostic station on your network.
                  </p>
                </div>

                <ul className="w-full max-w-xs space-y-2 text-sm">
                  {QUALITY_TIPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-0.5 size-1.5 shrink-0 translate-y-1 rounded-full bg-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>

                <div className="flex w-full max-w-xs flex-col gap-3">
                  <button
                    onClick={startCamera}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground transition active:scale-95"
                  >
                    <Camera className="size-4" />
                    Open camera
                  </button>
                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3.5 text-sm font-medium transition active:scale-95">
                    <Upload className="size-4" />
                    Choose from gallery
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PREVIEW STEP ── */}
        {step === "preview" && imageDataUrl && (
          <div className="flex flex-1 flex-col">
            <div className="relative flex-1 bg-black">
              <img
                src={imageDataUrl}
                alt="Captured leaf"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-3 border-t border-border bg-card px-5 py-5">
              <p className="text-sm text-muted-foreground">
                Check the photo is clear and the leaf fills the frame.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium transition active:scale-95"
                >
                  <RefreshCw className="size-4" />
                  Retake
                </button>
                <button
                  onClick={send}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition active:scale-95"
                >
                  <Upload className="size-4" />
                  Send to station
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SENDING STEP ── */}
        {step === "sending" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
            <Loader2 className="size-12 animate-spin text-primary" />
            <div className="text-center">
              <div className="font-semibold">Sending to station…</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Uploading your photo over the local network.
              </p>
            </div>
          </div>
        )}

        {/* ── SENT STEP ── */}
        {step === "sent" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
            <CheckCircle2 className="size-14 text-primary" strokeWidth={1.5} />
            <div className="text-center">
              <div className="text-xl font-semibold">Photo received!</div>
              <p className="mt-2 text-sm text-muted-foreground">
                The diagnostic station is analysing your leaf. Check the PC screen for results.
              </p>
              {sampleId && (
                <div className="mt-3 rounded-md border border-border bg-card px-4 py-2 font-mono text-xs">
                  {sampleId}
                </div>
              )}
            </div>
            <button
              onClick={reset}
              className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium transition active:scale-95"
            >
              <Camera className="size-4" />
              Scan another leaf
            </button>
          </div>
        )}

        {/* ── ERROR STEP ── */}
        {step === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
            <div className="grid size-16 place-items-center rounded-full border border-destructive/30 bg-destructive/10">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-center">
              <div className="font-semibold text-destructive">Upload failed</div>
              <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Make sure your phone is on the same Wi-Fi network as the station.
              </p>
            </div>
            <button
              onClick={() => setStep("preview")}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition active:scale-95"
            >
              Try again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
