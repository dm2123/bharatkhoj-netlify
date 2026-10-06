// Typed client for the BharatKhoj backend.
//
// The current site (public/index.html) talks to Netlify functions
// (/.netlify/functions/*) which proxy the FastAPI backend. This client
// keeps the same indirection so the React app works with zero backend
// changes. If the app is ever served somewhere without the functions,
// point API_BASE at the backend directly
// (https://bharatkhoj-backend.onrender.com/api).

import type {
  AIResponse,
  DiscoverStory,
  ImageItem,
  SearchResponse,
  SearchTab,
  VideoItem,
  Widgets,
} from "./types";

const API_BASE = "/.netlify/functions";

async function get<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  );
  const res = await fetch(`${API_BASE}${path}?${qs.toString()}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  /** Web/entity search. tab mirrors the TabBar values. */
  search: (q: string, tab: SearchTab = "all", page = 1) =>
    get<SearchResponse>("/search", { q, tab, page }),

  /** AI Mode answer (NVIDIA openai_compatible first, then fallbacks). */
  ai: (q: string, ctx?: string) =>
    get<AIResponse>("/ai", ctx ? { q: q + ctx } : { q }),

  /** Image search with pagination. */
  images: (q: string, page = 1) =>
    get<{ results: ImageItem[]; page: number }>("/search", { q, tab: "images", page }),

  /** Video search with pagination. */
  videos: (q: string, page = 1) =>
    get<{ results: VideoItem[]; page: number }>("/search", { q, tab: "videos", page }),

  /** Discover feed, 12 stories per page, infinite scroll. */
  discover: (page = 1) =>
    get<{ stories: DiscoverStory[]; page: number }>("/discover", { page }),

  /** Homepage widgets (weather, gold, markets, trending, cricket). */
  widgets: () => get<Widgets>("/widgets", {}),
};

/** Relative time helper (matches timeAgo() in the current site). */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}
