// Every value the original site hardcoded, in one place.
//
// Two jobs:
//   1. The public site renders from these when the database is empty or
//      unreachable, so the site is never blank.
//   2. prisma/seed.js writes them into MySQL, so admin edits start from the
//      exact content that is live today.

export const NAV_ITEMS = [
  { label: "Home", anchor: "#home", order: 0 },
  { label: "Learn", anchor: "#learn", order: 1 },
  { label: "Roadmap", anchor: "#roadmap", order: 2 },
  { label: "Videos", anchor: "#videos", order: 3 },
  { label: "Partner", anchor: "#partner", order: 4 },
  { label: "Tools", anchor: "#tools", order: 5 },
  { label: "News", anchor: "#news", order: 6 },
  { label: "Contact", anchor: "#contact", order: 7 },
];

export const SITE_SETTINGS = {
  siteName: "Trade with LK",
  tagline: "Learn. Analyze. Execute.",
  email: "support@tradewithlk55.com",
  phone: "+91 866 834 9265",
  whatsapp: "",
  address: "India · Worldwide Community",
  footerText:
    "Empowering traders with knowledge, strategies and mindset to navigate the markets with confidence — across stocks, options, gold and crypto.",
  copyright: "© 2026 Trade with LK. All rights reserved.",
  disclaimer:
    "Trade with LK content is educational in nature. Viewers should conduct their own research and risk assessment before making any financial or trading decisions.",
  maintenanceMode: false,
};

export const SOCIAL_LINKS = [
  { platform: "youtube", url: "https://www.youtube.com/@TradewithLK55", order: 0 },
  { platform: "instagram", url: "#", order: 1 },
  { platform: "telegram", url: "#", order: 2 },
  { platform: "twitter", url: "#", order: 3 },
  { platform: "whatsapp", url: "#", order: 4 },
];

