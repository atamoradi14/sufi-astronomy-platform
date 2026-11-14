import type { Problem } from "./problems";
export type EnglishProblem = Pick<
  Problem,
  "title" | "prompt" | "hint" | "solution" | "answer" | "source"
> & { caption: string };
export const PROBLEMS_EN: Record<string, EnglishProblem> = {
  p1: {
    title: "Great circle or small circle?",
    prompt:
      "What kind of circle is the parallel of declination δ = +40°? What is its angular radius about the north celestial pole?",
    hint: "Polar distance is 90° − δ. A plane parallel to the equator that misses the centre cuts a small circle.",
    solution:
      "The parallel δ = +40° is a small circle. Its plane does not pass through the sphere’s centre. Its angular radius from the north pole is 90° − 40° = 50°.",
    answer: "Small circle · 50°",
    source: "Original spherical-geometry exercise",
    caption:
      "Equator: great circle · δ = +40°: small circle · polar radius = 50°",
  },
  p2: {
    title: "Spherical excess and area",
    prompt:
      "A spherical triangle has angles 72°, 80°, and 95°. Find its excess E and area on a unit sphere.",
    hint: "E = A + B + C − 180°. On a unit sphere, the area equals E expressed in radians.",
    solution:
      "E = 72° + 80° + 95° − 180° = 67°. The unit-sphere area is 67π/180 ≈ 1.169; the corresponding solid angle is 1.169 sr, by Girard’s theorem.",
    answer: "E = 67° · unit-sphere area ≈ 1.169",
    source: "Girard · original supplementary exercise",
    caption: "Spherical triangle · E = A + B + C − 180° = 67°",
  },
  p3: {
    title: "Angular distance between two stars",
    prompt:
      "Two stars have coordinates (α = 5.0 h, δ = −8°) and (α = 5.6 h, δ = +7°). Find their angular separation d.",
    hint: "cos d = sin δ₁ sin δ₂ + cos δ₁ cos δ₂ cos Δα, with Δα = 0.6 h = 9°.",
    solution:
      "Δα = 9°. Substitution gives cos d = sin(−8°) sin 7° + cos(−8°) cos 7° cos 9° ≈ 0.9540. Hence d ≈ 17.48°.",
    answer: "d ≈ 17.5°",
    source: "Adaptation of Smart I §5",
    caption: "Great-circle arc between the stars · Δα = 9° · d ≈ 17.5°",
  },
  p4: {
    title: "Sine rule and the correct quadrant",
    prompt:
      "Given a = 50°, A = 120°, and b = 40°, find B and justify its quadrant.",
    hint: "sin B = sin b sin A / sin a. Check the possible angles against side–angle ordering and the cosine rule.",
    solution:
      "sin B = sin 40° sin 120° / sin 50° ≈ 0.7267. The candidates are B ≈ 46.6089° and 133.3911°. Since a > b, an ordinary spherical triangle must have A > B. The second candidate exceeds A = 120° and is rejected. The first agrees with the cosine rule.",
    answer: "B ≈ 46.6°",
    source: "Adaptation of Smart I §6",
    caption: "SSA · sin B = sin b sin A / sin a · B ≈ 46.6°",
  },
  p5: {
    title: "Altitude from the astronomical triangle",
    prompt:
      "At latitude φ = 35°, a star has δ = +20° and H = 30°. Find its altitude a.",
    hint: "sin a = sin δ sin φ + cos δ cos φ cos H, with ZX = z = 90° − a.",
    solution:
      "Substitute the given angles: sin a = sin 20° sin 35° + cos 20° cos 35° cos 30°. This gives a ≈ 59.63°. The triangle has PZ = 55°, PX = 70°, and ZX = 90° − a ≈ 30.4°.",
    answer: "a ≈ 59.6°",
    source: "Original exercise using Smart II",
    caption:
      "Astronomical triangle PZX · φ = 35° · δ = 20° · H = 30° · a ≈ 59.6°",
  },
  p6: {
    title: "Hour angle at rising and setting",
    prompt:
      "For φ = 40° N and δ = +15°, find the limiting hour angle H₀ and the time above a geometric horizon.",
    hint: "At the horizon a = 0, so cos H₀ = −tan φ tan δ. Convert the full arc 2H₀ to hours at 15° per sidereal hour.",
    solution:
      "cos H₀ = −tan 40° tan 15° ≈ −0.2247, giving H₀ ≈ 103.0°. The time above the horizon is 2H₀/15 ≈ 13.73 sidereal hours. Refraction and the body’s angular radius are excluded.",
    answer: "H₀ ≈ 103° · about 13.7 sidereal hours",
    source: "Original astronomy exercise",
    caption: "Horizon · daily path at δ = +15° · H₀ ≈ 103° from the meridian",
  },
  p7: {
    title: "Sides of the astronomical triangle",
    prompt: "For φ = 40° N and δ = +10°, find PZ and PX.",
    hint: "PZ is the co-latitude 90° − φ; PX is the co-declination 90° − δ.",
    solution:
      "PZ = 90° − 40° = 50°. PX = 90° − 10° = 80°. The third side ZX also depends on the hour angle H.",
    answer: "PZ = 50° · PX = 80°",
    source: "Smart II",
    caption: "P: pole · Z: zenith · X: star · PZ = 50° · PX = 80°",
  },
  p8: {
    title: "Cosine rule for angles",
    prompt: "Derive the polar form of the cosine rule for angle C.",
    hint: "Use the polar triangle with a′ = 180° − A and cyclic equivalents. Apply the side cosine rule to that triangle.",
    solution:
      "Substitute the complementary polar sides and angles in the side cosine rule and simplify: cos C = −cos A cos B + sin A sin B cos c.",
    answer: "cos C = −cos A cos B + sin A sin B cos c",
    source: "Adaptation of Smart I §5: polar triangle",
    caption:
      "Original triangle: gold · polar triangle: turquoise · a′ = 180° − A",
  },
  p9: {
    title: "L’Huilier’s formula",
    prompt: "For a = b = c = 60°, estimate E using L’Huilier’s formula.",
    hint: "s = 90° and (s − a)/2 = 15°. Thus tan(E/4) = √[tan(s/2) tan³((s − a)/2)].",
    solution:
      "s = 90°. Then tan(E/4) = √(tan 45° tan³ 15°) ≈ 0.1387, giving E ≈ 31.59°. Independently, the side cosine rule gives cos A = (cos 60° − cos² 60°)/sin² 60° = 1/3. Hence A ≈ 70.53° and E = 3A − 180° ≈ 31.59°.",
    answer: "E ≈ 31.6° · A ≈ 70.5°",
    source: "L’Huilier",
    caption: "Equilateral: a = b = c = 60° · E ≈ 31.6° · A = B = C ≈ 70.5°",
  },
  p10: {
    title: "Local sidereal time",
    prompt: "Given GMST = 9.2 h and longitude λ = 51° E, find LST.",
    hint: "LST = GMST + λ/15, with east longitude positive; reduce the result modulo 24 h.",
    solution: "λ/15 = 51/15 = 3.4 h. Therefore LST = 9.2 + 3.4 = 12.6 h.",
    answer: "12.6 h",
    source: "Smart: sidereal time",
    caption: "Greenwich to observer · LST = GMST + λ/15 = 12.6 h",
  },
  p11: {
    title: "Solar declination at the solstice",
    prompt:
      "At ecliptic longitude λ = 90° and obliquity ε = 23.44°, find the Sun’s declination.",
    hint: "For ecliptic latitude zero, sin δ = sin ε sin λ.",
    solution:
      "sin δ = sin 23.44° sin 90°, so δ = +23.44° at the northern summer solstice.",
    answer: "δ = ε ≈ 23.44°",
    source: "Smart II",
    caption: "Equator · ecliptic obliquity ε = 23.44° · Sun at λ = 90°",
  },
  p12: {
    title: "Applying the four-parts formula",
    prompt:
      "In a right spherical triangle with C = 90°, a = 30°, and B = 50°, find c using tan a = cos B tan c.",
    hint: "Rearrange the right-triangle relation to tan c = tan a / cos B.",
    solution:
      "tan c = tan 30° / cos 50° ≈ 0.57735/0.64279 ≈ 0.898. Thus c ≈ 41.9301°.",
    answer: "c ≈ 41.9°",
    source: "Smart I: right-angled triangles",
    caption: "Right angle at C · a = 30° · B = 50° · c ≈ 41.9°",
  },
};
