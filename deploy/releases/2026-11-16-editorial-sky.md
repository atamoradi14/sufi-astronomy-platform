# Editorial reading room and spherical sky — 16 November 2026

Production: **https://manderia.daryajan.com**. Public identity remains **فانوس خیال / Fanous-e Khial**.

Runtime source: `ff31329`. Image tag: `docker.io/atamoradi/manderia:release-20261116-02`.

Deployed image: `docker.io/atamoradi/manderia@sha256:8aef9c323a0378a894c59d07193792c2cb1bd42313bffb7f99f5da85b1ce6d8c`. The Linux production build passes; homepage first-load JavaScript remains **136 kB**.

Reading pages now use ivory, ink and teal, with a manuscript feature and varied tool hierarchy. Observing workspaces remain dark. Vazirmatn Variable replaces the mixed Amiri/Georgia/interface fonts, including poetry and canvas labels; KaTeX retains its mathematical glyphs. The social preview follows the reading environment. Navigation avoids speculative prefetching of heavy tools, and the sky tabs load on demand.

The sky uses stereographic exploration and an optional azimuthal-equidistant full hemisphere. The horizon, ground, grid, stars and picking share the same projection. Pointer-anchored zoom, spherical dragging through zenith and midpoint-anchored pinch preserve sky directions. Labels use measured collision avoidance and lower density on phones. Clock updates pause offscreen; decorative previews pause when idle and honour reduced motion. See `deploy/experience.md` for formulas and model limitations.

Local verification: all **32 automated tests** pass, including four new projection/gesture/ground-mask tests; TypeScript and ESLint pass. Browser checks cover Persian and English at 320, 390, 768, 1024 and 1440px, reading routes and equations, sky selection/zoom/drag/zenith/simulated pinch, reduced motion, offscreen pause/resume and anonymous gates. Protected atlas, sphere and sensor layouts and the sensor sample solve were verified using an isolated local preview account. Mobile checks use browser viewports and simulated pointers, not physical Android sensor testing.

Homepage font resources changed from **208,936 bytes** (Vazirmatn and Amiri subsets) to **80,832 bytes** (Vazirmatn only), approximately **61% less encoded font data**. This compares resource payloads, not an asserted device/network load-time gain. No new animation or rendering dependency was introduced. The dependency installer reports existing audit advisories; dependency upgrades are outside this visual/projection release.

Production verification repeated the responsive/language/reading checks, mobile-menu navigation and contact link, projection modes, star selection, mouse zoom/drag, zenith and simulated pinch. Offscreen clock pause/resume, reduced motion, idle animation pause and all three anonymous tool gates pass. No application runtime exceptions were recorded. Production homepage font resources confirm the 80,832-byte figure and only Vazirmatn loaded.

The rollout driver created checksum- and integrity-verified account database backups locally and on the persistent volume. Every pre-existing account ID was preserved. The new pod is Ready on `ravand-worker-01` in namespace `astronomy`, with zero restarts. Public logo/icon/social/favicon bytes match their source hashes. Home, About, health, sitemap and robots return 200; Hamafarin and Darvazeh return 200. Shared Caddy, domain and OAuth identifiers were retained. The initial Docker Hub upload timed out; a cached build/upload retry succeeded before deployment. Local preview credentials and its isolated database were removed after verification.
