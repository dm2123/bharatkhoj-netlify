interface Props {
  active: "home" | "search" | "discover";
  onNavigate: (to: "home" | "search" | "discover") => void;
}

/**
 * Mobile-only bottom nav (≤768px), Google-app style:
 * Home | Search | Discover. Hidden on desktop via md:hidden.
 */
export function BottomNav({ active, onNavigate }: Props) {
  const items = [
    { key: "home", label: "Home", icon: "⌂" },
    { key: "search", label: "Search", icon: "🔍" },
    { key: "discover", label: "Discover", icon: "📰" },
  ] as const;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gbg border-t border-gsub/20 flex justify-around py-2"
      aria-label="Bottom navigation"
    >
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onNavigate(it.key)}
          className={`flex flex-col items-center text-xs px-6 py-1 rounded-full ${
            active === it.key ? "text-glink bg-gcard" : "text-gsub"
          }`}
        >
          <span className="text-xl">{it.icon}</span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
