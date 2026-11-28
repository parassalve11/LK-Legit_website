"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "@/components/common/icons";
import { NEWS_TABS, sampleFor } from "@/lib/news";
import { cn } from "@/lib/utils";
import TradingViewFrame from "@/components/common/TradingViewFrame";

const TABS = NEWS_TABS;

// Live prices beside the headlines (TradingView's free Market Overview embed).
// Only symbols TradingView allows in free embeds; NSE/MCX feeds are licensed.
const MARKETS_CONFIG = {
  colorTheme: "dark",
  dateRange: "1D",
  showChart: true,
  isTransparent: true,
  showSymbolLogo: true,
  showFloatingTooltip: true,
  plotLineColorGrowing: "rgba(245, 196, 81, 1)",
  plotLineColorFalling: "rgba(245, 196, 81, 1)",
  belowLineFillColorGrowing: "rgba(245, 196, 81, 0.12)",
  belowLineFillColorFalling: "rgba(245, 196, 81, 0.12)",
  belowLineFillColorGrowingBottom: "rgba(245, 196, 81, 0)",
  belowLineFillColorFallingBottom: "rgba(245, 196, 81, 0)",
  gridLineColor: "rgba(212, 175, 55, 0.06)",
  scaleFontColor: "rgba(201, 196, 184, 1)",
  symbolActiveColor: "rgba(245, 196, 81, 0.12)",
  tabs: [
    {
      title: "Indices",
      symbols: [
        { s: "FOREXCOM:DJI", d: "Dow Jones" },
        { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
        { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
        { s: "BSE:SENSEX", d: "Sensex" },
      ],
    },
    {
      title: "Commodities",
      symbols: [
        { s: "OANDA:XAUUSD", d: "Gold" },
        { s: "TVC:SILVER", d: "Silver" },
        { s: "TVC:USOIL", d: "Crude Oil" },
        { s: "TVC:UKOIL", d: "Brent Oil" },
      ],
    },
    {
      title: "Forex",
      symbols: [
        { s: "FX:EURUSD", d: "EUR / USD" },
        { s: "FX:GBPUSD", d: "GBP / USD" },
        { s: "FX:USDJPY", d: "USD / JPY" },
        { s: "FX_IDC:USDINR", d: "USD / INR" },
      ],
    },
    {
      title: "Crypto",
      symbols: [
        { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
        { s: "BINANCE:ETHUSDT", d: "Ethereum" },
        { s: "BINANCE:SOLUSDT", d: "Solana" },
        { s: "BINANCE:XRPUSDT", d: "XRP" },
      ],
    },
  ],
};

/** "5 min ago", "3 hours ago", or a short date once older than a day. */
function timeAgo(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  const mins = Math.round((Date.now() - then.getTime()) / 60_000);
  if (Number.isNaN(mins)) return "";
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return then.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function News({ section }) {
  const [tab, setTab] = useState(TABS[0]);
  const [articles, setArticles] = useState(() => sampleFor(TABS[0]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/news?tab=${encodeURIComponent(tab)}`)
      .then((r) => r.json())
      .then((data) => {
        // Each tab falls back to its own category, never to another tab.
        if (!cancelled)
          setArticles(data.articles?.length ? data.articles : sampleFor(tab));
      })
      .catch(() => {
        if (!cancelled) setArticles(sampleFor(tab));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <section id="news" className="relative py-24">
      <div className="text-center">
        <h3 className="text-sm uppercase tracking-widest text-[#a19c8f]">
          {section.eyebrow}
        </h3>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {section.title}{" "}
          <span className="text-[#f5c451]">{section.subtitle}</span>
        </h2>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap justify-center gap-2 px-4 sm:px-6">
        {TABS.map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
              tab === k
                ? "bg-gold-gradient text-[#0a0805]"
                : "border border-[rgba(212,175,55,0.35)] text-[#c9c4b8] hover:text-[#f5c451]",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 items-start gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0">
          {loading ? (
            <div className="flex min-h-100 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#f5c451]" />
            </div>
          ) : (
            <ul className="glass-panel min-h-100 divide-y divide-[rgba(212,175,55,0.14)] rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(20,18,15,0.6)] px-5 backdrop-blur-md sm:px-8">
              {articles.map((n) => (
                <li key={n.id}>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 py-5 sm:py-6"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-base font-bold leading-snug text-[#f2f0eb] transition group-hover:text-[#f5c451] sm:text-lg">
                        {n.title}
                      </h4>
                      {n.excerpt ? (
                        <p className="mt-2 line-clamp-2 text-sm text-[#c9c4b8]">
                          {n.excerpt}
                        </p>
                      ) : null}
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-[#a19c8f] sm:text-sm">
                        <span>
                          By{" "}
                          <span className="text-[#c9c4b8]">
                            {n.author || n.src}
                          </span>
                        </span>
                        <span aria-hidden="true">•</span>
                        <time dateTime={n.publishedAt || undefined}>
                          {timeAgo(n.publishedAt) || n.date}
                        </time>
                      </p>
                    </div>
                    <ExternalLink
                      className="mt-1.5 h-4 w-4 shrink-0 text-[#6f6a5f] transition group-hover:text-[#f5c451]"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {!loading && articles.some((n) => n.src === "Investing.com") ? (
            <p className="mt-6 text-center text-xs text-[#a19c8f]">
              Headlines from{" "}
              <a
                href="https://www.investing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f5c451] hover:text-white"
              >
                Investing.com
              </a>
            </p>
          ) : null}
        </div>

        <aside aria-label="Live market prices" className="lg:sticky lg:top-24">
          <TradingViewFrame
            widget="market-overview"
            config={MARKETS_CONFIG}
            title="Live market prices"
            className="h-150 bg-[rgba(20,18,15,0.6)]"
          />
        </aside>
      </div>
    </section>
  );
}
