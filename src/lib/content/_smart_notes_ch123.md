# Smart Ch. I–III — distilled notes (from prior agent transcript)

Source: transcript OCR/outline work for W.M. Smart, *Textbook on Spherical Astronomy*, Part 1.  
Pedagogical restatement only — formula numbers, section/page map, and numerical checks.

---

## Section map

### Chapter I — Spherical Trigonometry · pp. 1–24 · §§1–16 · Figs. 1–9 · (A)–(D), (1)–(52)

| §§ | Pages | Topic |
|----|-------|--------|
| 1–3 | 1–4 | Great/small circles, poles, spherical angle; Smart (1) `CD = AB · sin PC` |
| 4 | 4–6 | Terrestrial latitude/longitude, parallels; (2) `HX = LY cos θ`; nautical mile ≈ 1′ GC |
| 5 | 6–9 | Cosine formula **(A)** + cyclic (7)(8); half-angle (11)–(13) |
| 6 | 9–10 | Sine formula **(B)** |
| 7 | 10–11 | Analogue formula **(C)** + (14)–(16) |
| 8 | 12 | Four-parts formula **(D)** + (17)(18) |
| 9–10 | 12–15 | Right-angled & quadrantal; Napier circular parts (19)(20) |
| 11 | 15–16 | Polar triangle; polar of (A) |
| 12–14 | 16–21 | Numerical GC example (Fig. 9); haversine (21)–(23); auxiliary D (24)–(34) |
| 15–16 | 21–24 | Small angles (35)–(40); Delambre (45)–(48); Napier analogies (49)–(52); Ex. 1–9 |

Olympiad supplement (not Smart numbering): Girard / L’Huilier — `E = A+B+C−π`, `Area = R² E`.

### Chapter II — The Celestial Sphere · pp. 25–57 · §§17–29 · Figs. 10–22

| §§ | Pages | Topic |
|----|-------|--------|
| 17–18 | 25–27 | Altitude & azimuth; zenith, horizon; II.(1) `z = 90° − a`; II.(2) `PZ = 90° − φ` |
| 19 | 28–30 | Declination, N.P.D., meridian, hour angle (Figs. 12–13) |
| 20 | — | Southern observer / azimuth–H rule (Fig. 14) |
| 21 | 32–33 | Circumpolar stars; upper/lower culmination (Fig. 15) |
| 22–23 | 33–36 | Geocentric sphere; **PZX** formulae II.(3)–(7) |
| 24, 27 | 36–37, 41–42 | RA, equinox, sidereal time; II.(8)(9)(13)(14) |
| 25–26 | 37–40 | Earth’s orbit, ecliptic, obliquity, λ/β (Figs. 19–21) |
| 28–29 | 42–46 | Mean solar time; zone-time worked example (p. 45) |

### Chapter III — Refraction · pp. 58–73

| Focus | Notes |
|-------|--------|
| True vs apparent zenith distance | `ζ = z − R`; near horizon `R ≈ 34′` |
| Homogeneous approx. | `R ≈ (μ₀ − 1) tan z` |
| General integral | Smart **(20)** in μ(r) |
| Cassini / Bradley series | Empirical `A`, `B` in tan ζ expansions; **(31)(32)** cited in curriculum |
| Classical exercise | Circumpolar upper/lower culmination → solve for A, B (or δ) |

---

## Key formulae (Smart numbers)

### Chapter I

