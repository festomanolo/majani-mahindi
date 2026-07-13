import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { runInference, prewarmModel, type AnalysisResult } from "./diagnosis";
import leafSample from "@/assets/leaf-sample.jpg";

// Possible states of the phone-to-PC connection
export type ConnectionStatus = "disconnected" | "searching" | "connecting" | "connected";

export type SampleStatus = "sending" | "received" | "analyzing" | "complete" | "failed";

// Quality assessment carried alongside every sample
export type ImageQuality = {
  overall: "Good" | "Fair" | "Low";
  lighting: boolean;
  focus: boolean;
  visibility: boolean;
  background: boolean;
};

// A captured and optionally analysed leaf scan
export type Sample = {
  id: string;
  imageUrl: string;
  capturedAt: number;
  device: string;
  quality: ImageQuality;
  status: SampleStatus;
  stage: number;
  transfer: number;
  result?: AnalysisResult;
  error?: string;
  saved?: boolean;
};

// Current state of the mobile device connection
export type Connection = {
  status: ConnectionStatus;
  pcName: string;
  phoneName: string;
  network: string;
  address: string;
  code: string;
  connectedAt?: number;
};

type State = {
  connection: Connection;
  samples: Sample[];
  currentId: string | null;
  autoAnalyze: boolean;
};

export const STAGES = [
  "Receiving image",  // stage 0
  "Image quality check",
  "Image preprocessing",
  "Feature analysis",  // stage 3
  "Classification",
  "Recommendation",  // stage 5
];

const STORAGE_KEY = "maizevision.state.v1";
const CHANNEL = "maizevision.sync.v1";

const initialState: State = {
  connection: {
    status: "disconnected",
    pcName: "STATION-01",
    phoneName: "Field scanner",
    network: "MaizeVision-LAN",
    address: "loading...",
    code: "394 871",
  },
  samples: [],
  currentId: null,
  autoAnalyze: true,
};

function serialise(state: State): string {
  // Keep image payloads only for the newest samples so local storage stays small.
  const samples = state.samples.map((s, i) => (i < 6 ? s : { ...s, imageUrl: leafSample }));
  return JSON.stringify({ ...state, samples });
}

type Ctx = State & {
  ready: boolean;
  current: Sample | null;
  connect: () => void;
  disconnect: () => void;
  setAutoAnalyze: (v: boolean) => void;
  sendSample: (input: { imageUrl: string; quality: ImageQuality }) => string;
  startAnalysis: (id: string) => void;
  markSaved: (id: string) => void;
  clearCurrent: () => void;
  retry: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

/** Root context provider for all MaizeVision state */
export function MaizeVisionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const localWrite = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupted state */
    }
    setReady(true);
    // Pre-load the ONNX model so the first scan doesn't stall
    prewarmModel();

    // Resolve the real LAN address from the Vite-injected constant so the QR
    // code always shows the correct IP even when the PC browses via localhost.
    const liveAddress = `${__LAN_IP__}:${__LAN_PORT__}`;
    setState((s) => ({
      ...s,
      connection: { ...s.connection, address: liveAddress },
    }));

    const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL) : null;
    channelRef.current = channel;
    if (channel) {
      channel.onmessage = (e) => {
        localWrite.current = false;
        setState(e.data as State);
      };
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        localWrite.current = false;
        try {
          setState(JSON.parse(e.newValue) as State);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  useEffect(() => {
    if (!ready || !localWrite.current) return;
    localWrite.current = false;
    try {
      localStorage.setItem(STORAGE_KEY, serialise(state));
    } catch {
      /* quota — in-memory state still works */
    }
    channelRef.current?.postMessage(state);
  }, [state, ready]);

  const autoRef = useRef(state.autoAnalyze);
  autoRef.current = state.autoAnalyze;

  const update = useCallback((fn: (s: State) => State) => {

    localWrite.current = true;
    setState(fn);
  }, []);

  const patchSample = useCallback(
    (id: string, patch: Partial<Sample>) =>
      update((s) => ({
        ...s,
        samples: s.samples.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      })),
    [update],
  );

  const connect = useCallback(() => {
    update((s) => ({ ...s, connection: { ...s.connection, status: "connecting" } }));
    window.setTimeout(
      () =>
        update((s) => ({
          ...s,
          connection: { ...s.connection, status: "connected", connectedAt: Date.now() },
        })),
      1400,
    );
  }, [update]);

  const disconnect = useCallback(
    () =>
      update((s) => {
        const { connectedAt: _drop, ...rest } = s.connection;
        return {
          ...s,
          connection: { ...rest, status: "disconnected" as const },
        };
      }),
    [update],
  );

  const startAnalysis = useCallback(
    (id: string) => {
      // Find the imageUrl for this sample from state (via ref to avoid stale closure)
      setState((prev) => {
        const sample = prev.samples.find((s) => s.id === id);
        const imageUrl = sample?.imageUrl ?? "";

        // Kick off the async inference in a separate non-blocking flow
        (async () => {
          // Animate stages visually while inference runs in background
          patchSample(id, { status: "analyzing", stage: 0 });
          for (let i = 0; i < STAGES.length; i++) {
            await new Promise((r) => window.setTimeout(r, 550));
            patchSample(id, { stage: i + 1 });
          }
          // Run real ONNX inference
          try {
            const { result, quality } = await runInference(imageUrl);
            patchSample(id, { status: "complete", stage: STAGES.length, result, quality });
          } catch (err) {
            console.error("ONNX inference failed:", err);
            patchSample(id, { status: "failed", error: String(err) });
          }
        })();

        return prev; // state unchanged here — actual updates go through patchSample
      });
    },
    [patchSample],
  );

  const sendSample = useCallback(
    (input: { imageUrl: string; quality: ImageQuality }) => {
      const id = `MZ-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(
        Math.floor(Math.random() * 900 + 100),
      )}`;
      const sample: Sample = {
        id,
        imageUrl: input.imageUrl,
        capturedAt: Date.now(),
        device: "Field scanner",
        quality: input.quality,
        status: "sending",
        stage: 0,
        transfer: 0,
      };
      update((s) => ({ ...s, samples: [sample, ...s.samples].slice(0, 30), currentId: id }));

      [10, 35, 65, 85, 100].forEach((pct, i) => {
        window.setTimeout(() => patchSample(id, { transfer: pct }), 220 * (i + 1));
      });
      window.setTimeout(() => {
        patchSample(id, { status: "received" });
        window.setTimeout(() => {
          if (autoRef.current) startAnalysis(id);
        }, 600);
      }, 1250);

      return id;
    },
    [update, patchSample, startAnalysis],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      current: state.samples.find((s) => s.id === state.currentId) ?? null,
      connect,
      disconnect,
      setAutoAnalyze: (v) => update((s) => ({ ...s, autoAnalyze: v })),
      sendSample,
      startAnalysis,
      markSaved: (id) => patchSample(id, { saved: true }),
      clearCurrent: () => update((s) => ({ ...s, currentId: null })),
      retry: (id) => { patchSample(id, { status: 'received', stage: 0, error: undefined }); startAnalysis(id); },
    }),
    [state, ready, connect, disconnect, sendSample, startAnalysis, patchSample, update],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMaizeVision() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMaizeVision must be used inside MaizeVisionProvider");
  return ctx;
}

/** Format a Unix ms timestamp into a locale-aware string */
export function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
