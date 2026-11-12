# Services (extraction map)

Today the Persian astronomy web app runs as a Next.js BFF with domain logic in `src/lib/*` and HTTP edges in `src/app/api/*`.

Each folder below is a **target microservice** for a later Kubernetes split. Keep domain pure functions free of React so extraction stays mechanical.

| Folder | Current API | Responsibility |
|--------|-------------|----------------|
| `astro-time/` | `/api/astro/clock` | JD, GMST, LST, solar RA/Dec, equation of time |
| `sphere-math/` | `/api/astro/horizontal` | Equatorial↔horizontal, spherical trig |
| `qibla/` | `/api/geo/qibla` | Qibla bearing & distance |
| `catalog/` | `/api/catalog/constellations` | al-Sufi constellation catalog |
| `geo-track/` | *(planned)* | Optional track persistence & circle overlays |
| `web-gateway/` | Next.js UI | Persian PWA shell, sensor UX, map tiles |

## Extraction checklist

1. Copy pure modules from `src/lib/astronomy` / `src/lib/geo` into the service.
2. Expose the same JSON contract as the current Route Handler.
3. Point the gateway env `SERVICE_<NAME>_URL` at the cluster DNS name.
4. Apply matching Deployment + Service in `deploy/k8s/`.