- **(1)** `CD = AB · sin PC` (small-circle arc from pole of AB)
- **(2)** `HX = LY cos θ` (parallel of latitude θ)
- **(A)** `cos a = cos b cos c + sin b sin c cos A`  *(Smart labels side opposite A as a)*
- **(7)(8)** cyclic permutations of (A)
- **(9)** rearrange (A) for included angle
- **(11)–(13)** half-angle: `sin(A/2)`, `cos(A/2)`, `tan(A/2)` with `s = (a+b+c)/2`
- **(B)** `sin a / sin A = sin b / sin B = sin c / sin C`
- **(C)** `sin a cos B = cos b sin c − sin b cos c cos A`
- **(D)** `cos a cos C = sin a cot b − sin C cot B`
- Right angle at C: `cos c = cos a cos b`; Napier: `sin a = sin A sin c`, `tan a = tan c cos B`
- Polar: `a′ = 180° − A`, `A′ = 180° − a`; polar of (A): `cos A = −cos B cos C + sin B sin C cos a`
- **(21)** `hav θ = ½(1 − cos θ) = sin²(θ/2)`
- **(22)** `cos θ = 1 − 2 hav θ`
- **(23)** `hav a = hav(b − c) + sin b sin c hav A`
- **(36)** `sin 1″ = 1/206265` (1 rad = 206265″)
- **(40)** `24ʰ = 360°`, `1ʰ = 15°`, …
- **(45)** Delambre (one of four): `sin(c/2) sin((A−B)/2) = cos(C/2) sin((a−b)/2)`
- **(49)** Napier analogy: `tan ½(a+b) = [cos ½(A−B)/cos ½(A+B)] tan ½c`

### Chapter II — PZX & time

- **II.(1)** `z = 90° − a`
- **II.(2)** `PZ = 90° − φ` (co-latitude)
- **II.(3)** `cos z = sin φ sin δ + cos φ cos δ cos H`
- **II.(4)** `hav z = hav(φ − δ) + cos φ cos δ hav H`
- **II.(5)** `sin δ = sin φ cos z + cos φ sin z cos A`
- **II.(7)** `cos H = cos z sec φ sec δ − tan φ tan δ`
- **II.(9)** `S.T. = H + α`
- **II.(14)** `GST = LST ∓ longitude` (time measure; + if west)

### Chapter III

- `ζ = z − R`
- Homogeneous: `R ≈ (μ₀ − 1) tan z`
- General integral **(20)**; Cassini constants A, B; series forms **(31)(32)**
- Culmination form used in exercises: `z′ = 180° − φ − δ = ζ′ + A tan ζ′ + B tan³ ζ′`

---

## Exact §12 numerical example (Smart I §§12–14, Fig. 9, pp. 16–18)

**Given**

| Point | Lat | Lon |
|-------|-----|-----|
| A | 24°18′ N | 133°39′ E |
| B | 36°47′ N | 125°24′ W |

**Derived sides / angle at pole**

- `PA = 65°42′` (polar distance = 90° − lat A)
- `PB = 53°13′`
- Shorter longitude difference: `APB = 100°57′` (= 360° − 259°03′)
- Book sign convention: `cos 100°57′ = − cos 79°3′`

**Results (five-figure logs / Inman haversine tables)**

| Quantity | Value |
|----------|--------|
| `cos AB` | 0.10776 |
| `AB` | 83°48′.8 ≈ **83°49′** |
| Distance | **5028.8 nautical miles** (1 nmi ≡ 1′ of GC) |
| Angle at A (from half-angle (11)) | **52°16′** |
| Highest latitude on AB (C: meridian ⊥ AB) | **43°53′ N** via `sin PC = sin PA sin PAC` |

Live verification in prior work: `AB = 83°48′50.6″ ≈ 83°49′ = 5028.8 nmi`.  
Haversine form of the same triangle recovers the same AB.  
Smart leaves **longitude of C** as an exercise (p. 18).

---

## Persian terminology already used (good set)

