import { useState } from "react";
import { useVoiceSearch } from "../hooks/useVoiceSearch";

interface Props {
  initial?: string;
  onSearch: (q: string) => void;
  /** compact=true renders the topbar variant (smaller, no lucky button) */
  compact?: boolean;
}

/**
 * Google-style search bar: rounded, mic (Hindi voice) + lens icons.
 * Lens opens the Images tab — real behaviour, mirrors current site.
 */
export function SearchBar({ initial = "", onSearch, compact = false }: Props) {
  const [value, setValue] = useState(initial);
  const { supported, listening, toggle } = useVoiceSearch((text) => {
    setValue(text);
    onSearch(text);
  });

  const submit = () => {
    const q = value.trim();
    if (q) onSearch(q);
  };

  return (
    <div className={compact ? "w-full max-w-2xl" : "w-full max-w-xl mx-auto"}>
      <div
        className={`flex items-center gap-2 bg-gcard border border-transparent hover:border-gsub/40 focus-within:border-gsub/40 rounded-full px-4 ${
          compact ? "py-2" : "py-3"
        }`}
      >
        <span className="text-gsub select-none">🔍</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="BharatKhoj par khojo"
          className="flex-1 bg-transparent outline-none text-gtext placeholder-gsub"
          aria-label="Search BharatKhoj"
        />
        {supported && (
          <button
            onClick={toggle}
            aria-label="Voice search"
            title="Voice search (Hindi)"
            className={`text-xl ${listening ? "animate-pulse" : ""}`}
          >
            🎤
          </button>
        )}
        <button
          onClick={() => {
            const q = value.trim();
            if (q) onSearch(`__images__:${q}`);
          }}
          aria-label="Search by image"
          title="Images me khojo"
          className="text-xl"
        >
          📷
        </button>
      </div>
      {!compact && (
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={submit}
            className="px-5 py-2 rounded bg-gcard text-gtext text-sm hover:border hover:border-gsub/40"
          >
            BharatKhoj Search
          </button>
        </div>
      )}
    </div>
  );
}
