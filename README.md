# LLM Parameter Visualizer (SSR Next.js)

Server-rendered Next.js 14 dashboard to explore how Temperature and Top‑P affect LLM outputs. Features Redux Toolkit state, model rotation, dark mode, animations, custom SVG charts, and a circle‑based heatmap. Backend calls are proxied through Next API routes; no direct model SDKs in the frontend.

## Features

- Next.js 14 App Router with SSR and Metadata API for SEO
- Tailwind CSS dark mode (class‑based) and subtle reveal animations
- Redux Toolkit store (settings, results, models, analytics)
- Baseline vs Custom parameter sets; global clamping of temperature/top_p to [0,1]
- Analytics metrics (prefer normalized 0–100 when available):
  - Lexical Diversity (TTR)
  - Query Coverage
  - Readability (Flesch–Kincaid Grade)
  - Non‑Repetition
- Visualizations:
  - Multi‑series line charts (custom SVG) aggregated by Temperature and Top‑P
  - Scatter‑style circle heatmap over a 0.0–1.0 grid (size ∝ count)
  - Results table and lightweight carousel for responses
- Model rotation across available models (round‑robin)
- Dockerized with standalone Next output; logs for proxy target and backend errors

## Project structure

```
app/
  api/                 # Next API proxies to backend
    test-prompt/route.js
    analytics/route.js
  layout.jsx           # SEO metadata + theme bootstrap
  page.jsx             # Main dashboard
  providers.jsx        # Redux + theme providers
components/            # UI and chart components (SVG, Tailwind)
lib/
  api.js               # Client helpers to call Next API proxies
  utils.js             # Param set generation, color scales
  modelRotation.js     # Round‑robin model selection
store/
  slices/              # settings, results, models, analytics
  index.js             # store setup
```

## API contracts

- Test Prompt (batch): POST `/api/test-prompt` → proxies to `BACKEND_URL/test-prompt`
  - Request body:
    - `{ prompt: string, model: string, param_pairs: Array<{ temperature: number, top_p: number }> }`
  - Response: Array of results, each including the generated text per pair.

- Analytics: POST `/api/analytics` → proxies to `BACKEND_URL/analytics`
  - Request body: same as above (prompt, model, param_pairs)
  - Expected response (example shape):
    - `scatter_data: Array<{
         model: string,
         temperature: number,
         top_p: number,
         run_count: number,
         avg_lexical_diversity?: number,
         avg_query_coverage?: number,
         avg_fk_grade?: number,
         avg_repetition_penalty?: number,
         norm_lexical_diversity?: number,  // 0–100
         norm_query_coverage?: number,     // 0–100
         norm_fk_grade?: number,           // 0–100
         norm_repetition_penalty?: number  // 0–100
       }>`

The UI prefers `norm_*` fields for consistent scaling, with raw `avg_*` as fallback.

## Getting started (dev)

Prerequisites: Node 18+

1) Create `.env.local` for local dev:

```
BACKEND_URL=http://localhost:8000
```

2) Install and run:

```
npm install
npm run dev
```

3) Open http://localhost:3000

## Docker

1) Copy and edit environment file (used by docker-compose and runtime):

```
copy .env.example .env
```

For Windows/macOS with backend on the host, set:

```
BACKEND_URL=http://host.docker.internal:8000
```

2) Build and run:

```
docker compose build
docker compose up
```

The app runs at http://localhost:3000.

### Troubleshooting

- ECONNREFUSED in logs: ensure BACKEND_URL is reachable from inside the container (use `host.docker.internal` on Windows/macOS). Verify backend is running on port 8000.
- Google Fonts timeouts during build: avoided by not using `next/font/google`; system font stack is used.
- Analytics errors: the frontend sends POST to `/api/analytics`. If your backend expects POST with a JSON body, confirm it handles `prompt`, `model`, and `param_pairs`.

## UX and accessibility

- Dark mode toggle persists in `localStorage`; chart labels/axes adapt to dark mode
- Lightweight reveal animations respect `prefers-reduced-motion`
- Heatmap uses currentColor text for good contrast in both themes; legend indicates value scale and point size

## Notes on metrics and charts

- We aggregate analytics by temperature and by top‑p to draw trends
- Heatmap bins values onto a 0.1 grid; circle radius is proportional to how many runs fell into each bin
- Values are typically on 0–100 when `norm_*` is provided; raw averages are used if normalization is absent

## Development details

- State: Redux Toolkit slices for `settings`, `results`, `models`, `analytics`
- Proxies: Next API routes add basic logging and clamp incoming params where relevant
- Performance: Next standalone output in Docker; custom SVG charts render fast and work with SSR

## Environment variables

- `BACKEND_URL` (required): base URL of your backend (no trailing slash). Examples:
  - Dev: `http://localhost:8000`
  - Docker (Windows/macOS): `http://host.docker.internal:8000`


This app renders server content for SEO and progressively enhances with client‑side charts. All model interactions happen in your backend, accessed via the proxy endpoints described above.
