"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Embeds a TradingView widget as a plain iframe we size ourselves.
 *
 * TradingView's loader script (used by the Live Chart) rewrites its container
 * and forces height:100% on it, which collapsed these widgets to 150px and,
 * combined with React's double-mounted effects in dev, sometimes left them
 * blank. The iframe URL is exactly what that loader would build.
 */
export default function TradingViewFrame({ widget, config, title, className, scrollLock = false }) {
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
