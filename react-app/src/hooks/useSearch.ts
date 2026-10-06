import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { SearchResponse, SearchTab } from "../api/types";

/** Search state for the /search route (query + tab + page). */
export function useSearch(q: string, tab: SearchTab, page: number) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .search(q, tab, page)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, tab, page]);

  return { data, loading, error };
}
