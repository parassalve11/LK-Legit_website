import { NextResponse } from "next/server";
import { NEWS_TABS, SOURCES, imageFor, sampleFor } from "@/lib/news";

// Server-side news proxy. The original site called Finnhub straight from the
// browser with the key in a VITE_ variable, which shipped the key to every
// visitor. Here the key never leaves the server.
//
// Every tab is genuinely live: with no API key at all it falls through to
// Google News RSS, which needs no credentials.

export const revalidate = 300; // cache for 5 minutes
const FETCH_TIMEOUT_MS = 8000;
const LIMIT = 3;

function decodeEntities(input = "") {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&") // must be last, or earlier entities double-decode
    .trim();
}

function stripTags(input = "") {
  return decodeEntities(input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

function tagValue(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function shortDate(value) {
  const d = value ? new Date(value) : new Date();
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  return safe.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Google News RSS — keyless, and covers all three categories. */
async function fromGoogleNews(tab) {
  const { query } = SOURCES[tab];
  const url =
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
    `&hl=en-IN&gl=IN&ceid=IN:en`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TradeWithLK/1.0)" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Google News responded ${res.status}`);

  const xml = await res.text();
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, LIMIT);
  if (!blocks.length) throw new Error("No items in feed");

  return blocks.map((m, i) => {
    const block = m[1];
    const publisher = tagValue(block, "source");
    let title = tagValue(block, "title");
    // Google appends " - Publisher" to headlines; drop it, we show it separately.
    if (publisher && title.endsWith(` - ${publisher}`)) {
      title = title.slice(0, -(publisher.length + 3)).trim();
    }

    let excerpt = stripTags(tagValue(block, "description"));
    if (excerpt.startsWith(title)) excerpt = excerpt.slice(title.length).trim();
    if (excerpt.length < 25) excerpt = "";

    return {
      id: tagValue(block, "guid") || `gn-${tab}-${i}`,
      date: shortDate(tagValue(block, "pubDate")),
      title,
      excerpt,
      src: publisher || "Google News",
      // RSS carries no artwork, so use the category's own image pool.
      img: imageFor(tab, i),
      url: tagValue(block, "link"),
    };
  });
}

/**
 * Investing.com public RSS feeds — the primary source. Keyless; each headline
 * links back to the article on Investing.com. Their article images refuse
 * hotlinking (403), so cards use the curated artwork instead.
 */
const INVESTING_FEEDS = {
  "Forex & Global": "https://www.investing.com/rss/news_1.rss", // Forex News
  "Crypto News": "https://www.investing.com/rss/news_301.rss", // Cryptocurrency News
  "Market Updates": "https://www.investing.com/rss/news_25.rss", // Stock Market News
};

async function fromInvesting(tab) {
  const res = await fetch(INVESTING_FEEDS[tab], {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TradeWithLK/1.0)" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Investing.com responded ${res.status}`);

  const xml = await res.text();
  // The feeds mix in Investing.com's own subscription promos; skip those.
  const PROMO = /investingpro|propicks|ai picks|% off|black friday|cyber monday|savings|discount|subscribe/i;
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map((m) => m[1])
    .filter((block) => !PROMO.test(tagValue(block, "title")))
    .slice(0, LIMIT);
  if (!blocks.length) throw new Error("No items in feed");

  return blocks.map((block, i) => {
    // pubDate looks like "2026-11-27 21:25:54" (UTC).
    const rawDate = tagValue(block, "pubDate");
    const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(rawDate) ? `${rawDate.replace(" ", "T")}Z` : rawDate;
    const url = tagValue(block, "link");
    return {
      id: url || `inv-${tab}-${i}`,
      date: shortDate(iso),
      title: tagValue(block, "title"),
      excerpt: stripTags(tagValue(block, "description")),
      src: "Investing.com",
      img: imageFor(tab, i),
      url,
    };
  });
}

/** Finnhub — better data and real article images, but needs a key. */
async function fromFinnhub(tab, key) {
  const category = SOURCES[tab].finnhub;
  const res = await fetch(
    `https://finnhub.io/api/v1/news?category=${category}&token=${key}`,
    { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), next: { revalidate } },
  );
  if (!res.ok) throw new Error(`Finnhub responded ${res.status}`);

  const data = await res.json();
  const items = (Array.isArray(data) ? data : []).slice(0, LIMIT);
  if (!items.length) throw new Error("No articles returned");

  return items.map((item, i) => ({
    id: String(item.id ?? `fh-${tab}-${i}`),
    date: shortDate(item.datetime ? item.datetime * 1000 : null),
    title: item.headline,
    excerpt:
      item.summary?.length > 90 ? `${item.summary.slice(0, 90)}...` : item.summary || "",
    src: item.source || "Finnhub",
    // Always the curated Unsplash artwork, so every card matches the design.
    img: imageFor(tab, i),
    url: item.url,
  }));
}

export async function GET(request) {
  const requested = request.nextUrl.searchParams.get("tab");
  const tab = NEWS_TABS.includes(requested) ? requested : NEWS_TABS[0];
  const key = process.env.FINNHUB_API_KEY;

  try {
    return NextResponse.json({ source: "investing", tab, articles: await fromInvesting(tab) });
  } catch (error) {
    console.warn(`[news] Investing.com failed for "${tab}":`, error?.message);
  }

  if (key) {
    try {
      return NextResponse.json({ source: "finnhub", tab, articles: await fromFinnhub(tab, key) });
    } catch (error) {
      console.warn(`[news] Finnhub failed for "${tab}":`, error?.message);
    }
  }

  try {
    return NextResponse.json({
      source: "google-news",
      tab,
      articles: await fromGoogleNews(tab),
    });
  } catch (error) {
    console.warn(`[news] Google News failed for "${tab}":`, error?.message);
  }

  return NextResponse.json({ source: "sample", tab, articles: sampleFor(tab) });
}
