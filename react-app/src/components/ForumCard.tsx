import type { WebResult } from "../api/types";

/**
 * Forums tab card (Reddit/Facebook style): favicon + source + time,
 * blue title, snippet, thumbnail right, "More results from {domain}".
 */
export function ForumCard({
  r,
  onMoreFrom,
}: {
  r: WebResult;
  onMoreFrom?: (domain: string) => void;
}) {
  const domain = (() => {
    try {
      return new URL(r.url).hostname.replace(/^www\./, "");
    } catch {
      return r.source ?? "";
    }
  })();

  return (
    <article className="py-4 border-b border-gsub/10">
      <div className="flex items-center gap-2 text-sm text-gtext">
        <span className="text-gsub">💬</span>
        <span>
          {r.source ?? domain}
          {r.time ? ` · ${r.time}` : ""}
        </span>
      </div>
      <div className="flex gap-3 mt-1">
        <div className="flex-1 min-w-0">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-glink text-xl hover:underline line-clamp-2"
          >
            {r.title}
          </a>
          {r.snippet && (
            <p className="text-sm text-gsub mt-1 line-clamp-3">{r.snippet}</p>
          )}
        </div>
        {r.thumbnail && (
          <img
            src={r.thumbnail}
            alt=""
            loading="lazy"
            className="w-24 h-24 rounded-xl object-cover shrink-0"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}
      </div>
      {onMoreFrom && domain && (
        <button
          onClick={() => onMoreFrom(domain)}
          className="mt-3 w-full bg-gcard rounded-full py-3 text-sm text-gtext hover:bg-gsub/20"
        >
          More results from {domain} ›
        </button>
      )}
    </article>
  );
}
