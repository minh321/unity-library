"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getMatrix,
  initialState,
  loadState,
  saveState,
  submitAnswer,
} from "@/lib/trainer/engine";
import type { SessionState, SkillRow } from "@/lib/trainer/types";

interface LabContextValue {
  state: SessionState;
  matrix: SkillRow[];
  send: (text: string) => void;
  reset: () => void;
  ready: boolean;
}

const LabContext = createContext<LabContextValue | null>(null);

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const send = useCallback((text: string) => {
    setState((prev) => (prev ? submitAnswer(prev, text) : prev));
  }, []);

  const reset = useCallback(() => {
    const fresh = initialState();
    setState(fresh);
  }, []);

  const matrix = useMemo(() => (state ? getMatrix(state) : []), [state]);

  const value = useMemo(
    () => ({
      state: state ?? initialState(),
      matrix,
      send,
      reset,
      ready: Boolean(state),
    }),
    [state, matrix, send, reset]
  );

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) throw new Error("useLab must be used within LabProvider");
  return ctx;
}
