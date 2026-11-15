import { useId } from "react";

/** A symbolic shadow lantern, rather than a claimed historical reconstruction. */
export function LanternScene() {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className="brand-lantern-scene"
      viewBox="0 0 560 440"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-light`}>
          <stop stopColor="#efc277" stopOpacity=".3" />
          <stop offset="1" stopColor="#efc277" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#a4763e" stopOpacity=".08" />
          <stop offset=".5" stopColor="#f4d29b" stopOpacity=".2" />
          <stop offset="1" stopColor="#a4763e" stopOpacity=".08" />
        </linearGradient>
        <path id={`${id}-star`} d="m0-7 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
      </defs>
      <circle cx="280" cy="229" r="210" fill={`url(#${id}-light)`} />
      <path
        d="M87 344V210c0-84 84-119 193-166 109 47 193 82 193 166v134"
        stroke="#b8a67b"
        strokeOpacity=".19"
      />
      <path
        d="M105 344V214c0-75 76-107 175-151 99 44 175 76 175 151v130"
        stroke="#b8a67b"
        strokeOpacity=".11"
      />
      <ellipse
        cx="280"
        cy="263"
        rx="223"
        ry="83"
        transform="rotate(-22 280 263)"
        stroke="#8ac9c4"
        strokeOpacity=".24"
        strokeDasharray="3 8"
      />
      <path
        d="M61 321c109-6 209-111 277-178s119-62 148-43"
        stroke="#d7b775"
        strokeOpacity=".25"
      />
      <g fill="#f4d7a1">
        <use href={`#${id}-star`} transform="translate(92 171)" />
        <use href={`#${id}-star`} transform="translate(441 143) scale(.7)" />
        <use href={`#${id}-star`} transform="translate(458 314) scale(.6)" />
        <circle cx="146" cy="116" r="1.6" />
        <circle cx="402" cy="83" r="1.4" />
        <circle cx="112" cy="278" r="1.8" />
        <circle cx="422" cy="242" r="1.4" />
        <circle cx="175" cy="197" r="1.2" />
        <circle cx="365" cy="371" r="1.4" />
      </g>
      <path
        d="M259 117V99a21 21 0 0 1 42 0v18"
        stroke="#d7b775"
        strokeWidth="2.5"
      />
      <path
        d="m213 152 33-35h68l33 35"
        fill="#b9945e"
        fillOpacity=".09"
        stroke="#d7b775"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M205 160h150v150c0 17-34 29-75 29s-75-12-75-29Z"
        fill={`url(#${id}-paper)`}
        stroke="#d9bb83"
        strokeWidth="2"
      />
      <ellipse
        cx="280"
        cy="160"
        rx="75"
        ry="14"
        fill="#142329"
        stroke="#d9bb83"
        strokeWidth="2"
      />
      <path
        d="M230 175v143m100-143v143M206 307c39 17 109 17 148 0M238 348h84"
        stroke="#d9bb83"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse
        cx="280"
        cy="218"
        rx="57"
        ry="12"
        stroke="#d1b887"
        strokeOpacity=".5"
      />
      <path d="M245 218v25m69-25v35" stroke="#d1b887" strokeOpacity=".5" />
      <use
        href={`#${id}-star`}
        transform="translate(245 250) scale(1.2)"
        fill="#f4d8a1"
        fillOpacity=".55"
      />
      <use
        href={`#${id}-star`}
        transform="translate(314 260) scale(.8)"
        fill="#96d2c6"
        fillOpacity=".7"
      />
      <circle cx="280" cy="270" r="52" fill={`url(#${id}-light)`} />
      <path
        d="M280 244c-4 12-12 14-10 25 2 12 17 12 20 1 2-9-7-13-10-26Z"
        fill="#f5d49b"
      />
      <path d="M274 282h12v28h-12Z" fill="#ead4ad" />
      <path
        d="M264 313h32"
        stroke="#d9bb83"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="280"
        cy="359"
        rx="107"
        ry="9"
        fill="#030c15"
        fillOpacity=".32"
      />
      <path d="M155 393h250" stroke="#a7c4c4" strokeOpacity=".13" />
    </svg>
  );
}
