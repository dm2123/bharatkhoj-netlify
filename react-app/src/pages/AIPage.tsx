import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAI } from "../hooks/useAI";
import { AIOverview } from "../components/AIOverview";
import { TopBar } from "../components/TopBar";
import { TabBar } from "../components/TabBar";
import { toast } from "../components/Toast";

/**
 * /ai?q= — full-page AI Mode (Google parity: answer center-left,
 * sources UNDER the answer, no web results / knowledge panel here).
 * Follow-up questions keep context (askFollowUp behaviour).
 */
export function AIPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const { answer, loading, error, history, ask, reset } = useAI();
  const askedFor = useRef<string | null>(null);

  useEffect(() => {
    // Guard against StrictMode double-effect firing ask() twice.
    if (q && askedFor.current !== q) {
      askedFor.current = q;
      reset();
      void ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="min-h-screen bg-gbg text-gtext pb-24 md:pb-10">
      <TopBar
        query={q}
        onSearch={(nq) => navigate(`/search?q=${encodeURIComponent(nq)}&tab=all`)}
        onHome={() => navigate("/")}
        notify={toast}
      />
      <TabBar
        active="ai"
        onChange={(t) =>
          navigate(
            t === "ai"
              ? `/ai?q=${encodeURIComponent(q)}`
              : `/search?q=${encodeURIComponent(q)}&tab=${t}`,
          )
        }
      />
      <main className="px-4 md:px-8 max-w-4xl pt-6">
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <span className="bg-gcard rounded-full px-4 py-2 text-sm">{q}</span>
          </div>
        )}
        {loading && <p className="py-6 text-gsub">AI soch raha hai…</p>}
        {error && <p className="py-6 text-red-400">Error: {error}</p>}
        {answer && <AIOverview data={answer} />}

        {/* Follow-up bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("fq");
            if (typeof v === "string" && v.trim()) {
              void ask(v.trim());
              (e.target as HTMLFormElement).reset();
            }
          }}
          className="mt-8 flex items-center gap-2 bg-gcard rounded-full px-4 py-3"
        >
          <input
            name="fq"
            placeholder="Ask a follow-up"
            className="flex-1 bg-transparent outline-none text-gtext placeholder-gsub"
            aria-label="Ask a follow-up"
          />
          <button type="submit" aria-label="Send" className="text-glink text-xl">
            ➤
          </button>
        </form>
      </main>
    </div>
  );
}
