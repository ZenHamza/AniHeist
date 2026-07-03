# AniHeist v1.2

Frontend for aniheist.com — a modern anime streaming platform built with Next.js 16.

## Changes from Original AniHeist (v1.0)

After analyzing the [Miruro](https://github.com/Miruro-no-kuon/Miruro) codebase, the following design and UX improvements were implemented in v1.2:

### Design Improvements

1. **Episode List Layout Toggle** — `episode-list.tsx`
   - Three display modes: Grid (compact numbers), List (numbered episodes with titles), Thumbnail (16:9 cards with play overlays)
   - Persists preference per anime via localStorage
   - Interval navigation dropdown for anime with 100+ episodes (inspired by Miruro's interval selector)

2. **Advanced Search Page** — `search/page.tsx`
   - URL-driven filter state — all filters (genres, year, season, format, status, sort) stored in query params for shareable/bookmarkable URLs
   - Genre pill toggle buttons (18 genres) instead of plain links
   - Dropdown filters: year (1940–current+1), season, format, status, sort
   - Smart API routing: basic text search → `/api/cached/search`; filtered search → `/api/cached/discover`
   - Discover API enhanced with `genres` array parameter support

3. **Keyboard Shortcuts** — `keyboard-shortcuts.tsx`
   - Shift+/ triggers a modal overlay displaying all available keyboard shortcuts
   - 14 shortcuts documented: play/pause, fullscreen, seek, episode navigation, search, etc.
   - Integrated globally via `(main)/layout.tsx`

4. **Improved Loading Skeletons** — `loading-spinner.tsx`
   - Added `CardSkeleton` — grid of card placeholders with title/subtitle shimmer lines
   - Added `SlideSkeleton` — full-width hero slide skeleton
   - Added `PlayerSkeleton` — video player skeleton with centered play icon
   - Added `EpisodeListSkeleton` — episode grid number placeholders

5. **Hero Carousel Integration** — `page.tsx`
   - Trending anime carousel at top of homepage using existing `HeroCarousel` component
   - Autoplay with dot navigation, genre tags, score badges, and CTA buttons
   - Search bar + genre tags positioned below carousel

6. **Continue Watching Section** — `page.tsx`
   - Horizontal scrollable card row with progress bars, episode number badges, percentage labels
   - Uses Zustand `useWatchHistory` store with localStorage persistence
   - Fallback image for entries without `animeImage`

7. **Command Palette** — `command-palette.tsx`
   - ⌘K / Ctrl+K triggered full-screen search overlay
   - Keyboard-navigable results (↑↓⏎)
   - Live search with 10-result limit
   - "Full search" prompt at bottom

### Bug Fixes (carried forward from v1.0)

- Search page shows cover images in card grid instead of list with ID text
- JSON parse errors handled with `res.ok` + `res.text()` + `JSON.parse` pattern
- Watch page server switching shows proper loading/error states
- Anime detail page handles transient API failures without showing "not found"
- `SearchResult` type matches actual API response structure

### Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Data Fetching | TanStack Query v5 |
| State | Zustand + immer + persist (localStorage) |
| Video | hls.js + native `<video>` + iframe embed |
| Carousel | Embla Carousel + Autoplay |
| Icons | react-icons (FontAwesome) |

### API Endpoints

All API calls proxy through Next.js API routes:
- `/api/cached/search` — Search anime by title
- `/api/cached/discover` — Filtered anime discovery (genres, year, season, format, status, sort)
- `/api/cached/anime/[id]` — Anime metadata from AniList
- `/api/cached/anime/[id]/episodes` — Episode list
- `/api/cached/trending` — Trending anime for hero carousel
- `/api/cached/newest` / `popular` / `top-rated` / `recent` — Homepage sections
- `/api/proxy/[...path]` — Backend API proxy

### Deployment

Docker container `aniheist-frontend:latest` deployed via `docker compose -f /opt/anime-scraper/docker-compose.yml up -d --build frontend`

### Credits

- Design inspiration from [Miruro](https://github.com/Miruro-no-kuon/Miruro)
- Developed by [ZenxHamza](https://zenxhamza.xyz)
