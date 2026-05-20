import { useEffect, useState } from "react";
import type { Trial } from "../types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: Trial[] }
  | { status: "error"; message: string };

export function useTrials(): LoadState {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/trials.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Trial[]>;
      })
      .then((data) => setState({ status: "ready", data }))
      .catch((err) => setState({ status: "error", message: String(err) }));
  }, []);

  return state;
}
