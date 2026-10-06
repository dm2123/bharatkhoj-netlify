import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { HomeWidgets } from "../components/HomeWidgets";
import { useWidgets } from "../hooks/useWidgets";
import { toast } from "../components/Toast";

/** Google-style homepage: logo, search, trending, live widgets. */
export function HomePage() {
  const navigate = useNavigate();
  const widgets = useWidgets();

  const go = (q: string) =>
    navigate(`/search?q=${encodeURIComponent(q)}&tab=all`);

  return (
    <div className="min-h-screen bg-gbg text-gtext flex flex-col items-center pt-24 md:pt-32 px-4 pb-24 md:pb-10">
      {/* Mobile app header (Google-app style) */}
      <div className="md:hidden w-full flex items-center justify-center mb-6 relative">
        <h1 className="text-3xl font-bold">
          <span className="text-glink">B</span>haratKhoj
        </h1>
        <button
          onClick={() => toast("Sign-in jald aa raha hai")}
          aria-label="Profile"
          className="absolute right-0 w-9 h-9 rounded-full bg-gradient-to-br from-glink to-purple-500 flex items-center justify-center font-bold text-white"
        >
          ब
        </button>
      </div>
      {/* Desktop logo */}
      <h1 className="hidden md:block text-6xl font-bold mb-8">
        <span className="text-glink">B</span>haratKhoj
      </h1>

      <SearchBar onSearch={go} />

      {widgets?.trending && widgets.trending.length > 0 && (
        <div className="mt-8 w-full max-w-xl">
          <p className="text-sm text-gsub mb-2">Trending searches</p>
          <div className="flex flex-wrap gap-2">
            {widgets.trending.slice(0, 8).map((t) => (
              <button
                key={t}
                onClick={() => go(t)}
                className="text-sm bg-gcard rounded-full px-4 py-2 hover:border hover:border-gsub/40"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <HomeWidgets w={widgets} />

      {widgets?.discoverCount != null && widgets.discoverCount > 0 && (
        <button
          onClick={() => navigate("/discover")}
          className="mt-6 text-sm text-glink hover:underline"
        >
          Discover me {widgets.discoverCount} nayi khabrein →
        </button>
      )}
    </div>
  );
}
