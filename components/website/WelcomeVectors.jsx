// Vector artwork for the welcome popup: a gold coin (used by the floating
// coins behind LK) and a gold-bar stack. Plain SVG, so it stays sharp at any
// size and weighs almost nothing.

/** Hidden sprite that defines the coin once; <Coin> instances reference it. */
export function CoinSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="lkw-coin-face" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset=".35" stopColor="#f6cf63" />
          <stop offset=".75" stopColor="#d49a2a" />
          <stop offset="1" stopColor="#9c6a14" />
        </radialGradient>
        <linearGradient id="lkw-coin-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".5" stopColor="#b9831f" />
          <stop offset="1" stopColor="#6e4a0c" />
        </linearGradient>
        <symbol id="lkw-coin" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="31" fill="url(#lkw-coin-rim)" />
          <circle cx="32" cy="32" r="26.5" fill="url(#lkw-coin-face)" />
          <circle cx="32" cy="32" r="22" fill="none" stroke="#a8761c" strokeWidth="1.4" strokeDasharray="2 2.4" opacity=".7" />
          {/* rising candlesticks */}
          <g fill="#8a5a10">
            <rect x="20" y="33" width="5" height="10" rx="1" />
            <rect x="22" y="29" width="1" height="18" />
            <rect x="29.5" y="27" width="5" height="12" rx="1" />
            <rect x="31.5" y="23" width="1" height="20" />
            <rect x="39" y="20" width="5" height="12" rx="1" />
            <rect x="41" y="16" width="1" height="20" />
          </g>
          <ellipse cx="24" cy="19" rx="9" ry="4" fill="#fff" opacity=".35" transform="rotate(-30 24 19)" />
        </symbol>
      </defs>
    </svg>
  );
}

export function Coin({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <use href="#lkw-coin" />
    </svg>
  );
}

function Bar({ x, y, id }) {
  return (
    <g>
      <polygon points={`${x + 10},${y} ${x + 62},${y} ${x + 70},${y + 12} ${x + 2},${y + 12}`} fill={`url(#${id}-top)`} />
      <polygon points={`${x + 2},${y + 12} ${x + 70},${y + 12} ${x + 72},${y + 30} ${x},${y + 30}`} fill={`url(#${id}-front)`} />
      <polyline
        points={`${x + 2},${y + 12} ${x + 70},${y + 12}`}
        stroke="#fff6d0"
        strokeWidth=".8"
        opacity=".7"
      />
      <text
        x={x + 36}
        y={y + 25}
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="1.2"
        fill="#7a4f0c"
        opacity=".75"
        fontFamily="Arial, sans-serif"
      >
        999.9
      </text>
    </g>
  );
}

/** Stack of three gold bars with two coins in front. */
export function GoldStack({ className }) {
  const id = "lkw-bar";
  return (
    <svg className={className} viewBox="0 0 210 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b3" />
          <stop offset="1" stopColor="#f2c14e" />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0b941" />
          <stop offset=".55" stopColor="#c98b22" />
          <stop offset="1" stopColor="#8f5d10" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d79b2c" />
          <stop offset="1" stopColor="#7a4e0b" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="85%" r="60%">
          <stop offset="0" stopColor="#f5c451" stopOpacity=".35" />
          <stop offset="1" stopColor="#f5c451" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="105" cy="132" rx="100" ry="16" fill={`url(#${id}-glow)`} />

      <Bar x={18} y={90} id={id} />
      <Bar x={92} y={90} id={id} />
      <Bar x={55} y={62} id={id} />

      {/* coin lying flat */}
      <ellipse cx="160" cy="137" rx="26" ry="8.5" fill={`url(#${id}-edge)`} />
      <ellipse cx="160" cy="133" rx="26" ry="8.5" fill="url(#lkw-coin-face)" />
      <ellipse cx="160" cy="133" rx="19" ry="5.5" fill="none" stroke="#a8761c" strokeWidth=".9" opacity=".7" />

      {/* coin standing, leaning on the stack */}
      <g transform="rotate(-12 178 104)">
        <use href="#lkw-coin" x="152" y="78" width="52" height="52" />
      </g>

      {/* sparkles */}
      <g fill="#fff6d0">
        <path d="M60 54 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" opacity=".9" />
        <path d="M196 70 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4z" opacity=".75" />
      </g>
    </svg>
  );
}
