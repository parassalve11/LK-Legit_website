// Brand-coloured social badges. Simplified glyphs (not official logo files)
// on each platform's recognisable colour, so the icons read instantly.

const GLYPHS = {
  youtube: (
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" />
    </>
  ),
  telegram: (
    <path d="M20.7 4.3 2.9 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.7 5.4c.2.6.4.8.9.8s.6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.5.2 1.7-.8l3-14.2c.3-1.3-.5-1.8-1.6-1.3ZM8.6 13.8l9.4-5.9c.4-.3.9-.1.5.3l-7.9 7.1-.3 3.3-1.7-4.8Z" />
  ),
  twitter: (
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.2 4.7H5.4l11.3 14.5Z" />
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
  ),
  facebook: (
    <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3A22 22 0 0 0 14.6 2C12.2 2 10.5 3.5 10.5 6.2v2.3H8V12h2.5v10H14V12h2.7l.4-3.5H14Z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.75Z" />
  ),
  globe: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4ZM4.3 14a8 8 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3Zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16ZM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8Zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4Zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4Zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6Zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8 8 0 0 1 0 4h-3.4Z" />
  ),
};

export const BRAND = {
  youtube: { bg: "#FF0000", glow: "rgba(255,0,0,0.55)", label: "YouTube" },
  instagram: {
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    glow: "rgba(214,36,159,0.55)",
    label: "Instagram",
  },
  telegram: { bg: "#229ED9", glow: "rgba(34,158,217,0.55)", label: "Telegram" },
  twitter: { bg: "#000000", glow: "rgba(255,255,255,0.25)", label: "X (Twitter)", ring: true },
  whatsapp: { bg: "#25D366", glow: "rgba(37,211,102,0.55)", label: "WhatsApp" },
  facebook: { bg: "#1877F2", glow: "rgba(24,119,242,0.55)", label: "Facebook" },
  linkedin: { bg: "#0A66C2", glow: "rgba(10,102,194,0.55)", label: "LinkedIn" },
  globe: { bg: "#3a3428", glow: "rgba(245,196,81,0.4)", label: "Website" },
};

// Accept loose platform names ("x", "Twitter", "send", "message-circle"...).
const ALIASES = {
  x: "twitter",
  send: "telegram",
  "message-circle": "whatsapp",
  fb: "facebook",
  yt: "youtube",
};

export function brandKey(platform) {
  const k = String(platform || "").toLowerCase();
  const key = ALIASES[k] || k;
  return GLYPHS[key] ? key : "globe";
}

export function SocialGlyph({ platform, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {GLYPHS[brandKey(platform)]}
    </svg>
  );
}

/** A round/rounded brand-coloured badge with a white glyph. */
export default function SocialIcon({ platform, size = "h-9 w-9", iconSize = "h-4 w-4", rounded = "rounded-full", className = "" }) {
  const b = BRAND[brandKey(platform)];
  return (
    <span
      className={`social-brand grid shrink-0 place-items-center text-white ${size} ${rounded} ${className}`}
      style={{
        background: b.bg,
        "--brand-glow": b.glow,
        boxShadow: b.ring ? "inset 0 0 0 1px rgba(255,255,255,0.35)" : undefined,
      }}
    >
      <SocialGlyph platform={platform} className={iconSize} />
    </span>
  );
}
