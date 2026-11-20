# Reels — «نجوم کروی رو تعاملی یاد بگیر»

Three vertical Instagram reels (1080×1920, 30 fps, H.264, silent AAC track) and covers for the interactive sphere (`/lab`).
All sphere footage is real: recorded frame by frame from the app's own Three.js lab. The live angle sums in reel 2 are read from the lab's measurements panel. The plates are al-Sufi *Ṣuwar al-Kawākib* scans from `public/atlas/plates`.

| Reel | Topic | Length |
|------|-------|--------|
| `reel1-azime-saghire.mp4` | Great vs small circles, celestial equator & ecliptic, Smart's cos φ rule | ~23 s |
| `reel2-mosalas-koravi.mp4` | Spherical triangle, live angle-sum experiment, Girard, cosine formula (A) | ~24 s |
| `reel3-mosalas-nojumi.mp4` | Pole altitude = latitude, PZX triangle, altitude formula, al-Sufi heritage | ~26 s |

Each has a matching `*-cover.png`. Persian captions and hashtags are in `captions-fa.md`.

## Published versions: `with-cover/`

**Every reel must open on its cover within the first 0.5 seconds** (see the [`fanous-instagram-reels` skill](../../.claude/skills/fanous-instagram-reels/SKILL.md)). Ravands can't attach a cover, so Instagram uses the first frame as the thumbnail.

The files in `with-cover/` are the versions published on @fanoussky. Each shows its cover from frame 0 until 1.0 s, then crossfades into the reel. They were made with `.claude/skills/fanous-instagram-reels/scripts/prepend_cover.sh`.

| Episode | Publish date (Tehran) |
|---------|-----------------------|
| ۱ · عظیمه یا صغیره؟ | 20 Nov 2026 |
| ۲ · جمع زوایای مثلث ۱۸۰° نیست! | 21 Nov 2026, 20:00 (scheduled) |
| ۳ · مثلث نجومی PZX | 22 Nov 2026, 20:00 (scheduled) |

The files in the top folder have no cover frame. Don't publish them.

## Rebuild
`source/capture.cjs` records frames from a running dev server (needs a signed-in session cookie, because `/lab` is protected). `source/build.py overlays|video` renders the Persian overlays with Chromium and assembles the reels with ffmpeg. The paths in the scripts point at the original working folders, so adjust them before re-running.
