import { SearchBar } from "./SearchBar";

interface Props {
  query: string;
  onSearch: (q: string) => void;
  onHome: () => void;
  notify: (msg: string) => void;
}

/**
 * Desktop topbar: logo left, search center, icons right. Sticky.
 * Settings/apps show an honest toast ("jald aa rahe hain") — no fake
 * functionality, mirrors the current site.
 */
export function TopBar({ query, onSearch, onHome, notify }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-gbg/95 backdrop-blur border-b border-gsub/20">
      <div className="hidden md:flex items-center gap-6 px-6 py-3">
        <button
          onClick={onHome}
          className="text-2xl font-bold text-gtext shrink-0"
          aria-label="BharatKhoj home"
        >
          <span className="text-glink">B</span>haratKhoj
        </button>
        <SearchBar initial={query} onSearch={onSearch} compact />
        <div className="flex items-center gap-4 ml-auto text-xl">
          <button
            onClick={() => notify("Settings jald aa rahe hain")}
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </button>
          <button
            onClick={() => notify("Apps jald aa rahe hain")}
            aria-label="Apps"
            title="Apps"
          >
            ▦
          </button>
          <button
            onClick={() => notify("Sign-in jald aa raha hai")}
            aria-label="Profile"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-glink to-purple-500 flex items-center justify-center text-sm font-bold text-white"
          >
            ब
          </button>
        </div>
      </div>
    </header>
  );
}
