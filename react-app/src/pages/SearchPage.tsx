import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { TopBar } from "../components/TopBar";
import { TabBar } from "../components/TabBar";
import { SearchTools } from "../components/SearchTools";
import { SuggestionChips } from "../components/SuggestionChips";
import { ResultCard } from "../components/ResultCard";
import { NewsCard } from "../components/NewsCard";
import { ForumCard } from "../components/ForumCard";
import { VideoCard } from "../components/VideoCard";
import { ImageGrid } from "../components/ImageGrid";
import { KnowledgePanel } from "../components/KnowledgePanel";
import { Pagination } from "../components/Pagination";
import { toast } from "../components/Toast";
import type { SearchTab } from "../api/types";

/**
 * /search?q=&tab=&page= — renders the active tab.
 * Desktop: knowledge panel in right rail. Mobile: stacked.
 * Shopping/Books/Maps/Flights show honest placeholders until backends land.
 */
export function SearchPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const tab = (params.get("tab") as SearchTab | "ai" | null) ?? "all";
  const page = Number(params.get("page") ?? 1);

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    navigate(`/search?${next.toString()}`);
  };

  // AI Mode is its own route
  const activeTab: SearchTab | "ai" = tab === "ai" ? "ai" : (tab as SearchTab);

  const { data, loading, error } = useSearch(
    q,
    activeTab === "ai" ? "all" : activeTab,
    page,
  );

  if (activeTab === "ai") {
    return <Navigate to={`/ai?q=${encodeURIComponent(q)}`} replace />;
  }

  const searchTab = activeTab as SearchTab;

  return (
    <div className="min-h-screen bg-gbg text-gtext pb-24 md:pb-10">
      <TopBar
        query={q}
        onSearch={(nq) => set({ q: nq, tab: "all", page: "1" })}
        onHome={() => navigate("/")}
        notify={toast}
      />
      {/* Mobile search header */}
      <div className="md:hidden px-4 pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("mq");
            if (typeof v === "string" && v.trim()) set({ q: v.trim(), page: "1" });
          }}
          className="flex items-center gap-2 bg-gcard rounded-full px-4 py-2.5"
        >
          <span className="text-gsub">🔍</span>
          <input
            name="mq"
            defaultValue={q}
            className="flex-1 bg-transparent outline-none text-gtext"
            aria-label="Search"
          />
        </form>
      </div>

      <TabBar
        active={searchTab}
        onChange={(t) => {
          if (t === "ai") navigate(`/ai?q=${encodeURIComponent(q)}`);
          else set({ tab: t, page: "1" });
        }}
      />
      <SearchTools onFilterTime={() => set({ page: "1" })} />
      <SuggestionChips query={q} onSelect={(nq) => set({ q: nq, page: "1" })} />

      <main className="px-4 md:px-8 max-w-6xl">
        {loading && <p className="py-10 text-gsub">Khoj rahe hain…</p>}
        {error && <p className="py-10 text-red-400">Error: {error}</p>}
        {data && (
          <div className="md:flex md:gap-6">
            <div className="flex-1 min-w-0">
              {searchTab === "images" && data.results.length > 0 && (
                <ImageGrid
                  items={data.results.map((r) => ({
                    title: r.title,
                    url: r.url,
                    image: r.thumbnail ?? "",
                    source: r.source,
                  }))}
                />
              )}
              {searchTab === "videos" &&
                data.results.map((r, i) => (
                  <VideoCard
                    key={`${r.url}-${i}`}
                    v={{
                      title: r.title,
                      url: r.url,
                      thumbnail: r.thumbnail,
                      source: r.source,
                      time: r.time,
                    }}
                  />
                ))}
              {searchTab === "news" &&
                data.results.map((r, i) => <NewsCard key={`${r.url}-${i}`} r={r} />)}
              {searchTab === "forums" &&
                data.results.map((r, i) => (
                  <ForumCard
                    key={`${r.url}-${i}`}
                    r={r}
                    onMoreFrom={(d) => set({ q: `${q} site:${d}`, page: "1" })}
                  />
                ))}
              {(searchTab === "all" || searchTab === "web") &&
                data.results.map((r, i) => (
                  <ResultCard key={`${r.url}-${i}`} r={r} />
                ))}
              {["shopping", "books", "maps", "flights", "shortvideos"].includes(
                searchTab,
              ) && (
                <p className="py-10 text-gsub text-center">
                  {searchTab} results jald aa rahe hain.
                </p>
              )}

              {data.paa && data.paa.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg text-gtext mb-2">People also ask</h3>
                  {data.paa.map((p) => (
                    <button
                      key={p}
                      onClick={() => set({ q: p, page: "1" })}
                      className="block w-full text-left border-b border-gsub/20 py-3 text-gtext"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <Pagination
                page={page}
                hasMore={data.results.length > 0}
                onPage={(p) => set({ page: String(p) })}
              />
            </div>
            {data.entity && (
              <div className="mt-6 md:mt-0">
                <KnowledgePanel entity={data.entity} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