| Persian | English / Smart |
|---------|-----------------|
| مثلثات کروی | Spherical trigonometry (Ch. I) |
| دایرهٔ عظیمه / دایرهٔ صغیره | Great / small circle |
| زاویهٔ کروی | Spherical angle |
| عرض و طول جغرافیایی | Latitude & longitude |
| متمم عرض | Colatitude |
| مایل دریایی | Nautical mile |
| فرمول کسینوس — صورت (A) | Cosine formula (A) |
| فرمول سینوس — صورت (B) | Sine formula (B) |
| فرمول مشابه کسینوس — صورت (C) | Analogue (C) |
| فرمول چهار جزء — صورت (D) | Four-parts (D) |
| مثلث قائم / قواعد نپر | Right-angled / Napier’s rules |
| مثلث قطبی | Polar triangle |
| هاورساین | Haversine |
| دلامبر / قیاسی‌های نپر | Delambre / Napier’s analogies |
| زیادی کروی | Spherical excess |
| کرهٔ سماوی | Celestial sphere |
| ارتفاع و سمت | Altitude & azimuth |
| سمت‌القدم | Zenith distance |
| میل / زاویهٔ ساعتی | Declination / hour angle |
| بعد / نقطهٔ حمل / زمان نجومی | RA / equinox / sidereal time |
| ستارگان قطبی‌گرد / گذار بالا و پایین | Circumpolar / culmination |
| مثلث نجومی PZX | Astronomical triangle PZX |
| دایرة‌البروج | Ecliptic |
| زمان خورشیدی میانگین | Mean solar time |
| شکست جوّی | Astronomical refraction |
| z حقیقی و ظاهری | True / apparent zenith distance |

---

## Problems / worked examples found

### Worked examples (curriculum)

1. **Smart I §12** — GC Glasgow-style pair A/B → AB, angle A, lat C (values above); widget `gc-distance`.
2. **Smart I §4** — parallel of lat 50°, Δlon 20° → parallel arc vs equatorial arc via (2).
3. **Smart II §21** — φ = 40°N, δ = +15° → rise hour angle `H₀ ≈ 103° ≈ 6ʰ52ᵐ`, duration ≈ 13ʰ44ᵐ.
4. **Smart II §23 / PZX** — φ = 35°.7 N, δ = +16°.5, H = +2ʰ = 30° → `z ≈ 41°`, `a ≈ 49°`.
5. **Smart II §§28–29** — zone-time example (p. 45); lon Δ 165°E − 163°14′E → time (Ex.).

### Smart end-of-section exercises cited

- I §2: pole of a GC is 90° from every point; why FCD (Fig. 1) is not a spherical triangle  
- I §7: finish proof of (C) when `c > 90°` (p. 11)  
- I §8–10: with C = 90°, reduce (D) to Napier `tan a = tan c cos B`  
- I §11: three angles → sides via polar of (A)  
- I §12: longitude of C  
- I Ex. 8: differential `da = cos C db + cos B dc + K sin b sin c dA`  
- I Ex. 9 / Glas. 1967: equilateral `da/dA = cos(A/2) cot(a/2)`  
- II §18: facing north, east is to the right (p. 27 n.)  
- II §20: southern observer Fig. 14  
- II §21: star that never rises at φ  
- II §24: RA 5ʰ on meridian → LST  
- II §26: Sun `cos δ cos α = cos λ`, `cos δ sin α = cos ε sin λ`  
- III Ex. 7: neighbouring stars, observed distance `D − kD(1 + cos²ψ tan² z)`  
- III: circumpolar culminations for Cassini A, B  

### App problem bank (olympiad / Smart-tagged, sample)

- عظیمه در برابر صغیره — δ=+40° → صغیره، شعاع زاویه‌ای ۵۰°  
- زیادی و مساحت — Girard  
- فاصلهٔ دو ستاره / قانون سینوس‌ها — مثلث نجومی  
- ارتفاع از مثلث PZX — Smart II  
- قانون کسینوس برای زوایا — polar of (A)  
- L’Huilier / چهار جزء / LST / میل خورشید  

---

## Quick chapter page index (Part 1)

| Ch | Roman | Pages | Title Fa |
|----|-------|-------|----------|
| 1 | I | 1–24 | مثلثات کروی |
| 2 | II | 25–57 | کرهٔ سماوی |
| 3 | III | 58–73 | شکست جوّی |
