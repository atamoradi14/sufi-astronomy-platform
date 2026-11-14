# Sufi Astronomy Platform (صوفی‌آسمان)

Persian-first web app for **spherical trigonometry**, olympiad astronomy, and observational practice — inspired by **Abd al-Rahman al-Sufi** and *Ṣuwar al-Kawākib*.

Runs in the browser (including Android Chrome). Device **GPS** and **compass** are used where available; no APK install is required.

**Live demo:** [https://sufi-astronomy.apps.grok.bot](https://sufi-astronomy.apps.grok.bot)  
**Public GitHub:** [https://github.com/atamoradi14/sufi-astronomy-platform](https://github.com/atamoradi14/sufi-astronomy-platform)

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Repository layout](#repository-layout)
4. [Quick start (local)](#quick-start-local)
5. [Build](#build)
6. [Push / contribute](#push--contribute)
7. [Docker deploy](#docker-deploy)
8. [Kubernetes deploy](#kubernetes-deploy)
9. [Cursor / hosted publish](#cursor--hosted-publish)
10. [Architecture](#architecture)
11. [HTTP API reference](#http-api-reference)
12. [Pages & UX](#pages--ux)
13. [Data catalogs](#data-catalogs)
14. [Sensors & mobile](#sensors--mobile)
15. [Scripts](#scripts)
16. [Environment](#environment)
17. [License & credits](#license--credits)

---

## Features

| Area | What you get |
|------|----------------|
| **Interactive celestial sphere** (`/lab`) | Focused presets, surface point placement, camera reset, fullscreen, colour-matched sides, and geometry-derived measurements |
| **Smart proofs** (`/proofs`) | Formulae (A)(B)(C)(D), polar triangle, Napier, haversine, PZX, Delambre, Girard — reconstructed figures, live identities |
| **Spherical area** | Girard + L’Huilier (olympiad supplement; not a numbered Smart I section) |
| **Curriculum** (`/learn`) | Nine chapters of Smart *Textbook on Spherical Astronomy* Part 1 (pp. 1–222): rewritten bilingual chapters I–III, connected proofs, locally typeset equations, computed geometric figures, worked examples and original practice |
| **Problem bank** (`/problems`) | Sample olympiad/Smart problems; each solution opens a **3D sphere diagram** matched to the math (PZX, great/small circles, polar dual, etc.) |
| **Live sky** (`/sky`) | Rectangular gnomonic sky: **15 544 J2000 stars to mag ≤ 7**, constellation figures, manual/GPS location, UTC time controls, search, picking, keyboard navigation, and pinch zoom |
| **Sufi atlas** (`/atlas`) | All **48** Ptolemaic constellations with **real manuscript plates** (globe / sky / tables) from a six-part *Ṣuwar al-Kawākib* scan, plus Persian commentary |
| **Compass & Qibla** (`/compass`) | Device heading + great-circle Qibla bearing/distance |
| **Map** (`/map`) | Leaflet tracker with observer position |
| **Charts** (`/charts`) | Time / altitude style plots (Recharts) |
| **Microservice stubs** | Pure domain libs + Route Handlers today; `services/` + `deploy/k8s/` map the future split |

---

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · shadcn-style primitives (Button, Card, …)
- **Three.js** + **React Three Fiber** / **drei** — sphere lab, proofs, problem diagrams
- **Leaflet** / **react-leaflet** — maps
- **Recharts** — charts
- Fonts: locally bundled **Amiri** (display) + **Vazirmatn** (UI), RTL Persian shell; no build-time Google Fonts download
- Node **22** recommended (Docker base image matches)

---

## Repository layout

```text
├── src/
│   ├── app/                 # App Router pages + API route handlers
│   │   ├── api/             # BFF HTTP edges (see API section)
│   │   ├── lab|proofs|learn|problems|sky|…
│   │   └── architecture/    # In-app microservice map (Persian UI)
│   ├── components/          # UI: sphere, sky, problems, compass, map, …
│   ├── hooks/               # useGeolocation, useCompass
│   └── lib/
│       ├── astronomy/       # sphericalTrig, sphereGeom, time, constellations
│       ├── content/         # Smart Part 1 lessons (Ch. I–IX), proofs, problems
│       ├── geo/             # Qibla
│       └── sky/             # gnomonic projection / free-look
├── public/data/
│   ├── stars-mag7.json      # Packed HYG/Hipparcos-derived J2000 catalog (mag ≤ 7)
│   └── constellations-iau.json
├── services/                # Target microservice folders + Dockerfiles
├── deploy/k8s/              # Namespace, Deployments, Services, Ingress stubs
├── scripts/gen-courses.mjs  # Legacy JSON generator (unused at runtime)
├── Dockerfile               # Multi-stage standalone Next.js image
└── package.json
```

---

## Quick start (local)

**Requirements:** Node.js 20+ (22 preferred), npm 10+.

```bash
git clone https://github.com/atamoradi14/sufi-astronomy-platform.git
cd sufi-astronomy-platform
npm install
npm run dev
```

Open **http://127.0.0.1:3847**

Dev server uses Turbopack on port **3847**:

```json
"dev": "next dev --turbopack -p 3847"
```

---

## Build

Production build uses the **webpack** Next.js compiler (not Turbopack) for host compatibility:

```bash
npm run build
npm start
```

`next.config.ts` sets `output: "standalone"` so Docker/K8s can ship a minimal Node server.

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development (Turbopack, port 3847) |
| `npm run build` | Production build |
| `npm start` | Serve production build (`PORT` env respected; default Next port if unset) |
| `npm run lint` | ESLint |

Typecheck implicitly runs during `next build`.

---

## Push / contribute

### GitHub (public)

```bash
git clone https://github.com/atamoradi14/sufi-astronomy-platform.git
cd sufi-astronomy-platform
git checkout -b feature/your-change
# … edit …
git add -A
git commit -m "Describe the change clearly"
git push -u origin feature/your-change
```

Open a Pull Request into `main` on GitHub.

### Force-sync a full tree onto GitHub (maintainers)

If you maintain a mirror from another remote (e.g. Cursor Origin) and need to replace GitHub `main`:

```bash
git remote add origin-src https://origin.cursor.com/ata-moradi/sufi-astronomy.git   # if available
git fetch origin-src main
git checkout -B main origin-src/main
git push -u origin main --force   # only when intentionally replacing history
```

### Commit message tips

- Prefer imperative mood: `Fix PZX sphere diagram for rising problems`
- Mention user-facing impact when relevant
- Do not commit `node_modules/`, `.next/`, or `.env*` (see `.gitignore`)

---

## Docker deploy

The root `Dockerfile` is a three-stage build (deps → build → runner) producing a **standalone** image on port **3847**.

```bash
docker build -t sufi-astronomy/web-gateway:latest .
docker run --rm -p 3847:3847 sufi-astronomy/web-gateway:latest
```

Then open http://127.0.0.1:3847

Image layout (runner stage):

- `public/` static assets (star catalog, etc.)
- `.next/standalone` → `node server.js`
- `.next/static` copied beside standalone output

Optional Compose sketch:

```yaml
services:
  web:
    image: sufi-astronomy/web-gateway:latest
    ports:
      - "3847:3847"
    environment:
      PORT: "3847"
      NODE_ENV: production
```

Stub Dockerfiles under `services/*/Dockerfile` mark future extracted services; domain logic still lives in the Next BFF today.

---

## Kubernetes deploy

Manifests live in `deploy/k8s/`:

| File | Role |
|------|------|
| `namespace.yaml` | `sufi-astronomy` namespace |
| `web-gateway.yaml` | Next UI Deployment + Service (port 80 → 3847) |
| `services.yaml` | Deployments/Services for astro-time, sphere-math, qibla, catalog |
| `ingress.yaml` | Path-based routing example host `sufi-astronomy.example.com` |

Apply stubs (customize images/host first):

```bash
kubectl apply -f deploy/k8s/namespace.yaml
kubectl apply -f deploy/k8s/services.yaml
kubectl apply -f deploy/k8s/web-gateway.yaml
kubectl apply -f deploy/k8s/ingress.yaml
```

Gateway env vars prepared for the split:

| Variable | Default intent |
|----------|----------------|
| `SERVICE_ASTRO_TIME_URL` | `http://astro-time:8081` |
| `SERVICE_SPHERE_MATH_URL` | `http://sphere-math:8082` |
| `SERVICE_QIBLA_URL` | `http://qibla:8083` |
| `SERVICE_CATALOG_URL` | `http://catalog:8084` |

Until services are extracted, the monolith image alone is enough:

```bash
kubectl -n sufi-astronomy set image deploy/web-gateway web=YOUR_REGISTRY/sufi-astronomy/web-gateway:TAG
```

---

## Cursor / hosted publish

This app can be published with Cursor’s **publish-app** flow (public demo currently at `sufi-astronomy.apps.grok.bot`).

Typical agent/maintainer loop:

1. `npm run build` must succeed locally
2. Commit and push the branch Cursor tracks
3. Keep a local preview server running (`npm run dev` on 3847)
4. Confirm the publish dialog in Cursor (3.29.8+) when prompted
5. Security review must finish before a new version goes live

No app secrets are required for core features (catalogs ship in `public/data`; sensors are browser APIs).

---

## Architecture

Today the product is a **Next.js BFF monolith**: React UI + Route Handlers + pure TypeScript domain modules. Folders under `services/` document the **extraction target** so a later Kubernetes split stays mechanical.

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Clients (browser)                         │
│         RTL Persian UI · WebGL sphere · Canvas sky · Map         │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              web-gateway  (Next.js App Router)                   │
│  Pages: /lab /proofs /learn /problems /sky /compass /map …       │
│  BFF:   /api/astro/*  /api/geo/*  /api/catalog/*                 │
│  Libs:  src/lib/astronomy · geo · sky · content                  │
└───────┬─────────────┬─────────────┬─────────────┬───────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
 ┌────────────┐ ┌────────────┐ ┌─────────┐ ┌──────────┐
 │ astro-time │ │sphere-math │ │  qibla  │ │ catalog  │
 │  (future)  │ │  (future)  │ │(future) │ │ (future) │
 │   :8081    │ │   :8082    │ │  :8083  │ │  :8084   │
 └────────────┘ └────────────┘ └─────────┘ └──────────┘
```

**Ingress path sketch** (from `deploy/k8s/ingress.yaml`):

```text
/                     → web-gateway:80
/api/astro/clock      → astro-time:8081
/api/astro/*          → sphere-math:8082
/api/geo/*            → qibla:8083
/api/catalog/*        → catalog:8084
```

### Domain modules (keep React-free)

| Module | Role |
|--------|------|
| `src/lib/astronomy/sphericalTrig.ts` | Cosine/sine laws, haversine, analogue, four-parts, PZX, Napier/Delambre, Girard (radians + `deg` wrappers) |
| `src/lib/astronomy/sphereGeom.ts` | Great/small circles, PZX placement, triangle construction |
| `src/lib/astronomy/time.ts` | JD, GMST, LST, solar approx, EoT |
| `src/lib/astronomy/sphere.ts` | Equatorial ↔ horizontal |
| `src/lib/geo/qibla.ts` | Bearing & distance to Kaaba |
| `src/lib/sky/project.ts` | Free-look / gnomonic star projection |

Extraction checklist: see [`services/README.md`](./services/README.md).

In-app overview (Persian): `/architecture`.

---

## HTTP API reference

All routes are **GET**, JSON responses. Invalid params return `400` with `{ "error": "…" }` (Persian message).

### `GET /api/astro/clock`

Astronomical clock for an observer.

| Query | Type | Default | Description |
|-------|------|---------|-------------|
| `lat` | number | `35.6892` | Latitude (°) |
| `lon` | number | `51.389` | Longitude (°) |
| `iso` | string | now | ISO-8601 timestamp |

**Example**

```bash
curl "http://127.0.0.1:3847/api/astro/clock?lat=35.69&lon=51.39"
```

**Response (shape)**

```json
{
  "service": "astro-time",
  "lat": 35.69,
  "lon": 51.39,
  "jd": 2461000.5,
  "gmst": 12.34,
  "lst": 15.74,
  "solarRa": 14.2,
  "solarDec": -12.5,
  "eotMin": 3.2,
  "utc": "2026-11-12T12:00:00.000Z"
}
```

### `GET /api/astro/horizontal`

Equatorial → horizontal for a star.

| Query | Type | Required | Description |
|-------|------|----------|-------------|
| `ra` | number | yes | Right ascension (hours) |
| `dec` | number | yes | Declination (°) |
| `lat` | number | yes | Observer latitude (°) |
| `lon` | number | no (`0`) | Observer longitude (°) |
| `iso` | string | no | Epoch |

```bash
curl "http://127.0.0.1:3847/api/astro/horizontal?ra=6.75&dec=-16.7&lat=35.7&lon=51.4"
```

Returns `service`, inputs, `lst`, plus horizontal fields from `equatorialToHorizontal` (azimuth / altitude).

### `GET /api/geo/qibla`

| Query | Required |
|-------|----------|
| `lat`, `lon` | yes |

```bash
curl "http://127.0.0.1:3847/api/geo/qibla?lat=35.6892&lon=51.389"
```

```json
{
  "service": "qibla",
  "lat": 35.6892,
  "lon": 51.389,
  "bearing": 218.9,
  "distanceKm": 1980.0
}
```

### `GET /api/catalog/constellations`

No query params. Returns Sufi educational constellation list.

```bash
curl "http://127.0.0.1:3847/api/catalog/constellations"
```

```json
{
  "service": "catalog",
  "source": "صور الکواکب — عبدالرحمن صوفی (مختصات مدرن آموزشی)",
  "count": 48,
  "items": [ /* … */ ]
}
```

### Static data (not API routes)

| URL | Description |
|-----|-------------|
| `/data/stars-mag7.json` | Packed mag ≤ 7 star catalog (client expands v2 base64 typed arrays) |
| `/data/constellations-iau.json` | Illustrative constellation line segments for the live sky (IAU standardises constellation boundaries, not these connecting figures) |

---

## Pages & UX

| Path | Purpose |
|------|---------|
| `/` | Brand hero + feature entry points |
| `/lab` | Interactive teaching sphere |
| `/proofs` | Smart Part 1 step proofs |
| `/learn` | Chapter index of Smart Part 1 |
| `/learn/[id]` | Full lesson: formulae, reconstructed figures, example, exercises |
| `/problems` | Olympiad/Smart bank + **3D solution spheres** |
| `/sky` | Interactive all-sky (mag ≤ 7) |
| `/compass` | Compass + Qibla |
| `/map` | Leaflet observer map |
| `/charts` | Charts |
| `/architecture` | Microservice roadmap (Persian) |

**Problem diagrams** construct geometry from the same math as the written solution (e.g. PZX for altitude/rising, L’Huilier equilateral with correct excess ≈ 31.6° for 60° sides, polar dual via poles of sides).

---

## Data catalogs

- **Stars:** HYG / Hipparcos-derived selection, magnitude ≤ 7, ~15 544 objects, shipped as quantized base64 columns (`v: 2`) for smaller payload.
- **IAU lines:** `public/data/constellations-iau.json` for stick figures on the sky canvas.
- **Courses / problems:** `src/lib/content/lessonsCh1.ts` … `lessonsLater.ts`, `src/lib/content/problems.ts`. Curriculum follows W.M. Smart, *Textbook on Spherical Astronomy*, Part 1.

---

## Sensors & mobile

| Hook | API | Use |
|------|-----|-----|
| `useGeolocation` | Geolocation API | Map, sky observer, Qibla |
| `useCompass` | DeviceOrientation | Compass / Qibla overlay |

**Notes**

- Secure context required: **HTTPS** or `localhost`
- User must grant location / motion permissions
- Fallbacks: Tehran approx. coordinates when GPS is denied

---

## Scripts

Curriculum source is `src/lib/content/lessonsCh1.ts`, `lessonsCh2.ts`, `lessonsLater.ts` (Smart Part 1 chapters, formulae, examples). `scripts/gen-courses.mjs` is a legacy generator and is not used at runtime.

---

## Environment

| Variable | Where | Notes |
|----------|--------|------|
| `PORT` | Runtime | Used by `next start` / Docker (`3847` in image) |
| `NODE_ENV` | Runtime | `production` in containers |
| `SERVICE_*_URL` | K8s gateway | Reserved for post-extraction proxying |

No `.env` secrets are required for the default educational build. Do not commit `.env*` files.

---

## License & credits

- Educational adaptation inspired by classical sources and modern olympiad pedagogy (**Smart**, spherical astronomy texts).
- Star positions: HYG / Hipparcos-derived public astronomical data (see catalog `source` field).
- UI direction: indigo night + manuscript gold; RTL Persian shell with English mathematics where Smart proofs appear.

Contributions welcome via GitHub Pull Requests on  
[atamoradi14/sufi-astronomy-platform](https://github.com/atamoradi14/sufi-astronomy-platform).


## Reviewed spherical mathematics and observing workspaces

The lessons in Smart chapters I–III have been rewritten as original Persian/English teaching adaptations against the local scanned `refrences/Spherical_Astronomy_Part_1.pdf`. Formula references identify the source topic; the new diagrams are independently computed constructions, not reproductions of the printed figures. Later chapters remain supplementary overviews.

- Chapter I: great/small circles, ordinary-triangle existence, cosine/sine/analogue/four-parts laws, right and polar triangles, haversines, half angles, Delambre/Napier, and the separately labelled Girard/L’Huilier supplement. The Delambre derivation now obtains all four identities from the half-angle formulae before taking ratios.
- Chapter II: explicit coordinate conventions, circumpolar boundary cases in both hemispheres, forward/inverse PZX transformations, sidereal/solar intervals, ecliptic rotations, coordinate rates, and twilight. The app measures azimuth **north through east**; Smart’s north-through-west convention is sign-reversed where necessary.
- Chapter III (§§34–39, pp. 58–73): Snell’s law, true/apparent zenith distance, plane-parallel approximation using **observed** zenith distance, spherical-layer invariant and general integral, signed refraction-series coefficients, fitting from observations, and the sunset correction. Near-horizon limitations are explicit.
- The lesson reader supports Persian, English, and bilingual layouts, a contents rail, full translated example steps, locally rendered KaTeX/MathML, revealable practice answers, and previous/next lessons.
- Great-circle and small-circle diagrams use the same vector geometry as the numerical calculations. Rear arcs are dashed in static diagrams and occluded on the interactive sphere. Degenerate triangle arrangements show a status message rather than fabricated angles/areas.
- The sky renderer uses a vertical FOV with rectangular viewport clipping, a continuous zenith camera frame, consistent draw/pick coordinates, and geometric-horizon clipping. The initial location is explicitly the Tehran example until manually changed or GPS is requested. Time input is explicitly **UTC**. The visualisation does not simulate daylight brightness.

### Precision and source boundaries

The sky uses approximate mean sidereal time and J2000 catalogue positions. It does **not** apply precession, nutation, proper motion, atmospheric refraction, or a terrain horizon. It is an educational geometric sky, not an observatory astrometry or rise/set prediction service. Displayed decimals are numerical formatting, not a precision claim. A geographic pole or zenith is handled without dividing by a vanishing cosine; azimuth at the zenith/nadir is mathematically undefined (`azDefined: false` in the domain result).

Original exercises are labelled as original. Historical numerical examples are recomputed from their inputs; the nautical-mile conversion used in the spherical examples is an approximation. The modern nautical mile is exactly 1852 m.

### Validation

```bash
npm test
npm run lint
npm run build
```

`npm test` uses Node’s test runner through `tsx`. It independently checks analytic octants, 120 vector-built triangles against the trigonometric identities, circle planes/unit norms, antipodal arcs, 245 PZX cases including geographic poles, sky projection/zenith continuity, the J2000 time reference, worked numerical values, lesson/proof links, bilingual content fields, and authored TeX parsing. Browser checks cover the sphere, sky, proof navigation, lessons, and responsive layouts.
