"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Clock } from "@/components/common/icons";
import { cn } from "@/lib/utils";

const TABS = ["Live Chart", "Market Overview", "Economic Calendar", "Weekly Sessions"];

function toMinutes(time) {
  const [h, m] = String(time).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesOfDayUTC(d) {
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/** Sessions can wrap past midnight (Sydney 21:00 → 06:00). */
function isSessionOpen(s, now) {
  const open = toMinutes(s.openTime);
  const close = toMinutes(s.closeTime);
  const cur = minutesOfDayUTC(now);
  return open < close ? cur >= open && cur < close : cur >= open || cur < close;
}

function nextTransition(s, now) {
  const open = toMinutes(s.openTime);
  const close = toMinutes(s.closeTime);
  const cur = minutesOfDayUTC(now);
  const untilOpen = !isSessionOpen(s, now);
  const target = untilOpen ? open : close;
  let diff = target - cur;
  if (diff <= 0) diff += 1440;
  return { untilOpen, minutes: diff };
}

function formatCountdown(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Injects a TradingView embed script into a container.
 *
 * TradingView's loader looks up its own <script> tag's parent when it runs.
 * In development React mounts every effect twice; if we inject straight away
 * the first script is detached by the cleanup, still runs, and throws — which
 * leaves the widget frame blank. Deferring by a tick means the first mount is
 * cancelled before it ever injects anything.
 */
function useTradingViewWidget(src, config, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timer = setTimeout(() => {
      el.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = "tradingview-widget-container__widget";
      wrap.style.height = "100%";
      wrap.style.width = "100%";
      el.appendChild(wrap);

      const script = document.createElement("script");
      script.src = src;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(config);
      el.appendChild(script);
    }, 0);

    return () => {
      clearTimeout(timer);
      el.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function LiveChart({ sessions }) {
  const [active, setActive] = useState(sessions[2]?.key || sessions[0]?.key);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const activeSession = useMemo(
    () => sessions.find((s) => s.key === active) || sessions[0],
    [sessions, active],
  );

  const containerRef = useTradingViewWidget(
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
    {
      autosize: true,
      symbol: activeSession?.symbol || "FX:EURUSD",
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#0b0906",
      gridColor: "rgba(212,175,55,0.08)",
      hide_top_toolbar: false,
      hide_side_toolbar: true,
      hide_legend: false,
      withdateranges: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    },
    [active],
  );

  if (!activeSession) return null;
  const transition = nextTransition(activeSession, now);
  const activeIsOpen = isSessionOpen(activeSession, now);

  return (
    <div className="flex h-full w-full flex-col space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a19c8f]">
          Session:
        </span>
        {sessions.map((s) => {
          const open = isSessionOpen(s, now);
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={cn(
                "group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition",
                active === s.key
                  ? "bg-gold-gradient text-[#0a0805]"
                  : "border border-[rgba(212,175,55,0.3)] text-[#c9c4b8] hover:border-[#f5c451] hover:text-[#f5c451]",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  open ? "bg-[#3ddc84] shadow-[0_0_8px_#3ddc84]" : "bg-[#e6483c]",
                )}
              />
              {s.label}
            </button>
          );
        })}
        <span className="ml-auto hidden text-[11px] font-medium text-[#a19c8f] sm:inline">
          {activeSession.label} {activeIsOpen ? "closes" : "opens"} in{" "}
          <span className="font-semibold text-[#f5c451]">{formatCountdown(transition.minutes)}</span>
        </span>
      </div>

      <div
        ref={containerRef}
        className="tradingview-widget-container relative w-full grow overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[#0b0906]"
      />
    </div>
  );
}

/**
 * Embeds a TradingView widget as a plain iframe we size ourselves.
 *
 * TradingView's loader script (used by the Live Chart) rewrites its container
 * and forces height:100% on it, which collapsed these widgets to 150px and,
 * combined with React's double-mounted effects in dev, sometimes left them
 * blank. The iframe URL is exactly what that loader would build.
 */
function TradingViewFrame({ widget, config, title, className, scrollLock = false }) {
  const src = useMemo(
    () =>
      `https://www.tradingview-widget.com/embed-widget/${widget}/?locale=en#${encodeURIComponent(
        JSON.stringify({ width: "100%", height: "100%", ...config }),
      )}`,
    [widget, config],
  );
  // A scrolling widget inside the page swallows the mouse wheel, so visitors
  // get stuck scrolling through the whole list. Until they click into it, a
  // transparent shield lets the wheel scroll the page instead.
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[#0b0906]",
        className,
      )}
      onMouseLeave={() => setActive(false)}
    >
      <iframe
        key={src}
        src={src}
        title={title}
        loading="lazy"
        className="block h-full w-full border-0"
      />
      {scrollLock && !active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Interact with ${title}`}
          className="group absolute inset-0 z-10 flex cursor-pointer items-end justify-center bg-transparent pb-4"
        >
          <span className="rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(10,8,5,0.85)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5c451] opacity-80 shadow-lg backdrop-blur transition group-hover:opacity-100">
            Click to scroll the {title.toLowerCase()}
          </span>
        </button>
      ) : null}
    </div>
  );
}

// Only symbols TradingView allows in free embeds. NSE (Nifty) and MCX feeds
// are licensed and show an error badge instead of a price, so they're left out.
const OVERVIEW_CONFIG = {
  colorTheme: "dark",
  dateRange: "12M",
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
        { s: "BSE:SENSEX", d: "Sensex" },
        { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
        { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
      ],
    },
    {
      title: "Commodities",
      symbols: [
        { s: "OANDA:XAUUSD", d: "Gold" },
        { s: "TVC:SILVER", d: "Silver" },
        { s: "TVC:USOIL", d: "Crude Oil" },
      ],
    },
    {
      title: "Forex",
      symbols: [
        { s: "FX_IDC:USDINR", d: "USD / INR" },
        { s: "FX:EURUSD", d: "EUR / USD" },
        { s: "FX:GBPUSD", d: "GBP / USD" },
      ],
    },
    {
      title: "Crypto",
      symbols: [
        { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
        { s: "BINANCE:ETHUSDT", d: "Ethereum" },
      ],
    },
  ],
};

// The events widget filters by country code (it ignores "currencyFilter").
const CALENDAR_CONFIG = {
  colorTheme: "dark",
  isTransparent: true,
  importanceFilter: "0,1",
  countryFilter: "in,us,eu,gb,jp,cn",
};

function MarketOverview() {
  return (
    <TradingViewFrame
      widget="market-overview"
      config={OVERVIEW_CONFIG}
      title="Market overview"
      className="h-95 md:h-105"
    />
  );
}

function EconomicCalendar() {
  return (
    <TradingViewFrame
      widget="events"
      config={CALENDAR_CONFIG}
      title="Economic calendar"
      className="h-95 md:h-105"
      scrollLock
    />
  );
}

export default function Dashboard({ section, marketSessions, weeklySessions }) {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <section id="tools" className="relative py-24">
      <div className="text-center">
        <h3 className="text-sm uppercase tracking-widest text-[#a19c8f]">{section.eyebrow}</h3>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {section.title} <span className="text-[#f5c451]">{section.subtitle}</span>
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="glass-panel-strong overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.18)] bg-[rgba(20,18,15,0.6)] backdrop-blur-md">
          <div className="flex flex-wrap gap-1 border-b border-[rgba(212,175,55,0.18)] p-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition",
                  tab === t ? "bg-[#f5c451] text-[#0a0805]" : "text-[#c9c4b8] hover:text-[#f5c451]",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className={tab === "Live Chart" ? "p-3 sm:p-4 md:p-6" : "min-h-100 p-6 md:p-8"}>
            {tab === "Live Chart" && (
              <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(10,8,5,0.6)] p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[rgba(245,196,81,0.12)]" />
                <div className="h-100 w-full overflow-hidden md:h-115 lg:h-125">
                  <LiveChart sessions={marketSessions} />
                </div>
              </div>
            )}

            {tab === "Market Overview" && <MarketOverview />}
            {tab === "Economic Calendar" && <EconomicCalendar />}

            {tab === "Weekly Sessions" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {weeklySessions.map((s) => (
                  <div
                    key={s.label}
                    className="relative overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[rgba(10,8,5,0.4)] p-5 transition hover:border-[rgba(212,175,55,0.5)]"
                  >
                    <CalendarClock className="h-5 w-5 text-[#f5c451]" />
                    <div className="mt-3 text-[11px] uppercase tracking-widest text-[#a19c8f]">
                      {s.day}
                    </div>
                    <div className="mt-1 font-display text-lg font-bold text-[#f2f0eb]">
                      {s.topic}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#c9c4b8]">
                      <Clock className="h-3.5 w-3.5" /> {s.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
