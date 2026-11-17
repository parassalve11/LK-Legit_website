"use client";

import { useRef, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { ArrowRight, ChevronRight, getIcon } from "@/components/common/icons";
import { Reveal } from "@/components/common/Primitives";
import { cn } from "@/lib/utils";

const KNOB = 44;
const PAD = 4;

// "Slide to activate" button. Drag the knob to the end (or press Enter /
// Space when focused) to open the broker registration link in a new tab.
function SlideToActivate({ label, href }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);

  const maxX = () => (trackRef.current ? trackRef.current.offsetWidth - KNOB - PAD * 2 : 0);
  const fillWidth = useTransform(x, (v) => v + KNOB);
  const labelOpacity = useTransform(x, (v) => 1 - Math.min(1, v / Math.max(1, maxX() * 0.7)));

  const activate = () => {
    if (done) return;
    setDone(true);
    animate(x, maxX(), { type: "spring", stiffness: 400, damping: 35 });
    window.open(href, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      setDone(false);
    }, 1200);
  };

  const onDragEnd = () => {
    if (x.get() >= maxX() * 0.85) activate();
    else animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
  };

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
      onClick={(e) => {
        // A plain tap on the track (not a drag of the knob) also works.
        if (e.target === trackRef.current) activate();
      }}
      className="relative h-[52px] w-full max-w-[360px] cursor-pointer select-none overflow-hidden rounded-full border border-[#7ac943]/50 bg-[#0b1f12]/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] outline-none transition-shadow hover:shadow-[0_10px_40px_rgba(122,201,67,0.25)] focus-visible:ring-2 focus-visible:ring-[#7ac943]/70"
    >
      <motion.div
        className="pointer-events-none absolute rounded-full bg-linear-to-r from-[#7ac943]/30 to-[#7ac943]/70"
        style={{ left: PAD, top: PAD, bottom: PAD, width: fillWidth }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 pr-[18px] pl-[56px] text-[14px] font-semibold text-white"
        style={{ opacity: labelOpacity }}
      >
        <span className="activate-shimmer truncate">{label}</span>
        <span className="flex text-[#7ac943]">
          <ChevronRight className="-mr-2.5 h-4 w-4 opacity-40" />
          <ChevronRight className="-mr-2.5 h-4 w-4 opacity-70" />
          <ChevronRight className="h-4 w-4" />
        </span>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        style={{ x, width: KNOB, height: KNOB, top: PAD, left: PAD, touchAction: "pan-y" }}
        className="absolute z-10 grid cursor-grab place-items-center rounded-full bg-linear-to-b from-[#9be06a] to-[#7ac943] text-[#07090a] shadow-[0_0_12px_rgba(122,201,67,0.35)] active:cursor-grabbing"
      >
        <ArrowRight className="h-5 w-5" />
      </motion.div>
    </div>
  );
}

export default function Partnership({ section, features, stats }) {
  const f = section.fields || {};
  const disclaimers = [f.disclaimer1, f.disclaimer2, f.disclaimer3].filter(Boolean);

  return (
    <section id="partner" className="relative py-[72px] md:py-[120px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <Reveal className="relative mb-12 md:mb-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[140px] font-semibold leading-none text-white/[0.04] md:-top-16 md:text-[220px]"
          >
            {f.ghostNumber || "05"}
          </span>
          <div className="relative flex items-start gap-6">
            <h2 className="font-display text-[44px] font-semibold leading-none tracking-tight text-[#f2f0eb] md:text-[84px]">
              {f.heading || "Partner"}
              <span className="text-[#4ade80]">.</span>
            </h2>
            <span aria-hidden="true" className="mt-8 hidden h-px w-16 bg-white/70 md:mt-12 md:block" />
          </div>
        </Reveal>

        {/* Main card */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050806] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] lg:min-h-[620px]">
          <img
            src={f.backgroundImage || "/Partnership_backgoround.png"}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-85 blur-[3px]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#050806]/85 via-[#050806]/35 to-[#050806]/25" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050806]/90 via-transparent to-[#050806]/50" />

          <div className="relative grid flex-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:px-10 lg:pt-10 lg:pb-6">
            {/* Left: broker pitch */}
            <div className="flex min-h-0 flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                {section.eyebrow}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a href={f.ctaLink} target="_blank" rel="noopener noreferrer">
                  <img src="/bytefx.png" alt="ByteFX" className="h-9 w-auto object-contain" />
                </a>
                {f.badgeText ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#7ac943]/40 bg-[#7ac943]/10 px-3 py-1 text-[12px] font-semibold text-[#7ac943]">
                    <ShieldCheck className="h-3.5 w-3.5" /> {f.badgeText}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-7 font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl xl:text-7xl">
                <span className="block text-[#3d82f6]">{section.title}</span>
                <span className="block text-[#4ade80]">{f.headlineLine2}</span>
              </h3>

              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/80">{section.subtitle}</p>

              <div className="mt-8 flex flex-col items-start gap-4">
                <SlideToActivate label={f.ctaText || "Activate Your Trading Terminal"} href={f.ctaLink || "#"} />
                {f.secondaryCtaText ? (
                  <a
                    href={f.secondaryCtaLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pl-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {f.secondaryCtaText} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Right: 2×2 feature cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:min-h-0 lg:grid-rows-2">
              {features.slice(0, 4).map((feature, i) => {
                const Icon = getIcon(feature.iconKey);
                const highlighted = feature.meta === "highlighted" || (i === 0 && !features.some((x) => x.meta === "highlighted"));
                return (
                  <motion.div
                    key={feature.title}
                    className="min-h-0"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className={cn(
                        "group flex h-full flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#7ac943]/40",
                        highlighted ? "border-white/25 bg-white/[0.1]" : "border-white/[0.09] bg-white/[0.04]",
                      )}
                    >
                      <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-black/30 text-[#4ade80]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-auto pt-5 text-[16px] font-semibold text-white">{feature.title}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-white/70">{feature.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Stat strip */}
          {stats.length > 0 ? (
            <div className="relative px-6 sm:px-8 lg:px-10">
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/[0.09] bg-black/40 p-3 backdrop-blur-xl sm:grid-cols-3 sm:p-4 lg:grid-cols-6">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 py-3.5 backdrop-blur-xl"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
                    <p
                      className={cn(
                        "mt-1.5 font-display text-[17px] font-semibold leading-snug",
                        i === stats.length - 1 ? "text-[#4ade80]" : "text-white",
                      )}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {disclaimers.length ? (
            <div className="relative flex flex-col gap-1 px-6 py-4 text-[11px] leading-relaxed text-white/50 sm:px-8 lg:flex-row lg:flex-wrap lg:gap-x-4 lg:px-10">
              {disclaimers.map((d, i) => (
                <span key={i} className={i === disclaimers.length - 1 && disclaimers.length > 1 ? "text-white/35" : undefined}>
                  {d}
                </span>
              ))}
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>
      </div>
    </section>
  );
}