// Section order matches the original page exactly.
export const SECTIONS = [
  {
    key: "hero",
    name: "Hero Section",
    order: 0,
    eyebrow: "Learn. Analyze. Execute.",
    title: "MASTER|THE MARKETS|WITH LK",
    subtitle:
      "Premium educational trading content to help you trade smarter, manage risk and grow consistently across stocks, options, gold and crypto markets.",
    fields: [
      { key: "credential", label: "Credential (bold, before the description; empty to hide)", value: "NISM Certified Research Analyst" },
      { key: "primaryButtonText", label: "Primary Button Text", value: "Join Community" },
      { key: "primaryButtonLink", label: "Primary Button Link", value: "#contact" },
      { key: "secondaryButtonText", label: "Secondary Button Text", value: "Watch Videos" },
      { key: "secondaryButtonLink", label: "Secondary Button Link", value: "#videos" },
      { key: "channelName", label: "Channel Name", value: "Trade with LK" },
      { key: "channelSubtitle", label: "Channel Subtitle", value: "Visit our YouTube Channel" },
      { key: "channelHandle", label: "YouTube Handle", value: "@TradewithLK55" },
    ],
  },
  {
    key: "roadmap",
    name: "Why Trade with LK",
    order: 2,
    eyebrow: "Why Trade with LK",
    title: "A trading channel built on",
    subtitle: "discipline, not hype.",
    fields: [
      {
        key: "paragraph1",
        label: "First Paragraph",
        value:
          "Trade with LK is a trading-focused YouTube channel sharing educational content, live trading sessions, market analysis and trading strategies — focused on helping retail traders understand market behavior and learn practical approaches to intraday, options, gold and cryptocurrency trading.",
      },
      {
        key: "paragraph2",
        label: "Second Paragraph",
        value:
          "The creator regularly demonstrates live trades and breaks down setups, entries and exits, market structure and trading psychology — for both beginner and intermediate traders looking to build a repeatable edge.",
      },
      {
        key: "quote",
        label: "Pull Quote",
        value: "Discipline is the bridge between strategy and profitability.",
      },
      { key: "quoteAuthor", label: "Quote Attribution", value: "— Trade with LK" },
    ],
  },
  {
    key: "system",
    name: "Trade a System",
    order: 3,
    eyebrow: "Why most traders stay stuck",
    title: "Stop guessing.",
    subtitle: "Start trading a system.",
    fields: [
      { key: "ctaText", label: "Last Card Link Text", value: "Build your system" },
      { key: "ctaLink", label: "Last Card Link", value: "https://www.youtube.com/@TradewithLK55" },
    ],
  },
  {
    key: "learnlk",
    name: "Learn From LK",
    order: 4,
    eyebrow: "Meet your mentor",
    title: "Learn From",
    subtitle: "LK",
    fields: [
      {
        key: "paragraph1",
        label: "First Paragraph (wrap words in **stars** for bold)",
        value:
          "LK is a **NISM-certified, verified trader** and the educator behind Trade with LK — breaking down **stocks, options, gold and crypto** on live charts. With **390+ videos** and a YouTube community of **38K+ traders**, every session shows **the setup, the entry, the exit** and the reasoning behind it.",
      },
      {
        key: "paragraph2",
        label: "Second Paragraph (wrap words in **stars** for bold)",
        value:
          "The focus is on the mistakes that hold beginners back — **overtrading, no stop loss, no plan** — and fixing them with a **risk-first process**. The goal isn't to hand you tips to copy; it's to teach you to **read the market yourself**.",
      },
      { key: "credentialBadge", label: "Credential Badge (leave empty to hide)", value: "NISM Certified · Verified Trader" },
      { key: "imageUrl", label: "Image URL", value: "/images/lk-mentor-portrait.webp" },
      { key: "imageAlt", label: "Image Alt Text", value: "LK smiling in round glasses and a pastel knit polo" },
      { key: "channelHandle", label: "YouTube Handle", value: "@TradewithLK55" },
      { key: "ctaText", label: "Primary Button Text", value: "Subscribe on YouTube" },
      { key: "ctaLink", label: "Primary Button Link", value: "https://www.youtube.com/@TradewithLK55?sub_confirmation=1" },
      { key: "secondaryCtaText", label: "Secondary Button Text", value: "Watch Latest Videos" },
      { key: "secondaryCtaLink", label: "Secondary Button Link", value: "https://www.youtube.com/@TradewithLK55/videos" },
    ],
  },
  {
    key: "videos",
    name: "YouTube Learning Hub",
    order: 5,
    eyebrow: "YouTube Learning Hub",
    title: "Trade with LK",
    subtitle: "Structured playlists across the entire trader's journey.",
    fields: [
      { key: "titleGold", label: "Highlighted Word", value: "Channel" },
      { key: "channelUrl", label: "YouTube Channel Link", value: "https://www.youtube.com/@TradewithLK55" },
    ],
  },
  {
    key: "partner",
    name: "ByteFx Partnership",
    order: 6,
    eyebrow: "Official Partner",
    title: "Trade with",
    subtitle: "Start your live trading journey with ByteFX and unlock the Trade with LK partner experience.",
    fields: [
      { key: "heading", label: "Big Heading", value: "Partner" },
      { key: "ghostNumber", label: "Background Number", value: "05" },
      { key: "badgeText", label: "Badge Text", value: "Official IB Partner" },
      { key: "headlineLine2", label: "Headline Second Line", value: "ByteFX" },
      { key: "ctaText", label: "Swipe Button Text", value: "Activate Your Trading Terminal" },
      { key: "ctaLink", label: "Swipe Registration Link", value: "https://my.bytefx.com/register" },
      { key: "depositText", label: "Deposit Link Text", value: "Deposit funds" },
      { key: "depositLink", label: "Deposit / Account Login Link", value: "https://my.bytefx.com/login" },
      { key: "unlockLink", label: "Unlock Community Link", value: "#community" },
      { key: "secondaryCtaText", label: "Secondary Link Text", value: "Open Demo Account" },
      { key: "secondaryCtaLink", label: "Secondary Link", value: "https://my.bytefx.com/login" },
      { key: "registerImage", label: "Register Card Illustration", value: "/images/broker-register.webp" },
      { key: "depositImage", label: "Deposit Card Illustration", value: "/images/broker-deposit.webp" },
      { key: "unlockImage", label: "Unlock Card Illustration", value: "/images/broker-unlock.webp" },
      {
        key: "disclaimer1",
        label: "Disclaimer Line 1",
        value: "Check that trading leveraged products is permitted in your country of residence before opening an account.",
      },
      {
        key: "disclaimer2",
        label: "Disclaimer Line 2",
        value: "Trading leveraged products carries a high risk of loss. Educational content only.",
      },
      {
        key: "disclaimer3",
        label: "Disclaimer Line 3 (IB disclosure)",
        value: "Trade with LK is an introducing broker for ByteFX and may receive compensation for clients referred through our links.",
      },
    ],
  },
  {
    key: "dashboard",
    name: "Market Dashboard",
    order: 7,
    eyebrow: "Market Dashboard",
    title: "A trader's",
    subtitle: "command center",
    fields: [],
  },
  {
    key: "tools",
    name: "Trading Tools",
    order: 8,
    eyebrow: "Trading Tools",
    title: "Real calculators,",
    subtitle: "not mockups.",
    fields: [],
  },
  {
    key: "news",
    name: "Market News",
    order: 9,
    eyebrow: "Market News",
    title: "What's",
    subtitle: "moving today",
    fields: [],
  },
  {
    key: "testimonials",
    name: "Testimonials",
    order: 10,
    eyebrow: "Community",
    title: "Traders",
    subtitle: "on the journey",
    fields: [],
  },
  {
    key: "community",
    name: "Community",
    order: 11,
    eyebrow: "Join the Community",
    title: "Where LK",
    subtitle: "traders meet",
    fields: [],
  },
  {
    key: "contact",
    name: "Contact",
    order: 12,
    eyebrow: "Contact",
    title: "Talk to",
    subtitle: "the LK team",
    fields: [
      { key: "panelTitle", label: "Side Panel Heading", value: "Reach out directly" },
      { key: "panelSubtitle", label: "Side Panel Subheading", value: "We reply to serious learners within 48 hours." },
    ],
  },
];

