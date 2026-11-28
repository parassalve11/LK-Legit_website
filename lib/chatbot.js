// Free, rule-based website assistant: button menus, ready answers and
// keyword matching (English + Hinglish). No AI service, no running cost.
// Edit the answers here; the chat window (components/website/ChatWidget.jsx)
// only renders what this file returns.

export const LINKS = {
  youtube: "https://www.youtube.com/@TradewithLK55",
  youtubeVideos: "https://www.youtube.com/@TradewithLK55/videos",
  register: "https://my.bytefx.com/register",
  login: "https://my.bytefx.com/login",
};

// Buttons shown under a bot message. `topic` answers that topic; `lead` starts
// the call-back flow.
const BTN = {
  join: { label: "Join the LK community", topic: "join" },
  bytefx: { label: "Open a ByteFX account", topic: "bytefx" },
  learn: { label: "What does LK teach?", topic: "learn" },
  live: { label: "Daily live trading", topic: "live" },
  fees: { label: "Course fees & batches", topic: "fees" },
  wallet: { label: "Deposit / withdrawal help", topic: "wallet" },
  callback: { label: "📞 Get a call back", lead: true },
  menu: { label: "Main menu", topic: "menu" },
};

export const TOPICS = {
  menu: {
    label: "General enquiry",
    text: "Hi! 👋 I'm the Trade with LK assistant. What would you like help with?",
    buttons: [BTN.join, BTN.bytefx, BTN.learn, BTN.fees, BTN.callback],
  },
  join: {
    label: "Join LK community",
    keywords: ["join", "community", "group", "telegram", "whatsapp group", "member", "judna", "jud", "add me"],
    text:
      "Great choice! Start by subscribing to LK's YouTube channel, where LK trades live every trading day and shares real setups. " +
      "Share your name and number and the team will help you join the LK community.",
    links: [{ label: "Subscribe on YouTube", href: `${LINKS.youtube}?sub_confirmation=1` }],
    buttons: [BTN.callback, BTN.live, BTN.menu],
  },
  bytefx: {
    label: "Open ByteFX account",
    keywords: ["bytefx", "byte fx", "broker", "account", "register", "sign up", "signup", "open", "khata", "khol", "mt5", "metatrader", "terminal", "kyc", "verify", "verification"],
    text:
      "ByteFX is LK's official broker partner. To get started:\n" +
      "1. Register on ByteFX\n" +
      "2. Complete your verification (KYC)\n" +
      "3. Create your MT5 trading account\n" +
      "4. Fund your account and start trading.\n" +
      "Stuck at any step? Ask for a call back and the team will guide you.",
    links: [
      { label: "Register on ByteFX", href: LINKS.register },
      { label: "Log in to ByteFX", href: LINKS.login },
    ],
    buttons: [BTN.callback, BTN.wallet, BTN.menu],
  },
  learn: {
    label: "Learn trading with LK",
    keywords: ["learn", "teach", "course", "class", "mentor", "strategy", "strategies", "intraday", "option", "technical", "price action", "beginner", "seekh", "sikh", "sikhna", "padhai", "study", "lk kaun", "who is lk", "about lk"],
    text:
      "LK is a NISM Certified Research Analyst. LK teaches a rule-based trading system: intraday trading, options trading, technical analysis and price action, " +
      "with risk management, backtesting, journaling and trading psychology. The free lessons are on YouTube, organised as playlists for every stage.",
    links: [{ label: "Watch the lessons", href: LINKS.youtubeVideos }],
    buttons: [BTN.fees, BTN.live, BTN.callback, BTN.menu],
  },
  live: {
    label: "Daily live trading",
    keywords: ["live", "stream", "youtube", "video", "channel", "lecture", "session"],
    text: "LK goes live on YouTube every trading day with real charts and real setups. Subscribe and turn on notifications so you never miss a session.",
    links: [{ label: "Open the YouTube channel", href: LINKS.youtube }],
    buttons: [BTN.join, BTN.learn, BTN.menu],
  },
  fees: {
    label: "Course fees & batches",
    keywords: ["fee", "fees", "price", "cost", "charge", "paid", "free", "batch", "kitna", "kitni", "kitne", "charges", "rupee", "rs", "discount", "offer", "mentorship", "program"],
    text:
      "Course fees and batch dates change from time to time, so the LK team shares the latest details personally. " +
      "Leave your name and number and they'll get back to you.",
    buttons: [BTN.callback, BTN.learn, BTN.menu],
  },
  wallet: {
    label: "Deposit / withdrawal help",
    keywords: ["deposit", "withdraw", "withdrawal", "fund", "funding", "payment", "upi", "bank", "money", "paisa", "paise", "nikal", "nikale", "nikalna", "dalna", "jama", "transfer", "wallet"],
    text:
      "Deposits and withdrawals are done from your ByteFX dashboard (My Wallet). Log in, choose Deposit or Withdraw and follow the steps. " +
      "For any issue with a payment, ask for a call back. Never share your password or OTP with anyone, including us.",
    links: [{ label: "Log in to ByteFX", href: LINKS.login }],
    buttons: [BTN.callback, BTN.bytefx, BTN.menu],
  },
  advice: {
    label: "Trading advice request",
    keywords: ["tip", "tips", "signal", "which stock", "what to buy", "buy or sell", "buy karu", "sell karu", "kaunsa", "konsa", "target", "stoploss", "sure shot", "profit guarantee", "jackpot"],
    text:
      "I can't give buy/sell tips, signals or price targets. Trading involves risk. " +
      "LK teaches you to build your own rule-based system so you can make your own decisions. The lessons on YouTube are the best place to start.",
    links: [{ label: "Watch the lessons", href: LINKS.youtubeVideos }],
    buttons: [BTN.learn, BTN.menu],
  },
  contact: {
    label: "Talk to the team",
    keywords: ["contact", "call", "phone", "number", "talk", "speak", "baat", "sampark", "help", "support", "team", "sir", "human", "agent"],
    text: "Happy to connect you with the LK team. Share your name and number and they'll call you back.",
    buttons: [BTN.callback, BTN.menu],
  },
  thanks: {
    keywords: ["thank", "thanks", "thx", "dhanyavad", "shukriya", "ok", "okay", "great", "nice"],
    text: "You're welcome! 😊 Anything else I can help with?",
    buttons: [BTN.join, BTN.bytefx, BTN.learn, BTN.menu],
  },
  greet: {
    keywords: ["hi", "hello", "hey", "hii", "namaste", "namaskar", "good morning", "good evening", "hola"],
    text: "Hello! 👋 How can I help you today?",
    buttons: [BTN.join, BTN.bytefx, BTN.learn, BTN.fees, BTN.callback],
  },
};

export const FALLBACK = {
  label: "General enquiry",
  text: "I'm not sure about that one. The LK team can answer it for you. Want them to call you back?",
  buttons: [BTN.callback, BTN.menu],
};

function normalise(text) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9ऀ-ॿ ]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

/** Best topic for a typed message, or FALLBACK. Longer keyword hits count more. */
export function matchTopic(text) {
  const t = normalise(text);
  let best = null;
  let bestScore = 0;
  for (const [id, topic] of Object.entries(TOPICS)) {
    if (!topic.keywords) continue;
    let score = 0;
    for (const kw of topic.keywords) {
      // Whole words only, so "hi" doesn't match "which".
      if (t.includes(` ${kw} `) || (kw.length > 4 && t.includes(kw))) score += kw.length;
    }
    // A price question about a course is about fees, not the course itself.
    if (id === "fees") score *= 1.6;
    // Greetings and thanks only win when nothing more specific matched.
    if (id === "greet" || id === "thanks") score *= 0.3;
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }
  return best ? { id: best, ...TOPICS[best] } : { id: "fallback", ...FALLBACK };
}

export function isValidPhone(text) {
  const digits = text.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
