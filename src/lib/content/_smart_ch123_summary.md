# Smart Part 1 — Chapters I–III section map

Source OCR: `/tmp/smart_ch123.txt` (pages p001–p073, tesseract `--psm 6`, `OMP_THREAD_LIMIT=1`).  
Curriculum JSON: `/workspace/src/lib/content/_smart_ch123_outline.json`.

## Chapter I — Spherical Trigonometry (pp. 1–24)

| §§ | Pages | Title | Formulae / figures |
|----|-------|-------|--------------------|
| 1–3 | 1–4 | Introduction; great/small circles; spherical triangle; small-circle arc | (1); Fig. 1 |
| 4 | 4–6 | Terrestrial latitude & longitude | (2); Fig. 2 |
| 5 | 6–9 | Cosine-formula **(A)** | (A),(7)–(13); Fig. 3 |
| 6 | 9–10 | Sine-formula **(B)** | (B) |
| 7 | 10–12 | Analogue formula **(C)** | (C),(14)–(16); Fig. 4 |
| 8 | 12–14 | Four-parts formula **(D)** | (D),(17)–(18); Fig. 5 |
| 9–10 | 14–15 | Alt. proofs; right-angled / quadrantal; Napier | (19)–(20); Figs. 6–7 |
| 11 | 15–16 | Polar triangle | polar of (A); Fig. 8 |
| 12 | 16–18 | Numerical example (A 24°18′N 133°39′E; B 36°47′N 125°24′W → AB 83°49′=5028.8 nmi; ∠A 52°16′) | (A),(11); Fig. 9 |
| 13–14 | 18–21 | Haversines; auxiliary angle D | (21)–(34) |
| 15–16 | 21–24 | Small angles; Delambre & Napier analogies | (35)–(52) |

## Chapter II — The Celestial Sphere (pp. 25–57)

| §§ | Pages | Title | Formulae / figures |
|----|-------|-------|--------------------|
| 17–18 | 25–28 | Altitude & azimuth | II.(1)–(2); Figs. 10–11 |
| 19–20 | 28–32 | Declination & hour angle; southern diagram | Figs. 12–14 |
| 21 | 32–33 | Circumpolar stars | Fig. 15 |
| 22–23 | 33–36 | Geocentric sphere; triangle **PZX** | II.(3)–(7); Figs. 16–17 |
| 24, 27 | 36–37, 41–42 | RA, equinox, sidereal time | II.(8)–(9),(13)–(14); Figs. 18, 22 |
| 25–26 | 37–40 | Earth’s orbit; ecliptic; λ, β | II.(10)–(12); Figs. 19–21 |
| 28–29 | 42–46 | Mean solar time; zone-time example | II.(15)–(22) |
| 30–32 | 45–52 | H.A. of a body; rising/setting; Δz, ΔA | II.(23)–(29) |
| — | 53–57 | Chapter II exercises | — |

## Chapter III — Refraction (pp. 58–73)

| §§ | Pages | Title | Formulae / figures |
|----|-------|-------|--------------------|
| 34 | 58–60 | Laws of refraction | III.(1)–(4) |
| 35 | 60–62 | True/apparent z; mean refraction (small z) | III.(5)–(7); Fig. 23 |
| 36–37 | 62–68 | General integral; Cassini R=A tan ζ+B tan³ ζ | III.(9)–(30); Fig. 29 |
| 38 | 68–69 | Constants A, B from culminations | III.(31)–(33); Fig. 30 |
| 39–40 | 69–73 | Sunset delay; refraction on α, δ | III.(34)–(40); Fig. 31 |
| — | 72–73 | Chapter III exercises | — |

## OCR status

- Pages processed: **73/73** (p001–p073)
- Failures: **none** (after `TESSDATA_PREFIX` + `OMP_THREAD_LIMIT=1`, 2-way parallel)
- Note: early 4-way runs without `OMP_THREAD_LIMIT=1` timed out; not retained

## Outline topic counts

- Ch I: 11 topics  
- Ch II: 8 topics  
- Ch III: 5 topics  
- **Total: 24**
