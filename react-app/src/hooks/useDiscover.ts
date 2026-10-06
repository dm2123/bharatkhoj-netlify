import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import type { DiscoverStory } from "../api/types";

/**
 * Infinite-scroll Discover feed.
 * Mirrors loadDiscover() in public/index.html: 12 stories per page,
 * appends pages, stops when a page comes back empty.
 */
export function useDiscover() {
  const [stories, setStories] = useState<DiscoverStory[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const d = await api.discover(page);
      if (!d.stories.length) {
        setHasMore(false);
      } else {
        setStories((prev) => [...prev, ...d.stories]);
        setPage((p) => p + 1);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    void loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hide = useCallback((id: string) => {
    // "Not interested" — mirrors hideCard()
    setStories((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, liked: !s.liked } : s)),
    );
  }, []);

  return { stories, loading, hasMore, loadMore, hide, toggleLike };
}
