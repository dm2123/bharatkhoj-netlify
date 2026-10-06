import type { ImageItem } from "../api/types";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Google Images grid: 2-col mobile, denser desktop; hover overlay with
 * title + domain on gradient (mirrors current site).
 */
export function ImageGrid({ items }: { items: ImageItem[] }) {
  if (!items.length) {
    return <p className="text-gsub py-8 text-center">Koi images nahi mili.</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
      {items.map((it, i) => (
        <a
          key={`${it.image}-${i}`}
          href={it.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative rounded-xl overflow-hidden bg-gcard"
        >
          <img
            src={it.image}
            alt={it.title}
            loading="lazy"
            className="w-full aspect-square object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs truncate">{it.title}</p>
            <p className="text-white/70 text-[11px]">{it.source ?? hostOf(it.url)}</p>
          </div>
          <div className="p-2 md:hidden">
            <p className="text-xs text-gtext truncate">{it.title}</p>
            <p className="text-[11px] text-gsub">{it.source ?? hostOf(it.url)}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