export const HERO_CHECKS = [
  "Intraday Trading",
  "Options Trading",
  "Technical Analysis",
  "Price Action Strategies",
  "Market Education",
];

export const HERO_STATS = [
  { label: "India", value: "India", suffix: "", iconKey: "map-pin", countUp: false, order: 0, meta: "Worldwide Community" },
  { label: "Joined", value: "15 Aug 2021", suffix: "", iconKey: "calendar", countUp: false, order: 1, meta: "Joined" },
  { label: "Subscribers", value: "38200", suffix: "+", iconKey: "users", countUp: true, order: 2, meta: "Subscribers" },
  { label: "Videos", value: "393", suffix: "+", iconKey: "video", countUp: true, order: 3, meta: "Videos" },
  { label: "Views", value: "898400", suffix: "+", iconKey: "eye", countUp: true, order: 4, meta: "Views" },
];

export const ROADMAP_STATS = [
  { label: "Subscribers", value: "38200", suffix: "+", countUp: true, order: 0 },
  { label: "Videos", value: "393", suffix: "+", countUp: true, order: 1 },
  { label: "Views", value: "898400", suffix: "+", countUp: true, order: 2 },
  { label: "Channel Started", value: "2021", suffix: "", countUp: false, order: 3 },
];

// Cards in the "Stop guessing" carousel. `iconKey` picks the animated
// illustration at the top of each card (see components/website/TradeSystem.jsx).
export const SYSTEM_STEPS = [
  { iconKey: "visual-hesitate", meta: "The problem", title: "Trading on emotion is the real problem.", body: "When every decision is made live, every decision comes with doubt.", order: 0 },
  { iconKey: "visual-checklist", meta: "Why you're stuck", title: "Plenty of setups, zero structure.", body: "You already know the patterns. The missing piece is a repeatable process.", order: 1 },
  { iconKey: "visual-loop", meta: "The loop", title: "The same cycle, week after week.", body: "Execution that depends on mood keeps bringing back the same mistakes.", order: 2 },
  { iconKey: "visual-curves", meta: "Human bias", title: "Beginners hope. Professionals repeat.", body: "“This looks good” always loses to “my plan takes this every time.”", order: 3 },
  { iconKey: "visual-compare", meta: "Now vs. next", title: "From guessing to knowing.", body: "Replace endless tweaking with rules backed by your own trade data.", order: 4 },
  { iconKey: "visual-rule", meta: "The fix", title: "Rule-based execution.", body: "Clear if/then rules for every scenario — so you act instead of hesitate.", order: 5 },
  { iconKey: "visual-stack", meta: "The system", title: "One complete trading system.", body: "Strategy, backtesting, risk, journaling and psychology working as one.", order: 6 },
  { iconKey: "visual-pulse", meta: "The result", title: "Calm. Disciplined. In control.", body: "Open your Gold or Nifty chart and know exactly what to do next.", order: 7 },
];

