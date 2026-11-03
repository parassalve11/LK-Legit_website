// News sources and artwork for the Market News section.
//
// Each tab resolves through three tiers, in order:
//   1. Finnhub          — only if FINNHUB_API_KEY is set. Real articles + images.
//   2. Google News RSS  — no API key needed, works out of the box.
//   3. Sample articles  — if both are unreachable, so the section never empties.

export const NEWS_TABS = ["Market Updates", "Crypto News", "Forex & Global"];

/** Unsplash photo IDs, each verified to resolve. */
const IMAGES = {
  "Market Updates": [
    "photo-1611974789855-9c2a0a7236a3",
    "photo-1590283603385-17ffb3a7f29f",
    "photo-1559526324-4b87b5e36e44",
    "photo-1590283603385-17ffb3a7f29f",
  ],
  "Crypto News": [
    "photo-1621761191319-c6fb62004040",
    "photo-1640340434855-6084b1f4901c",
    "photo-1642104704074-907c0698cbd9",
    "photo-1620266757065-5814239881fd",
  ],
  "Forex & Global": [
    "photo-1518546305927-5a555bb7020d",
    "photo-1591994843349-f415893b3a6b",
    "photo-1560221328-12fe60f83ab8",
    "photo-1554260570-e9689a3418b8",
  ],
};

export const SOURCES = {
  "Market Updates": {
    finnhub: "general",
    query: "stock market sensex nifty india",
  },
  "Crypto News": {
    finnhub: "crypto",
    query: "cryptocurrency bitcoin ethereum",
  },
  "Forex & Global": {
    finnhub: "forex",
    query: "forex currency global markets",
  },
};

/** Deterministic per-card image so a tab's three cards never repeat. */
export function imageFor(tab, index) {
  const pool = IMAGES[tab] || IMAGES["Market Updates"];
  return `https://images.unsplash.com/${pool[index % pool.length]}?w=800&q=70&auto=format&fit=crop`;
}

// Sample cards. Deliberately evergreen and attributed to the LK55 desk rather
// than invented reporting from a real news agency.
export const SAMPLE_NEWS = {
  "Market Updates": [
    {
      title: "How index levels are built from support and resistance",
      excerpt: "Reading the levels that matter before the session opens.",
      src: "LK55 Market Desk",
    },
    {
      title: "Position sizing when volatility expands",
      excerpt: "Why risk per trade should shrink as ranges widen.",
      src: "LK55 Market Desk",
    },
    {
      title: "Reading volume around the opening range",
      excerpt: "What participation tells you about a breakout.",
      src: "LK55 Market Desk",
    },
  ],
  "Crypto News": [
    {
      title: "Understanding liquidity in crypto market structure",
      excerpt: "Where orders rest and why price returns to them.",
      src: "LK55 Market Desk",
    },
    {
      title: "Managing risk across a 24-hour market",
      excerpt: "Session boundaries still matter when the market never closes.",
      src: "LK55 Market Desk",
    },
    {
      title: "Spot versus derivatives: what moves first",
      excerpt: "Following the leading venue during fast moves.",
      src: "LK55 Market Desk",
    },
  ],
  "Forex & Global": [
    {
      title: "Why session overlaps carry the day's range",
      excerpt: "London and New York overlap does the heavy lifting.",
      src: "LK55 Market Desk",
    },
    {
      title: "Trading around scheduled economic releases",
      excerpt: "Planning entries when the calendar is the catalyst.",
      src: "LK55 Market Desk",
    },
    {
      title: "Currency strength as a directional filter",
      excerpt: "Comparing pairs before committing to a side.",
      src: "LK55 Market Desk",
    },
  ],
};

export function sampleFor(tab) {
  const list = SAMPLE_NEWS[tab] || SAMPLE_NEWS["Market Updates"];
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return list.map((a, i) => ({
    id: `sample-${tab}-${i}`,
    date: today,
    title: a.title,
    excerpt: a.excerpt,
    src: a.src,
    img: imageFor(tab, i),
    url: "#",
  }));
}
