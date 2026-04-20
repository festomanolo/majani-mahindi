import { useEffect, useState } from "react";
import { getWarmupState, onWarmupChange, type WarmupState } from "@/lib/diagnosis";

/** Subscribe to the ONNX model warm-up progress state */
export function useWarmupState(): WarmupState {
  const [state, setState] = useState<WarmupState>(getWarmupState);
  useEffect(() => onWarmupChange(setState), []);
  return state;
}
