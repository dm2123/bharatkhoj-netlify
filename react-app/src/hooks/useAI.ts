import { useCallback, useState } from "react";
import { api } from "../api/client";
import type { AIResponse } from "../api/types";

/** AI Mode: ask + follow-ups (mirrors doAISearch/askFollowUp). */
export function useAI() {
  const [answer, setAnswer] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ q: string; a: AIResponse }[]>([]);

  const ask = useCallback(
    async (q: string) => {
      if (!q.trim() || loading) return;
      setLoading(true);
      setError(null);
      try {
        // Follow-ups carry prior context like the current site does.
        const ctx =
          history.length > 0
            ? ` (context: ${history
                .slice(-2)
                .map((h) => h.q)
                .join("; ")})`
            : undefined;
        const a = await api.ai(q, ctx);
        setAnswer(a);
        setHistory((h) => [...h, { q, a }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "AI request failed");
      } finally {
        setLoading(false);
      }
    },
    [history, loading],
  );

  const reset = useCallback(() => {
    setAnswer(null);
    setHistory([]);
    setError(null);
  }, []);

  return { answer, loading, error, history, ask, reset };
}
