interface Props {
  page: number;
  hasMore: boolean;
  onPage: (p: number) => void;
}

/** Google-style numbered pagination (mirrors goPage/pgHTML). */
export function Pagination({ page, hasMore, onPage }: Props) {
  const pages = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <nav className="flex gap-3 justify-center py-8 text-glink" aria-label="Pagination">
      {page > 1 && (
        <button onClick={() => onPage(page - 1)} className="px-2">
          ‹ Prev
        </button>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-8 h-8 rounded-full ${
            p === page ? "bg-glink text-white" : "hover:underline"
          }`}
        >
          {p}
        </button>
      ))}
      {hasMore && (
        <button onClick={() => onPage(page + 1)} className="px-2">
          Next ›
        </button>
      )}
    </nav>
  );
}
