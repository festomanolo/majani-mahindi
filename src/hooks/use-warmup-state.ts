import { useEffect, useState } from "react";
import { getWarmupState, onWarmupChange, type WarmupState } from "@/lib/diagnosis";

export function useWarmupState(): WarmupState {
  const [state, setState] = useState<WarmupState>(getWarmupState);
  useEffect(() => onWarmupChange(setState), []);
  return state;
}
