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

/** Injects a TradingView embed script into a container. */
function useTradingViewWidget(src, config, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
    return () => {
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

function MarketOverview() {
  const ref = useTradingViewWidget(
    "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js",
    {
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "100%",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "BSE:SENSEX", d: "Sensex" },
            { s: "NSE:NIFTY", d: "Nifty 50" },
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
          ],
        },
        {
          title: "Commodities & Crypto",
          symbols: [
            { s: "MCX:GOLD1!", d: "Gold (MCX)" },
            { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
            { s: "BINANCE:ETHUSDT", d: "Ethereum" },
          ],
        },
      ],
    },
  );
  return (
    <div
      ref={ref}
      className="h-100 w-full overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[rgba(10,8,5,0.4)] md:h-125"
    />
  );
}

function EconomicCalendar() {
  const ref = useTradingViewWidget(
    "https://s3.tradingview.com/external-embedding/embed-widget-events.js",
    {
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: "100%",
      locale: "en",
      importanceFilter: "0,1",
      currencyFilter: "USD,INR,EUR,GBP,JPY",
    },
  );
  return (
    <div
      ref={ref}
      className="h-100 w-full overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[rgba(10,8,5,0.4)] md:h-150"
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
                <div className="h-112.5 w-full overflow-hidden md:h-150 lg:h-175">
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
