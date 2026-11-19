"use client";

import { motion } from "framer-motion";
import { Reveal, CountUp, CandlestickBackdrop } from "@/components/common/Primitives";

function MarketCycles() {
  const cards = [
    { src: "/bull.webp", alt: "Bull cycle", label: "Bull Cycle", hoverY: -4 },
    { src: "/Bear.webp", alt: "Bear cycle", label: "Bear Cycle", hoverY: 4 },
  ];
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
      {cards.map((c, i) => (
        <div key={c.label} className="contents">
          {i === 1 && (
            <>
              <div className="hidden h-28 w-px bg-linear-to-b from-transparent via-[rgba(245,196,81,0.4)] to-transparent sm:block" />
              <div className="block h-px w-28 bg-linear-to-r from-transparent via-[rgba(245,196,81,0.4)] to-transparent sm:hidden" />
            </>
          )}
          <motion.div
            whileHover={{ scale: 1.03, y: c.hoverY }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="group relative w-36 shrink-0 sm:w-44 md:w-52 lg:w-60"
          >
            <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-[radial-gradient(circle,rgba(245,196,81,0.28),rgba(245,196,81,0.08)_45%,transparent_70%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            <img
              src={c.src}
              alt={c.alt}
              draggable={false}
              loading="lazy"
              decoding="async"
              className="h-auto w-full select-none object-contain mix-blend-screen drop-shadow-[0_18px_40px_rgba(212,175,55,0.35)] transition-[filter] duration-300 group-hover:drop-shadow-[0_18px_55px_rgba(245,196,81,0.6)]"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
                maskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
              }}
            />
            <div className="mt-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5c451]/80">
              {c.label}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default function WhyLK({ section, stats }) {
  const f = section.fields || {};
  return (
    <section id="roadmap" className="relative overflow-hidden bg-[#050505] py-24">
      <div className="hex-bg absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <div className="eyebrow mb-4">{section.eyebrow}</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-3xl font-bold leading-tight text-[#f2f0eb] sm:text-4xl md:text-5xl">
              {section.title} <span className="text-gold-gradient">{section.subtitle}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-[15px] leading-relaxed text-[#c9c4b8]">{f.paragraph1}</p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-4 text-[15px] leading-relaxed text-[#c9c4b8]">{f.paragraph2}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#080704] px-4 py-4 text-center"
                >
                  <div className="font-display text-xl font-bold text-gold-gradient">
                    {s.countUp ? (
                      <>
                        <CountUp end={Number(s.value)} />
                        {s.suffix}
                      </>
                    ) : (
                      `${s.value}${s.suffix || ""}`
                    )}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#a19c8f]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="animated-gold-border relative overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.22)] bg-[#050505] p-8 sm:p-10 md:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <CandlestickBackdrop />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <MarketCycles />
              <p className="mt-8 font-display text-xl font-semibold leading-snug text-[#f2f0eb] sm:text-2xl md:text-3xl">
                <span className="text-gold-gradient">&ldquo;</span>
                {f.quote}
                <span className="text-gold-gradient">&rdquo;</span>
              </p>
              <div className="mt-5 text-[11px] uppercase tracking-[0.32em] text-[#f5c451]">
                {f.quoteAuthor}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
