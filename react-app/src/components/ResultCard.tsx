import type { WebResult } from "../api/types";
import { useState } from "react";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Google-style web result: source row, blue title, snippet.
 * Visited links turn purple (Google behaviour).
 */
export function ResultCard({ r }: { r: WebResult }) {
  const [visited, setVisited] = useState(false);
  const host = r.source ?? hostOf(r.url);

  return (
    <article className="py-4">
      <div className="flex items-center gap-2 text-sm text-gtext">
        {r.thumbnail && (
          <img
            src={r.thumbnail}
            alt=""
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}
        <span>{host}</span>
        {r.time && <span className="text-gsub">· {r.time}</span>}
      </div>
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setVisited(true)}
        className={`block text-xl mt-1 hover:underline ${
          visited ? "text-gvisited" : "text-glink"
        }`}
      >
        {r.title}
      </a>
      {r.snippet && <p className="text-sm text-gsub mt-1">{r.snippet}</p>}
    </article>
  );
}
