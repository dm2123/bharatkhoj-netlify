// BharatKhoj backend response types.
// Shapes mirror the current public/index.html fetch handlers and the
// FastAPI backend (/api/search, /api/ai, /api/images, /api/videos,
// /api/discover, /api/widgets). Verify field names against a live
// backend response before the full migration (see README.md).

export type SearchTab =
  | "all"
  | "images"
  | "news"
  | "videos"
  | "shopping"
  | "forums"
  | "shortvideos"
  | "web"
  | "books"
  | "maps"
  | "flights";

export interface WebResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  thumbnail?: string | null;
  time?: string | null;
}

export interface SearchResponse {
  query: string;
  tab: SearchTab;
  page: number;
  total?: number;
  results: WebResult[];
  // Knowledge panel (entity) — present for entity queries on "all" tab
  entity?: EntityPanel | null;
  // People-also-ask
  paa?: string[];
  // Related entity grid
  related?: { name: string; image?: string | null }[];
}

export interface EntityPanel {
  name: string;
  image?: string | null;
  images_locked?: boolean;
  headline?: string;
  description?: string;
  facts?: { label: string; value: string }[];
  tabs?: { overview?: string; stats?: string; videos?: string; news?: string };
}

export type AIMode = "grounded" | "ai_general" | "no_results";

export interface AIResponse {
  mode: AIMode;
  engine?: string; // e.g. "openai_compatible" (NVIDIA) or pollinations fallback
  answer: string; // markdown-ish text
  sources?: { title: string; url: string }[];
  grounded: boolean;
  note?: string; // honest "general knowledge" disclaimer for ai_general
}

export interface ImageItem {
  title: string;
  url: string; // page url
  image: string; // direct image url
  source?: string;
}

export interface VideoItem {
  title: string;
  url: string;
  thumbnail?: string | null;
  source?: string;
  channel?: string;
  duration?: string | null;
  views?: string | null;
  time?: string | null;
}

export interface DiscoverStory {
  id: string;
  title: string;
  url: string;
  source: string;
  image?: string | null;
  snippet?: string;
  time?: string | null;
  liked?: boolean;
}

export interface Widgets {
  weather?: { temp: string; condition: string; city?: string } | null;
  gold?: { price: string; change?: string } | null;
  markets?: { nifty?: string; sensex?: string } | null;
  trending?: string[];
  cricket?: { headline: string; url?: string }[];
  discoverCount?: number;
}
