# BharatKhoj React + TypeScript rebuild

> Scaffold (Oct 2026). `public/index.html` (plain HTML/CSS/JS) abhi bhi live
> site hai — ye `react-app/` uska React + TypeScript + Tailwind successor hai.
> Full migration baad me hogi; abhi structure + plan ready hai.

## Stack

| Layer   | Choice |
|---------|--------|
| UI      | React 18 + TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 (Google dark palette as `g*` tokens) |
| Routing | react-router-dom 6 (HashRouter — Netlify-friendly, no server config) |
| Build   | Vite 5 |

`tailwind.config.js` me Google dark-mode colors `gbg/gcard/gtext/gsub/glink/gvisited`
ke naam se hain — current site se same hex values.

## Structure

```
react-app/
  src/
    api/
      types.ts    # Search/AI/Images/Videos/Discover/Widgets response types
      client.ts   # /.netlify/functions/* proxy client + timeAgo()
    hooks/
      useSearch.ts       # /search?q=&tab=&page=
      useDiscover.ts     # infinite scroll (12/page, like/hide)
      useAI.ts           # AI Mode ask + follow-ups with context
      useWidgets.ts      # homepage widgets (best-effort, hide on fail)
      useVoiceSearch.ts  # Web Speech API, hi-IN
    components/
      SearchBar.tsx      # mic (Hindi voice) + lens (→ Images tab)
      TabBar.tsx         # AI Mode, All, Images, News, Videos, Shopping,
                         # Forums, Short videos, Web, Books, Maps, Flights
      TopBar.tsx         # desktop: logo left, search center, icons right
      BottomNav.tsx      # mobile-only (md:hidden): Home/Search/Discover
      ResultCard.tsx     # visited → purple (Google behaviour)
      DiscoverCard.tsx   # source chip on image, See more, like/share/⋮
      ImageGrid.tsx      # hover overlay title+domain
      VideoCard.tsx      # duration badge, channel • views • time
      NewsCard.tsx       # source logo + name, blue title, thumbnail right
      ForumCard.tsx      # Reddit-style + "More results from {domain}"
      KnowledgePanel.tsx # desktop right rail 360px, sub-tabs, share
      AIOverview.tsx     # sources UNDER answer (Google AI Mode parity)
      SuggestionChips.tsx / SearchTools.tsx / Pagination.tsx
      HomeWidgets.tsx    # weather/gold/markets/cricket — hide on no data
      Toast.tsx          # honest toasts, no fake functionality
    pages/
      HomePage.tsx       # logo, search, trending, widgets, discover link
      SearchPage.tsx     # tab switcher + PAA + pagination + entity panel
      AIPage.tsx         # full-page AI Mode + follow-up bar
      DiscoverPage.tsx   # infinite feed (IntersectionObserver)
    App.tsx              # HashRouter + BottomNav + Toast
```

## API contract

Client `/.netlify/functions/*` proxy use karta hai (current site jaisa) —
backend change ki zaroorat nahi:

- `GET /search?q=&tab=&page=` → web/images/news/videos/forums (+entity/paa/related on `all`)
- `GET /ai?q=` → `{mode, engine, answer, sources, grounded, note}`
- `GET /discover?page=` → 12 stories/page
- `GET /widgets` → weather/gold/markets/trending/cricket/discoverCount

> ⚠️ `src/api/types.ts` ke field names current `index.html` ke fetch handlers
> aur backend code se liye gaye hain — full migration se pehle live backend
> response se verify karna hai.

## Migration plan (phase-wise)

1. **Verify** — `npm install && npm run build` yahan chalakar type errors zero karo;
   API shapes live backend se match karo.
2. **Parity pass** — har page ko current site se side-by-side compare karo
   (Discover cards, topbar, tabs, images hover, video badges, KP rail).
3. **Cutover** — `vite build` ka `dist/` Netlify par publish karo
   (ya `netlify.toml` me publish dir badlo); `public/_redirects` SPA fallback
   deta hai. `public/index.html` ko tab tak mat hatao jab tak React build
   100% parity verified na ho.
4. **Cleanup** — parity ke baad purana `index.html` archive karo.

## Rules (project standing orders)

- Koi fake data nahi — API se jo aaye wahi render; missing sections hide.
- Family fields kabhi nahi.
- Adult content sirf 18+ gate ke baad (is scaffold me shamil nahi).
- Dusre search engines ke links/results nahi.
