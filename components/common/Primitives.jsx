"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// whileInView rather than useInView + animate. The original site drove this
// manually, which left above-the-fold content stuck at opacity:0 until the
// visitor scrolled — the hero rendered blank on every cold load. whileInView
// fires for elements already in the viewport on mount.
export function Reveal({ children, delay = 0, y = 24, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ end, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const target = Number(end) || 0;
    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  const formatted =
    val >= 1000 ? (val / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(val);

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function GoldButton({ children, className = "", as: As = "button", ...props }) {
  return (
    <As
      className={cn(
        "btn-gold shimmer-btn relative inline-flex items-center gap-2 rounded-full px-6 py-3 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(212,175,55,0.7)]",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </As>
  );
}

export function GhostGoldButton({ children, className = "", as: As = "button", ...props }) {
  return (
    <As
      className={cn(
        "btn-gold-outline inline-flex items-center gap-2 rounded-full px-6 py-3 transition hover:-translate-y-0.5 hover:border-[rgba(245,196,81,0.9)] hover:bg-[rgba(245,196,81,0.06)]",
        className,
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function SectionHeader({ eyebrow, title, gold, sub }) {
  return (
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      {eyebrow ? (
        <Reveal>
          <div className="eyebrow mb-4">{eyebrow}</div>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-bold leading-tight text-[#f2f0eb] sm:text-4xl md:text-5xl">
          {title} {gold ? <span className="text-gold-gradient">{gold}</span> : null}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.12}>
          <p className="mt-4 text-[15px] leading-relaxed text-[#c9c4b8]">{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function GoldSparks() {
  const sparks = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 0.7) % 12;
        const dur = 10 + ((i * 3) % 12);
        const size = 1 + ((i * 7) % 3);
        return (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-[#f5c451]"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              boxShadow: "0 0 8px rgba(245,196,81,0.8)",
              animation: `spark-drift ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export function CandlestickBackdrop({ className = "" }) {
  const bars = Array.from({ length: 22 });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 flex items-end justify-around gap-1 opacity-30",
        className,
      )}
    >
      {bars.map((_, i) => {
        const h = 20 + ((i * 37) % 70);
        const up = i % 3 !== 0;
        return (
          <div
            key={i}
            className="flex origin-bottom flex-col items-center"
            style={{
              transform: inView ? "scaleY(1)" : "scaleY(0)",
              transition: `transform 1.2s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.04}s`,
            }}
          >
            <div className="w-px" style={{ height: 12, background: "rgba(212,175,55,0.4)" }} />
            <div
              className="w-2 rounded-sm"
              style={{
                height: `${h}%`,
                background: up
                  ? "linear-gradient(180deg,#f5c451,#9a6e1e)"
                  : "linear-gradient(180deg,#9a6e1e,#3a2a10)",
              }}
            />
            <div className="w-px" style={{ height: 8, background: "rgba(212,175,55,0.4)" }} />
          </div>
        );
      })}
    </div>
  );
}
