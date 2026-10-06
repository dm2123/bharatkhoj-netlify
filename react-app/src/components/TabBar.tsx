import type { SearchTab } from "../api/types";

interface Props {
  active: SearchTab | "ai";
  onChange: (tab: SearchTab | "ai") => void;
}

const TABS: { key: SearchTab | "ai"; label: string }[] = [
  { key: "ai", label: "AI Mode" },
  { key: "all", label: "All" },
  { key: "images", label: "Images" },
  { key: "news", label: "News" },
  { key: "videos", label: "Videos" },
  { key: "shopping", label: "Shopping" },
  { key: "forums", label: "Forums" },
  { key: "shortvideos", label: "Short videos" },
  { key: "web", label: "Web" },
  { key: "books", label: "Books" },
  { key: "maps", label: "Maps" },
  { key: "flights", label: "Flights" },
];

/**
 * Search tabs — Google order. Desktop shows icon+text, mobile text-only
 * horizontal scroll (mirrors current site).
 */
export function TabBar({ active, onChange }: Props) {
  return (
    <nav
      className="flex gap-5 overflow-x-auto border-b border-gsub/20 px-4 text-sm whitespace-nowrap"
      aria-label="Search tabs"
    >
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`py-3 border-b-2 -mb-px ${
            active === t.key
              ? "border-glink text-glink"
              : "border-transparent text-gsub hover:text-gtext"
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
