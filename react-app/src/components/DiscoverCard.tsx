import { useState } from "react";
import type { DiscoverStory } from "../api/types";
import { timeAgo } from "../api/client";

interface Props {
  story: DiscoverStory;
  onHide: (id: string) => void;
  onToggleLike: (id: string) => void;
  notify: (msg: string) => void;
}

/**
 * Google-Discover-style card: 16:9 image, source chip on image
 * (bottom-right dark glassy), 2-line snippet + "See more" expand,
 * sparkle + like/share/⋮ actions, source • relative time meta.
 */
export function DiscoverCard({ story, onHide, onToggleLike, notify }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const share = async () => {
    const data = { title: story.title, url: story.url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(story.url).catch(() => {});
    notify("Link copy ho gaya");
  };

  return (
    <article className="bg-gcard rounded-2xl overflow-hidden">
      {story.image && (
        <div className="relative">
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            <img
              src={story.image}
              alt=""
              className="w-full aspect-video object-cover"
              loading="lazy"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </a>
          <span className="absolute bottom-2 right-2 text-xs bg-black/60 backdrop-blur px-2 py-1 rounded-full text-white">
            🔗 {story.source}
          </span>
        </div>
      )}
      <div className="p-4">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-gtext leading-snug hover:underline"
        >
          {story.title}
        </a>
        {story.snippet && (
          <p className={`text-sm text-gsub mt-2 ${expanded ? "" : "line-clamp-2"}`}>
            {story.snippet}
          </p>
        )}
        {story.snippet && story.snippet.length > 120 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-glink text-sm mt-1"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
        <div className="text-xs text-gsub mt-2">
          {story.source} · {timeAgo(story.time)}
        </div>
        <div className="flex items-center gap-4 mt-3 text-gsub">
          <span title="AI summary">✦</span>
          <button
            onClick={() => onToggleLike(story.id)}
            aria-label="Like"
            className={story.liked ? "text-red-400" : ""}
          >
            {story.liked ? "♥" : "♡"}
          </button>
          <button onClick={share} aria-label="Share">
            ↗
          </button>
          <div className="relative ml-auto">
            <button onClick={() => setMenuOpen((o) => !o)} aria-label="More options">
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-8 bg-gbg border border-gsub/30 rounded-lg py-1 text-sm whitespace-nowrap z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gcard"
                  onClick={() => {
                    onHide(story.id);
                    setMenuOpen(false);
                  }}
                >
                  Not interested
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gcard"
                  onClick={() => {
                    void share();
                    setMenuOpen(false);
                  }}
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