export const LEARN_STATS = [
  { label: "Subscribers", value: "38200", suffix: "+", iconKey: "users", countUp: true, order: 0 },
  { label: "Videos", value: "393", suffix: "+", iconKey: "video", countUp: true, order: 1 },
  { label: "Live Sessions", value: "Daily", suffix: "", iconKey: "play", countUp: false, order: 2 },
];

export const CATEGORIES = [
  { iconKey: "line-chart", title: "Stock Market Education", order: 0 },
  { iconKey: "trending-up", title: "Intraday Trading", order: 1 },
  { iconKey: "bar-chart-3", title: "Options Trading", order: 2 },
  { iconKey: "ruler", title: "Technical Analysis", order: 3 },
  { iconKey: "newspaper", title: "Market Updates", order: 4 },
  { iconKey: "brain", title: "Trading Psychology", order: 5 },
];

export const VIDEOS = [
  { youtubeId: "BnV03rK-lvg", title: "AI Traders vs Human Traders | Is AI taking over the forex market?", duration: "3:05", views: "", order: 0 },
  { youtubeId: "DsyFNxTuL1Q", title: "Why 90% Traders Fail in Trading | Why Forex Really Moves?", duration: "3:52", views: "", order: 1 },
  { youtubeId: "s7iK_IHrQ94", title: "Best Platform To Trade Gold & Crypto | ByteFX", duration: "9:20", views: "", order: 2 },
  { youtubeId: "Kch7zbVsLXA", title: "GOLD Weekly Analysis | Crypto Live Trading", duration: "43:14", views: "", order: 3 },
];

export const PARTNER_FEATURES = [
  { iconKey: "shield-check", title: "Guided Setup", body: "Faster onboarding and structured support from account opening to your first trade.", meta: "highlighted", order: 0 },
  { iconKey: "trending-up", title: "Trade Live Markets", body: "Forex, gold, crypto, indices and more from one account environment.", meta: "", order: 1 },
  { iconKey: "users", title: "LK Community", body: "Live sessions, guidance and support from the Trade with LK community.", meta: "", order: 2 },
  { iconKey: "zap", title: "Quick Start", body: "Register, fund and start on demo or live without delays.", meta: "", order: 3 },
];

export const PARTNER_STATS = [
  { label: "Broker", value: "ByteFx", order: 0 },
  { label: "Markets", value: "Forex / Gold / Crypto", order: 1 },
  { label: "Min Deposit", value: "$100", order: 2 },
  { label: "Max Leverage", value: "1:500", order: 3 },
  { label: "Support", value: "LK Guided", order: 4 },
  { label: "Access", value: "Live + Demo", order: 5 },
];

export const UNLOCK_STEPS = [
  { iconKey: "users", title: "Register", body: "Create your free trading account", order: 0 },
  { iconKey: "dollar-sign", title: "Deposit", body: "Sign in to fund your account", order: 1 },
  { iconKey: "sparkles", title: "Unlock", body: "Connect with the LK community", order: 2 },
];

