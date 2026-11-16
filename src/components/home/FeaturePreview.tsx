"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
export type PreviewKind =
  | "sky"
  | "sensor"
  | "sphere"
  | "atlas"
  | "charts"
  | "course"
  | "map"
  | "compass";
function Stars() {
  return (
    <g className="preview-stars">
      {Array.from({ length: 48 }, (_, i) => (
        <circle
          key={i}
          cx={(i * 137 + 23) % 640}
          cy={(i * 71 + 19) % 340}
          r={i % 4 === 0 ? 1.8 : 0.85}
          fill={i % 5 === 0 ? "#f5cf87" : "#d6e9f3"}
          style={{ animationDelay: `${((i % 7) * -0.7).toFixed(1)}s` }}
        />
      ))}
    </g>
  );
}
export function FeaturePreview({
  kind,
  hero = false,
}: {
  kind: PreviewKind;
  hero?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`feature-preview preview-${kind}${hero ? " preview-hero" : ""}`}
      data-visible={visible}
      aria-hidden="true"
    >
      {kind === "atlas" ? (
        <>
          <div className="atlas-orbit" />
          <Image
            className="atlas-leaf atlas-leaf-back"
            src="/atlas/plates/orion-globe.webp"
            alt=""
            width={300}
            height={330}
            sizes="(max-width: 600px) 96px, 160px"
          />
          <Image
            className="atlas-leaf atlas-leaf-front"
            src="/atlas/plates/ursa-major-sky.webp"
            alt=""
            width={300}
            height={330}
            sizes="(max-width: 600px) 96px, 160px"
          />
          <span className="atlas-spark">✦</span>
        </>
      ) : (
        <svg viewBox="0 0 640 360" fill="none" className="preview-svg">
          <defs>
            <radialGradient id={id + "glow"}>
              <stop stopColor="#76b6c4" stopOpacity=".2" />
              <stop offset="1" stopColor="#102838" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id={id + "sphere"}
              x1="200"
              y1="80"
              x2="430"
              y2="290"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#234858" />
              <stop offset="1" stopColor="#0b1c2d" />
            </linearGradient>
            <clipPath id={id + "disc"}>
              <circle cx="320" cy="180" r="123" />
            </clipPath>
          </defs>
          <rect width="640" height="360" fill={"url(#" + id + "glow)"} />
          <Stars />
          {(kind === "sky" || kind === "sensor") && (
            <>
              <g stroke="#43677b" strokeWidth=".8" opacity=".4">
                <ellipse cx="320" cy="365" rx="260" ry="240" />
                <ellipse cx="320" cy="365" rx="180" ry="240" />
                <ellipse cx="320" cy="365" rx="75" ry="240" />
                <path d="M60 280Q320 175 580 280M104 207Q320 125 536 207M180 145Q320 105 460 145" />
              </g>
              <g
                className="constellation-draw"
                stroke="#8cbcc7"
                strokeWidth="1.6"
              >
                <path d="m180 108 70 39 66-53 40 73 87-34-19 91-79-10-26 68-89-42 20-93M250 147l106 20-11 47-115 26M356 167l68 57" />
              </g>
              {[
                [180, 108],
                [250, 147],
                [316, 94],
                [356, 167],
                [443, 133],
                [424, 224],
                [345, 214],
                [319, 282],
                [230, 240],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={i === 3 ? 9 : 6}
                    fill="#b9dfeb"
                    opacity=".1"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={i === 3 ? 3.6 : 2.4}
                    fill={i === 3 ? "#f2d598" : "#d6e9f3"}
                  />
                </g>
              ))}
              {kind === "sky" ? (
                <>
                  <path
                    d="M-40 330Q130 275 280 315T680 310V400H-40Z"
                    fill="#0a1927"
                  />
                  <path
                    d="M-40 330Q130 275 280 315T680 310"
                    stroke="#8bafad"
                    strokeOpacity=".4"
                  />
                  <circle cx="500" cy="80" r="20" fill="#f4e3bb" />
                  <circle cx="508" cy="73" r="19" fill="#102432" />
                  <path
                    className="preview-comet"
                    d="m0 0 65-27"
                    stroke="#b9d9e4"
                    strokeWidth="1.5"
                  />
                </>
              ) : (
                <>
                  <rect
                    x="147"
                    y="65"
                    width="329"
                    height="242"
                    rx="9"
                    stroke="#7b99ac"
                    strokeDasharray="3 7"
                    opacity=".55"
                  />
                  <g
                    className="sensor-matches"
                    stroke="#7dd8c0"
                    strokeWidth="1.4"
                  >
                    {[
                      [250, 147],
                      [316, 94],
                      [356, 167],
                      [443, 133],
                      [345, 214],
                      [230, 240],
                    ].map(([x, y], i) => (
                      <rect
                        key={i}
                        x={x - 12}
                        y={y - 12}
                        width="24"
                        height="24"
                        rx="3"
                      />
                    ))}
                  </g>
                  <path
                    className="sensor-crosshair"
                    d="M320 139v24m0 34v24m-41-41h24m34 0h24"
                    stroke="#f2d598"
                    strokeWidth="1.5"
                  />
                  <path
                    className="sensor-scan"
                    d="M148 88h327"
                    stroke="#79dbcb"
                    strokeWidth="2"
                    opacity=".6"
                  />
                </>
              )}
            </>
          )}
          {kind === "sphere" && (
            <>
              <circle
                cx="320"
                cy="180"
                r="123"
                fill={"url(#" + id + "sphere)"}
              />
              <g
                clipPath={"url(#" + id + "disc)"}
                stroke="#678e9d"
                strokeWidth=".8"
                opacity=".7"
              >
                <ellipse cx="320" cy="180" rx="123" ry="39" />
                <ellipse cx="320" cy="180" rx="123" ry="85" />
                <ellipse
                  className="sphere-meridian"
                  cx="320"
                  cy="180"
                  rx="48"
                  ry="123"
                />
                <ellipse cx="320" cy="180" rx="96" ry="123" />
                <path d="M197 180h246M320 57v246" />
              </g>
              <circle
                cx="320"
                cy="180"
                r="123"
                stroke="#87b4bf"
                strokeWidth="1.2"
              />
              <path
                className="sphere-triangle"
                d="M278 91Q260 149 244 204Q324 248 408 187Q345 126 278 91Z"
                fill="#e5c47e"
                fillOpacity=".08"
                stroke="#e5c47e"
                strokeWidth="2"
              />
              {[
                [278, 91, "A"],
                [244, 204, "B"],
                [408, 187, "C"],
              ].map(([x, y, l]) => (
                <g key={l}>
                  <circle cx={Number(x)} cy={Number(y)} r="4" fill="#efdaa8" />
                  <text
                    x={Number(x) + 10}
                    y={Number(y) - 9}
                    fill="#efdaa8"
                    fontSize="15"
                    fontFamily="Vazirmatn Variable, sans-serif"
                  >
                    {l}
                  </text>
                </g>
              ))}
            </>
          )}
          {kind === "charts" && (
            <>
              <g stroke="#405b70" opacity=".45" strokeWidth=".8">
                <path d="M120 75v210h410M120 125h410M120 180h410M120 235h410M200 75v210M280 75v210M360 75v210M440 75v210M520 75v210" />
              </g>
              <path
                className="chart-line chart-line-gold"
                d="M120 232C170 235 180 225 211 197S267 105 310 111 361 190 408 172 473 92 530 108"
                stroke="#e8c783"
                strokeWidth="3"
              />
              <path
                className="chart-line chart-line-teal"
                d="M120 162C170 122 201 132 235 157S302 233 350 217 423 143 460 166 500 222 530 203"
                stroke="#74c9c0"
                strokeWidth="2"
              />
              <circle
                className="chart-point"
                cx="310"
                cy="111"
                r="5"
                fill="#e8c783"
              />
              <circle cx="505" cy="54" r="13" fill="#e9ce8d" />
              <circle cx="462" cy="54" r="9" fill="#b9cad6" />
            </>
          )}
          {kind === "course" && (
            <>
              <g className="preview-book">
                <path
                  d="M320 105Q239 66 158 98v191q83-30 162 9 79-39 162-9V98q-81-32-162 7Z"
                  fill="#182d3d"
                  stroke="#839b9c"
                  strokeWidth="1.5"
                />
                <path d="M320 105v193" stroke="#c9ae72" />
                {[133, 153, 173, 235, 254].map((y, i) => (
                  <g
                    key={y}
                    stroke={i > 2 ? "#8ba5b3" : "#c5bd9e"}
                    opacity={i > 2 ? 0.3 : 0.5}
                  >
                    <path d={`M185 ${y}q51-9 108 8M347 ${y + 8}q51-17 108-8`} />
                  </g>
                ))}
                <path
                  d="m202 214 25-31 42 40Z"
                  fill="#e2c488"
                  fillOpacity=".08"
                  stroke="#e2c488"
                />
                <text
                  x="356"
                  y="217"
                  fill="#b8d3d6"
                  fontFamily="Vazirmatn Variable, sans-serif"
                  fontStyle="italic"
                  fontSize="12"
                >
                  <tspan x="346" y="205">
                    cos c = cos a cos b
                  </tspan>
                  <tspan x="352" dy="18">
                    + sin a sin b cos C
                  </tspan>
                </text>
              </g>
              <path
                className="book-orbit"
                d="M128 188c0-117 384-117 384 0"
                stroke="#759caa"
                strokeDasharray="2 9"
                opacity=".5"
              />
            </>
          )}
          {kind === "map" && (
            <>
              <circle
                cx="320"
                cy="180"
                r="121"
                fill={"url(#" + id + "sphere)"}
                stroke="#7899a4"
              />
              <g clipPath={"url(#" + id + "disc)"}>
                <path
                  d="m212 134 39-47 64 8 16 40-26 30-8 42-29-9-10-32-32 6Zm120 31 32-38 50 11 20 35-32 29-14 56-25 21-14-40 11-39Z"
                  fill="#739b8e"
                  fillOpacity=".48"
                />
                <ellipse
                  cx="320"
                  cy="180"
                  rx="121"
                  ry="45"
                  stroke="#7199a8"
                  opacity=".4"
                />
                <ellipse
                  cx="320"
                  cy="180"
                  rx="51"
                  ry="121"
                  stroke="#7199a8"
                  opacity=".4"
                />
              </g>
              <ellipse
                className="map-ripple"
                cx="358"
                cy="160"
                rx="27"
                ry="12"
                stroke="#f1d295"
              />
              <path
                d="M358 166s-15-17-15-27a15 15 0 1 1 30 0c0 10-15 27-15 27Z"
                fill="#e8c783"
              />
              <circle cx="358" cy="139" r="5" fill="#173044" />
            </>
          )}
          {kind === "compass" && (
            <>
              <circle cx="320" cy="180" r="111" stroke="#6a8a99" />
              <circle
                cx="320"
                cy="180"
                r="97"
                stroke="#6a8a99"
                strokeDasharray="1 11"
                strokeWidth="6"
              />
              <circle cx="320" cy="180" r="72" stroke="#496678" />
              <g
                fill="#b1c6cc"
                fontFamily="Vazirmatn Variable, sans-serif"
                fontSize="16"
                textAnchor="middle"
              >
                <text x="320" y="52">
                  N
                </text>
                <text x="320" y="322">
                  S
                </text>
                <text x="184" y="185">
                  W
                </text>
                <text x="456" y="185">
                  E
                </text>
              </g>
              <g className="compass-needle">
                <path d="m320 99 15 81-15 81-15-81Z" fill="#6ba6aa" />
                <path d="m320 99 15 81h-30Z" fill="#f0d49d" />
                <circle
                  cx="320"
                  cy="180"
                  r="7"
                  fill="#142a3a"
                  stroke="#d9c18b"
                />
              </g>
            </>
          )}
        </svg>
      )}
    </div>
  );
}
