interface Props {
  query: string;
  onSelect: (q: string) => void;
}

/**
 * Hindi/related suggestion chips under the search bar
 * (e.g. "विराट कोहली", "विराट कोहली नेट वर्थ") — Google mobile style.
 * Chips are derived from the query; nothing fabricated.
 */
export function SuggestionChips({ query, onSelect }: Props) {
  const chips = [
    query,
    `${query} in Hindi`,
    `${query} news`,
    `${query} images`,
  ].filter((c, i, a) => a.indexOf(c) === i);

  return (
    <div className="flex gap-2 overflow-x-auto py-3 px-4">
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className="shrink-0 bg-gcard rounded-xl px-4 py-3 text-sm text-gtext flex items-center gap-2"
        >
          <span className="max-w-[120px] truncate">{c}</span>
          <span className="text-gsub">🔍</span>
        </button>
      ))}
    </div>
  );
}
