import type { WebResult } from "../api/types";

/**
 * Google News card: source logo + name, blue title, relative time,
 * thumbnail right. Matches the news-tab layout in the current site.
 */
export function NewsCard({ r }: { r: WebResult }) {
  return (
    <article className="flex gap-3 py-4 border-b border-gsub/10">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm text-gtext">
          {r.thumbnail && (
            <img
              src={r.thumbnail}
              alt=""
              className="w-5 h-5 rounded object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
          <span>{r.source}</span>
        </div>
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-glink text-lg mt-1 hover:underline line-clamp-3"
        >
          {r.title}
        </a>
        {r.time && <p className="text-xs text-gsub mt-1">{r.time}</p>}
      </div>
    </article>
  );
}
