import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Widgets } from "../api/types";

/**
 * Homepage widgets (weather, gold, NIFTY/SENSEX, trending, cricket).
 * Sections hide on failed data — never fabricated (per project rule).
 */
export function useWidgets() {
  const [widgets, setWidgets] = useState<Widgets | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .widgets()
      .then((w) => {
        if (!cancelled) setWidgets(w);
      })
      .catch(() => {
        // Widgets are best-effort; the homepage simply hides them.
        if (!cancelled) setWidgets({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return widgets;
}
