"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "@/components/common/icons";
import { SectionHeader } from "@/components/common/Primitives";
import { cn } from "@/lib/utils";

export default function Testimonials({ section, items }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const t = items[i];

  return (
    <section className="relative py-24">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} gold={section.subtitle} />
      <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6">
        <div className="animated-gold-border glass-panel-strong relative rounded-3xl p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex gap-1 text-[#f5c451]">
                {Array.from({ length: t.rating || 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-[#f5c451]" />
                ))}
              </div>
              <p className="mt-4 font-display text-xl leading-snug text-[#f2f0eb] md:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-gradient font-display font-bold text-[#0a0805]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#f2f0eb]">{t.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-[#a19c8f]">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setI((p) => (p - 1 + items.length) % items.length)}
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] text-[#f5c451] hover:bg-[rgba(245,196,81,0.08)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Slide ${k + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    k === i ? "w-8 bg-gold-gradient" : "w-2 bg-[rgba(212,175,55,0.3)]",
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setI((p) => (p + 1) % items.length)}
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] text-[#f5c451] hover:bg-[rgba(245,196,81,0.08)]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
