import { LocalizedDigits } from "@/components/digits/DigitScript";
import { greatArc, smallCircle, lonLatToCart, normalize, dot, cross, placeTriangleSAS, placePZX, greatCircleThrough, type Vec3, } from "@/lib/astronomy/sphereGeom";
const view = normalize([2.5, 1.8, 3]);
const right = normalize(cross([0, 1, 0], view));
const up = cross(view, right);
const project = (p: Vec3) => [
    Number((180 + 132 * dot(p, right)).toFixed(3)),
    Number((180 - 132 * dot(p, up)).toFixed(3)),
];
function Arc({ points, color, width = 1.5, }: {
    points: Vec3[];
    color: string;
    width?: number;
}) {
    // Split at each visibility change so the rear hemisphere is consistently dashed.
    const segments: {
        front: boolean;
        points: Vec3[];
    }[] = [];
    points.forEach((p, i) => {
        const front = dot(p, view) >= 0;
        const last = segments.at(-1);
        if (!last || last.front !== front)
            segments.push({ front, points: i ? [points[i - 1], p] : [p] });
        else
            last.points.push(p);
    });
    return (<LocalizedDigits>
      {<>
          {segments.map((s, i) => (<polyline key={i} points={s.points
                    .map((p) => project(p)
                    .map((x) => x.toFixed(3))
                    .join(","))
                    .join(" ")} fill="none" stroke={color} strokeWidth={width} strokeDasharray={s.front ? undefined : "4 5"} opacity={s.front ? 1 : 0.35}/>))}
        </>}
    </LocalizedDigits>);
}
export function GeometryFigure({ kind = "triangle", sides, }: {
    kind?: string;
    sides?: {
        a: number;
        b: number;
        C: number;
    };
}) {
    const circles = kind === "circles", horizon = kind === "horizon", polar = kind === "polar", ecliptic = kind === "ecliptic", celestial = kind === "celestial";
    const P: Vec3 = [0, 1, 0], A = lonLatToCart(-20, 55), B = lonLatToCart(35, 15), C = lonLatToCart(80, 45);
    const pzx = placePZX(35.7, 16.5, 30);
    const triangle = sides ? placeTriangleSAS(sides.b, sides.C, sides.a) : null;
    const tri = horizon
        ? [pzx.P, pzx.Z, pzx.X]
        : triangle
            ? [triangle.A, triangle.B, triangle.C]
            : [A, B, C];
    const labels = horizon ? ["P", "Z", "X"] : ["A", "B", "C"];
    const caption = ecliptic
        ? "دو عظیمه با میل ۲۳٫۴۴ درجه؛ تقاطع‌ها اعتدال‌ها هستند. / Great circles at obliquity 23.44°; intersections are the equinoxes."
        : celestial
            ? "بعد از اعتدال روی استوا؛ دایرهٔ ساعتی از قطب و ستاره می‌گذرد. / RA from the equinox along the equator; the hour circle contains the pole and star."
            : circles
                ? "صفحهٔ مرکزی عظیمه می‌سازد؛ صغیره با فاصلهٔ ثابت از قطب قرار دارد. / Central plane: great circle; fixed polar distance: small circle."
                : horizon
                    ? "PZ = 90° − φ · PX = 90° − δ · ZX = z. افق بر OZ عمود است. / Horizon is perpendicular to OZ."
                    : "کمان‌ها از تقاطع صفحهٔ مرکزی با کره محاسبه شده‌اند. خط‌چین پشت کره است. / Computed great-circle arcs; dashed segments lie behind the sphere.";
    const colors = ["#f1cf7b", "#79d5ca", "#91b9ff"];
    return (<LocalizedDigits>
      {<figure className="rounded-2xl border border-[var(--border)] bg-[#091424] overflow-hidden">
          <svg viewBox="0 0 360 360" className="w-full mx-auto max-w-md" role="img" aria-label={ecliptic
                ? "Equator and ecliptic at obliquity 23.44 degrees"
                : celestial
                    ? "Right ascension and the stellar hour circle"
                    : circles
                        ? "Great and small circle geometry"
                        : horizon
                            ? "Astronomical triangle PZX"
                            : "Computed spherical triangle ABC"} style={{ direction: "ltr" }}>
            <circle cx="180" cy="180" r="132" fill="#14243a" stroke="#8298b0" strokeWidth="1"/>
            <Arc points={smallCircle(P, 90, 180)} color="#7e91aa"/>
            {ecliptic ? (<>
                <Arc points={smallCircle(lonLatToCart(90, 66.56), 90, 180)} color="#c1a4ff" width={2.5}/>
                {[0, 180].map((l, i) => {
                    const [x, y] = project(lonLatToCart(l, 0));
                    return (<LocalizedDigits key={l}>
                      {<text key={l} x={x + 8} y={y - 10} fill="#f1cf7b" fontSize="16">
                          {i ? "♎" : "♈"}
                        </text>}
                    </LocalizedDigits>);
                })}
                <text x="18" y="30" fill="#c1a4ff" fontSize="13">
                  ε = 23.44°
                </text>
              </>) : celestial ? (<>
                <Arc points={greatArc(P, lonLatToCart(60, 0))} color="#79d5ca" width={2}/>
                <Arc points={greatArc(lonLatToCart(0, 0), lonLatToCart(60, 0))} color="#f1cf7b" width={3}/>
                {[
                    [lonLatToCart(0, 0), "♈"],
                    [lonLatToCart(60, 30), "X"],
                    [P, "P"],
                    [lonLatToCart(30, 0), "α"],
                ].map(([p, label], i) => {
                    const [x, y] = project(p as Vec3);
                    return (<LocalizedDigits key={i}>
                      {<text key={i} x={x + 7} y={y - 8} fill="#f1cf7b" fontSize="16">
                          {label as string}
                        </text>}
                    </LocalizedDigits>);
                })}
              </>) : circles ? (<>
                <Arc points={smallCircle(P, 50, 160)} color="#79d5ca" width={2.5}/>
                <Arc points={greatArc(P, lonLatToCart(40, 40))} color="#f1cf7b"/>
                <text x="190" y="110" fill="#f1cf7b" fontSize="14">
                  θ
                </text>
              </>) : (<>
                {tri.map((v, i) => (<Arc key={i} points={greatArc(v, tri[(i + 1) % 3])} color={colors[i]} width={2.7}/>))}
                {tri.map((p, i) => {
                    const [x, y] = project(p);
                    return (<LocalizedDigits key={i}>
                      {<g key={i}>
                          <circle cx={x} cy={y} r="4" fill={colors[i]}/>
                          <text x={x + 9} y={y - 10} fill={colors[i]} fontSize="16" fontFamily="Georgia">
                            {labels[i]}
                          </text>
                        </g>}
                    </LocalizedDigits>);
                })}
                {tri.map((p, i) => {
                    const [x, y] = project(greatArc(tri[(i + 1) % 3], tri[(i + 2) % 3], 2)[1]);
                    return (<LocalizedDigits key={i}>
                      {<text key={i} x={x + 7} y={y + 15} fill={colors[(i + 1) % 3]} fontSize="14">
                          {horizon
                                ? ["z", "90°−δ", "90°−φ"][i]
                                : ["a", "b", "c"][i]}
                        </text>}
                    </LocalizedDigits>);
                })}
              </>)}
            {horizon && (<Arc points={smallCircle(pzx.Z, 90)} color="#ed94aa" width={2}/>)}
            {polar &&
                (() => {
                    const poles = tri.map((p, i) => {
                        const v = normalize(cross(tri[(i + 1) % 3], tri[(i + 2) % 3]));
                        return dot(v, p) < 0 ? (v.map((x) => -x) as Vec3) : v;
                    });
                    return poles.map((p, i) => {
                        const [x, y] = project(p);
                        return (<LocalizedDigits key={i}>
                      {<g key={i}>
                          <Arc points={greatArc(p, poles[(i + 1) % 3])} color="#c2a2ff" width={2}/>
                          <circle cx={x} cy={y} r="3" fill="#c2a2ff"/>
                          <text x={x + 7} y={y - 6} fill="#c2a2ff" fontSize="13">
                            {["A′", "B′", "C′"][i]}
                          </text>
                        </g>}
                    </LocalizedDigits>);
                    });
                })()}
            {kind === "area" &&
                tri.map((p, i) => (<Arc key={i} points={greatCircleThrough(p, tri[(i + 1) % 3])} color="#6d8b9f" width={1}/>))}
            <text x="16" y="338" fill="#9fb2c7" fontSize="10">
              Orthographic projection · unit sphere · minor arcs
            </text>
          </svg>
          <figcaption className="border-t border-[var(--border)] p-4 text-xs leading-7 text-[var(--muted)]">
            {caption}
          </figcaption>
        </figure>}
    </LocalizedDigits>);
}
export function RefractionFigure() {
    // Parallel layers: incident and refracted ray segments obey Snell at each interface.
    const index = [1, 1.08, 1.2, 1.36];
    const invariant = Math.sin(Math.PI / 3);
    const ys = [40, 110, 180, 250, 320];
    let x = 40;
    const segments = index.map((mu, i) => {
        const nx = x + (ys[i + 1] - ys[i]) * Math.tan(Math.asin(invariant / mu));
        const d = `M ${x} ${ys[i]} L ${nx} ${ys[i + 1]}`;
        x = nx;
        return d;
    });
    return (<LocalizedDigits>
      {<figure className="rounded-2xl border border-[var(--border)] bg-[#091424] p-4">
          <svg viewBox="0 0 440 370" role="img" aria-label="Snell ray through parallel layers; refractive indices exaggerated" style={{ direction: "ltr" }}>
            {index.map((mu, i) => (<g key={i}>
                <rect x="10" y={ys[i]} width="420" height="70" fill="#73c9c4" opacity={0.035 + i * 0.04}/>
                <line x1="10" x2="430" y1={ys[i + 1]} y2={ys[i + 1]} stroke="#7389a4"/>
                <text x="20" y={ys[i] + 25} fill="#b6c7d9" fontSize="13">
                  μ = {mu.toFixed(2)}
                </text>
              </g>))}
            {segments.map((d, i) => (<path key={i} d={d} fill="none" stroke="#f1cf7b" strokeWidth="3"/>))}
            <line x1={x} x2={x} y1="25" y2="335" stroke="#c4d5e5" strokeDasharray="5 5"/>
            <circle cx={x} cy="320" r="5" fill="#79d5ca"/>
            <text x={x + 10} y="340" fill="#79d5ca" fontSize="13">
              O
            </text>
            <text x="20" y="360" fill="#9fb2c7" fontSize="11">
              μ sin i = constant · bending exaggerated for clarity
            </text>
          </svg>
          <figcaption className="text-xs leading-7 text-[var(--muted)]">
            شکست در لایه‌های موازی؛ زاویه‌ها از عمود سنجیده می‌شوند. ضریب‌ها
            برای وضوح بزرگ‌نمایی شده‌اند؛ شکل، مدل جو کروی نیست. /
            Parallel-layer Snell construction, indices exaggerated; not a
            spherical-atmosphere diagram.
          </figcaption>
        </figure>}
    </LocalizedDigits>);
}
