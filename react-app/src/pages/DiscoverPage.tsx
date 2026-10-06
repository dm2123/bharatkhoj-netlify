import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDiscover } from "../hooks/useDiscover";
import { DiscoverCard } from "../components/DiscoverCard";
import { TopBar } from "../components/TopBar";
import { toast } from "../components/Toast";

/** /discover — infinite-scroll news feed (Google Discover style). */
export function DiscoverPage() {
  const navigate = useNavigate();
  const { stories, loading, hasMore, loadMore, hide, toggleLike } = useDiscover();
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) void loadMore();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-gbg text-gtext pb-24 md:pb-10">
      <TopBar
        query=""
        onSearch={(nq) => navigate(`/search?q=${encodeURIComponent(nq)}&tab=all`)}
        onHome={() => navigate("/")}
        notify={toast}
      />
      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        <h1 className="text-xl font-bold">Discover</h1>
        {stories.map((s) => (
          <DiscoverCard
            key={s.id}
            story={s}
            onHide={hide}
            onToggleLike={toggleLike}
            notify={toast}
          />
        ))}
        {loading && <p className="text-center text-gsub py-4">Aur khabrein…</p>}
        {!hasMore && stories.length > 0 && (
          <p className="text-center text-gsub py-6">Bas itni hi khabrein hain.</p>
        )}
        <div ref={sentinel} />
      </main>
    </div>
  );
}
