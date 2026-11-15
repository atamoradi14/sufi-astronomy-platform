# Fanous-e Khial rebrand — 16 November 2026 (Pacific/Auckland)

Production: **https://manderia.daryajan.com**. Public brand: **فانوس خیال / Fanous-e Khial**.

Runtime source: `017953696a9d9b1dde19054bb1de2e231275e684`. Image tag: `docker.io/atamoradi/manderia:release-20261116-01`. Immutable image: `docker.io/atamoradi/manderia@sha256:8908fdeb81ac78ae4cba1b1503bc0fde38311541487f9f5ca0fd53234155dc9b`.

Replaced the former book emblem with an original SVG lantern-and-star mark, regenerated favicon and install/touch icons, and added a symbolic lantern homepage illustration. Warm gold and turquoise accents accompany the new Persian/English identity across the header, homepage, builder story, sign-in/admin interfaces, About, Privacy, tool guide, metadata, structured data, manifest and social preview.

A small line from the poem appears below the header name. The first couplet sits beneath the homepage name; About carries the full quatrain and explains the name. The text follows the linked Ganjoor edition of Hedayat's selection and explicitly says it is attributed to Khayyam. English uses our own rendering, shown only when English is selected. See `deploy/brand.md` for source and regeneration instructions.

Validation: all 28 existing automated tests pass; ESLint, TypeScript and the Linux production build pass. Browser checks on local and production cover both languages at widths 320, 390, 768, 1024 and 1440; no horizontal overflow or clipped name/poem, correct language selection, mobile-menu navigation, protected tools, About's full quatrain and contact links, metadata/manifest identity, and no application runtime exceptions. Production asset SHA-256 comparisons match the committed logo, SVG/PNG icons, touch icon, favicon and social card.

The deployment driver took an online account-database backup and verified checksum/integrity before rollout. Existing account IDs were compared privately after rollout and all were preserved. The new pod is Ready on `ravand-worker-01` in namespace `astronomy`, with zero restarts. Home, About, health, sitemap and robots return 200; Hamafarin and Darvazeh remain healthy. The shared Caddy configuration and OAuth/domain/resource identifiers were retained.

The downloadable local logo kit is `output/Fanous-e-Khial-Brand-Kit.zip` (ignored). The previously delivered Instagram campaign retains its earlier branding and is not used by the application.
