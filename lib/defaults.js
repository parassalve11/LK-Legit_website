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
  siteName: "Trade with LK55",
  tagline: "Learn. Analyze. Execute.",
  email: "support@tradewithlk55.com",
  phone: "+91 00000 00000",
  whatsapp: "",
  address: "India · Worldwide Community",
  footerText:
    "Empowering traders with knowledge, strategies and mindset to navigate the markets with confidence — across stocks, options, gold and crypto.",
  copyright: "© 2026 Trade with LK55. All rights reserved.",
  disclaimer:
    "Trade with LK55 content is educational in nature. Viewers should conduct their own research and risk assessment before making any financial or trading decisions.",
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
      { key: "primaryButtonText", label: "Primary Button Text", value: "Join Community" },
      { key: "primaryButtonLink", label: "Primary Button Link", value: "#contact" },
      { key: "secondaryButtonText", label: "Secondary Button Text", value: "Watch Videos" },
      { key: "secondaryButtonLink", label: "Secondary Button Link", value: "#videos" },
      { key: "channelName", label: "Channel Name", value: "Trade with LK55" },
      { key: "channelSubtitle", label: "Channel Subtitle", value: "Visit our YouTube Channel" },
      { key: "channelHandle", label: "YouTube Handle", value: "@TradewithLK55" },
    ],
  },
  {
    key: "master",
    name: "What You'll Master",
    order: 1,
    eyebrow: "What you'll master",
    title: "Skills that separate the",
    subtitle: "consistent from the crowd",
    fields: [],
  },
  {
    key: "roadmap",
    name: "Why Trade with LK55",
    order: 2,
    eyebrow: "Why Trade with LK55",
    title: "A trading channel built on",
    subtitle: "discipline, not hype.",
    fields: [
      {
        key: "paragraph1",
        label: "First Paragraph",
        value:
          "Trade with LK55 is a trading-focused YouTube channel sharing educational content, live trading sessions, market analysis and trading strategies — focused on helping retail traders understand market behavior and learn practical approaches to intraday, options, gold and cryptocurrency trading.",
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
    key: "videos",
    name: "YouTube Learning Hub",
    order: 3,
    eyebrow: "YouTube Learning Hub",
    title: "Trade with LK55",
    subtitle: "Structured playlists across the entire trader's journey.",
    fields: [
      { key: "titleGold", label: "Highlighted Word", value: "Channel" },
      { key: "channelUrl", label: "YouTube Channel Link", value: "https://www.youtube.com/@TradewithLK55" },
    ],
  },
  {
    key: "partner",
    name: "ByteFx Partnership",
    order: 4,
    eyebrow: "Official Partner",
    title: "Trade with",
    subtitle: "Start your live trading journey with ByteFx and unlock the partner trading experience.",
    fields: [
      { key: "badgeText", label: "Badge Text", value: "Most Popular Broker" },
      { key: "headlineLine2", label: "Headline Second Line", value: "ByteFx" },
      { key: "ctaText", label: "Primary Button Text", value: "Register with ByteFx" },
      { key: "ctaLink", label: "Primary Button Link", value: "https://my.bytefx.com/register" },
      { key: "secondaryCtaText", label: "Secondary Button Text", value: "Open Demo Account" },
      { key: "secondaryCtaLink", label: "Secondary Button Link", value: "https://my.bytefx.com/login" },
    ],
  },
  {
    key: "dashboard",
    name: "Market Dashboard",
    order: 5,
    eyebrow: "Market Dashboard",
    title: "A trader's",
    subtitle: "command center",
    fields: [],
  },
  {
    key: "tools",
    name: "Trading Tools",
    order: 6,
    eyebrow: "Trading Tools",
    title: "Real calculators,",
    subtitle: "not mockups.",
    fields: [],
  },
  {
    key: "news",
    name: "Market News",
    order: 7,
    eyebrow: "Market News",
    title: "What's",
    subtitle: "moving today",
    fields: [],
  },
  {
    key: "testimonials",
    name: "Testimonials",
    order: 8,
    eyebrow: "Community",
    title: "Traders",
    subtitle: "on the journey",
    fields: [],
  },
  {
    key: "community",
    name: "Community",
    order: 9,
    eyebrow: "Join the Community",
    title: "Where LK55",
    subtitle: "traders meet",
    fields: [],
  },
  {
    key: "contact",
    name: "Contact",
    order: 10,
    eyebrow: "Contact",
    title: "Talk to",
    subtitle: "the LK55 team",
    fields: [
      { key: "panelTitle", label: "Side Panel Heading", value: "Reach out directly" },
      { key: "panelSubtitle", label: "Side Panel Subheading", value: "We reply to serious learners within 48 hours." },
    ],
  },
];

export const HERO_CHECKS = [
  "Stock Market Trading",
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
  { label: "Videos", value: "223", suffix: "+", iconKey: "video", countUp: true, order: 3, meta: "Videos" },
  { label: "Views", value: "898400", suffix: "+", iconKey: "eye", countUp: true, order: 4, meta: "Views" },
];

export const ROADMAP_STATS = [
  { label: "Subscribers", value: "38200", suffix: "+", countUp: true, order: 0 },
  { label: "Videos", value: "223", suffix: "+", countUp: true, order: 1 },
  { label: "Views", value: "898400", suffix: "+", countUp: true, order: 2 },
  { label: "Channel Started", value: "2021", suffix: "", countUp: false, order: 3 },
];

export const MASTER_ITEMS = [
  { iconKey: "graduation-cap", title: "Trading Education", body: "Proven trading concepts, risk management and market psychology.", order: 0 },
  { iconKey: "line-chart", title: "Technical Analysis", body: "Chart patterns, support/resistance, liquidity and price action.", order: 1 },
  { iconKey: "trending-up", title: "Options Trading", body: "Option buying, selling and strategic setups with confidence.", order: 2 },
  { iconKey: "bar-chart-3", title: "Market Insights", body: "Daily market analysis, key levels and educational breakdowns.", order: 3 },
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
  { youtubeId: "kJQP7kiw5Fk", title: "How to Read Candlestick Patterns Like a Pro", duration: "12:34", views: "12K", order: 0 },
  { youtubeId: "9bZkp7q19f0", title: "Options Trading Masterclass — Buyer vs Seller", duration: "18:02", views: "8.4K", order: 1 },
  { youtubeId: "hY7m5jjJ9mM", title: "Intraday Breakout Strategy — Live Setup", duration: "22:47", views: "24K", order: 2 },
  { youtubeId: "3JZ_D3ELwOQ", title: "Risk Management: The Real Edge", duration: "09:11", views: "5.1K", order: 3 },
];

export const PARTNER_FEATURES = [
  { iconKey: "shield-check", title: "Regulated Setup", body: "A trusted broker setup with faster onboarding and structured support.", meta: "highlighted", order: 0 },
  { iconKey: "trending-up", title: "Trade Live Markets", body: "Forex, gold, crypto, indices, and more from one account environment.", meta: "", order: 1 },
  { iconKey: "bar-chart-2", title: "Optimized Flow", body: "Use the same partner path linked across the trading ecosystem.", meta: "", order: 2 },
  { iconKey: "zap", title: "Quick Start", body: "Register, fund, and begin applying live market ideas without delays.", meta: "", order: 3 },
];

export const PARTNER_STATS = [
  { label: "Broker", value: "ByteFx", order: 0 },
  { label: "Markets", value: "Forex / Gold / Crypto", order: 1 },
  { label: "Min Deposit", value: "$100", order: 2 },
  { label: "Max Leverage", value: "1:500", order: 3 },
  { label: "Support", value: "Dedicated", order: 4 },
  { label: "Access", value: "Live + Demo", order: 5 },
];

export const UNLOCK_STEPS = [
  { iconKey: "users", title: "Register", body: "Create your free trading account", order: 0 },
  { iconKey: "dollar-sign", title: "Deposit", body: "Fund your account minimum deposit", order: 1 },
  { iconKey: "sparkles", title: "Unlock", body: "Get full access to live trading perks", order: 2 },
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
  title: "Trade with LK55 — Master the Markets with LK",
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
