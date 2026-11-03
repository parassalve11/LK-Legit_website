"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Lock, Star, getIcon } from "@/components/common/icons";
import { cn } from "@/lib/utils";

export default function Partnership({ section, features, stats, steps }) {
  const [tab, setTab] = useState("benefits");
  const f = section.fields || {};

  return (
    <section
      id="partner"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden border-t border-white/5 bg-[#050505] p-4 md:p-8"
    >
      <div className="pointer-events-none absolute -left-32 top-1/4 z-0 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 z-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-7xl">
        <div
          className="absolute inset-0 z-0 rounded-[2.5rem] bg-cover bg-center"
          style={{ backgroundImage: "url(/Partnership_backgoround.png)" }}
        />

        <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/15 p-8 shadow-2xl backdrop-blur-sm md:p-14">
          <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/20 to-black/55" />
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border-t border-white/20 mix-blend-overlay" />

          <div className="relative z-20 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div className="flex flex-col justify-center">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                {section.eyebrow}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a href={f.ctaLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <img src="/bytefx.png" alt="ByteFx logo" className="h-8 w-auto object-contain" />
                </a>
                {f.badgeText ? (
                  <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
                    <Star className="h-3.5 w-3.5 fill-green-400 text-green-400" />
                    <span className="text-xs font-medium text-green-400">{f.badgeText}</span>
                  </div>
                ) : null}
              </div>

              <h2 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight md:text-[4rem]">
                <span className="text-blue-500">{section.title}</span>
                <br />
                <span className="text-green-400">{f.headlineLine2}</span>
              </h2>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
                {section.subtitle}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <a
                  href={f.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-green-400/50 bg-green-500/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-green-500/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                >
                  {f.ctaText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={f.secondaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  {f.secondaryCtaText}
                </a>
              </div>
            </div>

            <div className="relative flex flex-col justify-center">
              <div className="mb-8 flex flex-wrap gap-2">
                {[
                  { id: "benefits", label: "Key Features" },
                  { id: "howto", label: "How to Join" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all",
                      tab === t.id
                        ? "border border-green-500/50 bg-green-500/20 text-white shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                        : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {tab === "benefits" ? (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    {features.map((feature) => {
                      const Icon = getIcon(feature.iconKey);
                      const isHigh = feature.meta === "highlighted";
                      return (
                        <div
                          key={feature.title}
                          className={
                            isHigh
                              ? "relative overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl"
                              : "rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-colors hover:bg-white/20"
                          }
                        >
                          {isHigh && (
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
                          )}
                          <div
                            className={
                              isHigh
                                ? "relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/40 bg-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                                : "mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                            }
                          >
                            <Icon className="h-5 w-5 text-green-400" />
                          </div>
                          <h3 className="relative z-10 mb-2 font-semibold text-white">
                            {feature.title}
                          </h3>
                          <p className="relative z-10 text-sm text-gray-300">{feature.body}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="howto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:p-8"
                  >
                    <div className="mb-8 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/40 bg-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                        <Lock className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Quick Start Guide</h4>
                        <p className="text-xs text-gray-400">
                          Register below to activate your trading access
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
                      {steps.map((step, i) => {
                        const Icon = getIcon(step.iconKey);
                        return (
                          <div key={step.title} className="relative text-center">
                            <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                              <Icon className="h-7 w-7 text-green-400" />
                              <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-green-500 text-xs font-bold text-black shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                                {i + 1}
                              </span>
                            </div>
                            <h5 className="font-semibold text-white">{step.title}</h5>
                            <p className="mt-1 text-xs text-gray-400">{step.body}</p>
                            {i < steps.length - 1 && (
                              <ChevronRight className="absolute -right-4.5 top-6 hidden h-5 w-5 text-white/20 sm:block" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {stats.length > 0 && (
            <div className="relative z-20 mt-12 overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
              <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-6 lg:px-10">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-2xl border border-white/10 px-4 py-3",
                      index === stats.length - 1
                        ? "bg-green-500/10 text-green-300"
                        : "bg-white/5 text-gray-200",
                    )}
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-xl font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
