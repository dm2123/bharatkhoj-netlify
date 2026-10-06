import type { ReactNode } from "react";
import type { Widgets } from "../api/types";

/**
 * Homepage live widgets (weather, gold, NIFTY/SENSEX, cricket).
 * Each section hides when its data is missing — never fabricated.
 */
export function HomeWidgets({ w }: { w: Widgets | null }) {
  if (!w) return null;
  const cards: { title: string; body: ReactNode }[] = [];

  if (w.weather) {
    cards.push({
      title: "Weather",
      body: (
        <p className="text-2xl">
          {w.weather.temp} <span className="text-sm text-gsub">{w.weather.condition}</span>
        </p>
      ),
    });
  }
  if (w.gold) {
    cards.push({
      title: "Gold",
      body: (
        <p className="text-2xl">
          {w.gold.price}{" "}
          {w.gold.change && <span className="text-sm text-gsub">{w.gold.change}</span>}
        </p>
      ),
    });
  }
  if (w.markets) {
    cards.push({
      title: "Markets",
      body: (
        <div className="text-sm space-y-1">
          {w.markets.nifty && <p>NIFTY {w.markets.nifty}</p>}
          {w.markets.sensex && <p>SENSEX {w.markets.sensex}</p>}
        </div>
      ),
    });
  }
  if (w.cricket?.length) {
    cards.push({
      title: "Cricket",
      body: (
        <ul className="text-sm space-y-1">
          {w.cricket.slice(0, 3).map((c, i) => (
            <li key={i} className="truncate">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" className="text-glink hover:underline">
                  {c.headline}
                </a>
              ) : (
                c.headline
              )}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mx-auto mt-6 px-4">
      {cards.map((c) => (
        <div key={c.title} className="bg-gcard rounded-2xl p-4">
          <p className="text-xs text-gsub mb-2">{c.title}</p>
          {c.body}
        </div>
      ))}
    </div>
  );
}