export const COMMUNITY_LINKS = [
  { iconKey: "send", title: "Telegram", meta: "22K+", body: "Join Channel", href: "#", order: 0 },
  { iconKey: "youtube", title: "YouTube", meta: "38K+", body: "Subscribe", href: "https://www.youtube.com/@TradewithLK55", order: 1 },
  { iconKey: "message-circle", title: "WhatsApp", meta: "5K+", body: "Join Group", href: "#", order: 2 },
  { iconKey: "users", title: "Trading Community", meta: "12K+", body: "Get Access", href: "#", order: 3 },
];

export const TESTIMONIALS = [
  { name: "Rohan S.", role: "Options Trader", quote: "The way LK breaks down live setups changed how I look at option chains. Discipline first, profits follow.", order: 0 },
  { name: "Ananya P.", role: "Swing Trader", quote: "Finally a channel that treats you like an adult. No hype, just structure, risk and repetition.", order: 1 },
  { name: "Vikram J.", role: "Intraday Trader", quote: "The pre-market sessions are gold. I've cut my losing days in half in three months.", order: 2 },
  { name: "Meera K.", role: "Beginner", quote: "Started from zero. The roadmap gave me clarity I didn't get from a year of scattered YouTube videos.", order: 3 },
];

// Market sessions are stored in UTC, exactly as the original component computed them.
export const MARKET_SESSIONS = [
  { kind: "market", key: "sydney", label: "Sydney", openTime: "21:00", closeTime: "06:00", symbol: "FX:AUDUSD", order: 0 },
  { kind: "market", key: "tokyo", label: "Tokyo", openTime: "00:00", closeTime: "09:00", symbol: "FX:USDJPY", order: 1 },
  { kind: "market", key: "london", label: "London", openTime: "07:00", closeTime: "16:00", symbol: "FX:GBPUSD", order: 2 },
  { kind: "market", key: "newyork", label: "New York", openTime: "12:00", closeTime: "21:00", symbol: "FX:EURUSD", order: 3 },
];

export const WEEKLY_SESSIONS = [
  { kind: "weekly", label: "Pre-market Analysis", day: "Mon–Fri", time: "9:15 AM IST", topic: "Pre-market Analysis", order: 0 },
  { kind: "weekly", label: "Options Deep Dive", day: "Tue", time: "8:30 PM IST", topic: "Options Deep Dive", order: 1 },
  { kind: "weekly", label: "Live Trade Review", day: "Thu", time: "8:30 PM IST", topic: "Live Trade Review", order: 2 },
  { kind: "weekly", label: "Weekly Roadmap", day: "Sat", time: "11:00 AM IST", topic: "Weekly Roadmap", order: 3 },
];

export const SEO = {
  pageKey: "home",
  title: "Trade with LK — Master the Markets with LK",
  description:
    "Premium educational trading content for Indian stock, options, gold and crypto traders. Learn. Analyze. Execute. Repeat.",
  noIndex: false,
};

export const FOOTER_COLUMNS = [
  { title: "Quick Links", links: ["Home", "Learn", "Roadmap", "Videos"] },
  { title: "Resources", links: ["Partner", "Tools", "News", "Contact"] },
  { title: "Legal", links: ["Privacy Policy", "Terms & Conditions", "Disclaimer"] },
];

/** Fallback news, used when Finnhub has no key or is rate limited. */
export const FALLBACK_NEWS = [
  {
    id: "f1",
    date: "24 Jul",
    title: "Nifty closes above 24,800 amid strong FII inflows",
    excerpt: "Broad-based rally led by financials and IT.",
    src: "Market Desk",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=70",
    url: "#",
  },
  {
    id: "f2",
    date: "23 Jul",
    title: "Gold hits fresh 3-month high on rate-cut bets",
    excerpt: "MCX gold breaches ₹72K as dollar softens.",
    src: "Commodities",
    img: "https://images.unsplash.com/photo-1610375461369-d1859cc71ee1?w=800&q=70",
    url: "#",
  },
  {
    id: "f3",
    date: "22 Jul",
    title: "Crude oil slips on softer demand outlook",
    excerpt: "Brent trades near $80 as inventories rise.",
    src: "Energy",
    img: "https://images.unsplash.com/photo-1582486225644-b5b6d4a1a3f0?w=800&q=70",
    url: "#",
  },
];
