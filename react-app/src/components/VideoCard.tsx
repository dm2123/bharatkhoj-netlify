import type { VideoItem } from "../api/types";

/**
 * Google Videos row: thumbnail left with duration badge, title,
 * source • channel • views • time meta, ⋮ menu.
 */
export function VideoCard({ v }: { v: VideoItem }) {
  const meta = [v.source, v.channel, v.views, v.time].filter(Boolean).join(" • ");
  return (
    <article className="flex gap-3 py-3">
      <a
        href={v.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative shrink-0 w-40 md:w-56"
      >
        {v.thumbnail ? (
          <img
            src={v.thumbnail}
            alt=""
            loading="lazy"
            className="w-full aspect-video object-cover rounded-xl"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        ) : (
          <div className="w-full aspect-video bg-gcard rounded-xl" />
        )}
        {v.duration && (
          <span className="absolute bottom-1 right-1 text-[11px] bg-black/70 text-white px-1.5 py-0.5 rounded">
            {v.duration}
          </span>
        )}
      </a>
      <div className="min-w-0">
        <a
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gtext font-medium leading-snug hover:underline line-clamp-2"
        >
          {v.title}
        </a>
        {meta && <p className="text-xs text-gsub mt-1">{meta}</p>}
      </div>
      <button
        className="ml-auto self-start text-gsub"
        aria-label="More options"
        onClick={() => {}}
      >
        ⋮
      </button>
    </article>
  );
}
