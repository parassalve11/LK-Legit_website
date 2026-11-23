"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@/components/common/icons";
import TradingTerminalLink from "./TradingTerminalLink";
import { cn } from "@/lib/utils";

// The broker partner link is highlighted in ByteFX green on every screen size.
const isPartner = (n) => n.anchor === "#partner" || /partner/i.test(n.label);

export default function Header({ nav, siteName = "Trade with LK", logoUrl = "/Logo.png", brokerLoginHref }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(nav?.[0]?.label || "Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [first, ...rest] = siteName.split(" ").reverse();
  const leading = rest.reverse().join(" ");

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "border-b border-[rgba(212,175,55,0.18)] bg-[rgba(8,7,4,0.94)] lg:bg-[rgba(8,7,4,0.75)] lg:backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#home" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={siteName}
              className="h-10 w-10 rounded-full ring-1 ring-[rgba(212,175,55,0.4)]"
            />
            <span className="font-display text-sm font-bold tracking-[0.18em] text-[#f2f0eb] sm:text-base">
              {leading.toUpperCase()} <span className="text-gold-gradient">{first.toUpperCase()}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-4 xl:flex">
            {nav.map((n) => {
              const partner = isPartner(n);
              return (
                <a
                  key={n.label}
                  href={n.anchor}
                  onClick={() => setActive(n.label)}
                  className={cn(
                    "relative font-semibold uppercase transition",
                    partner
                      ? "text-sm font-bold tracking-[0.18em] text-[#4ade80] drop-shadow-[0_0_10px_rgba(74,222,128,0.45)] hover:text-[#86efac]"
                      : cn(
                          "text-xs tracking-[0.22em]",
                          active === n.label ? "text-[#f5c451]" : "text-[#c9c4b8] hover:text-[#f5c451]",
                        ),
                  )}
                >
                  {n.label}
                  {active === n.label && (
                    <motion.span
                      layoutId="nav-underline"
                      className={cn(
                        "absolute -bottom-2 left-0 right-0 h-px",
                        partner ? "bg-[#4ade80]" : "bg-gold-gradient-bright",
                      )}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <TradingTerminalLink href={brokerLoginHref} compact />
          </div>

          <button
            className="p-2 text-[#f5c451] xl:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 xl:hidden"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24 }}
              className="glass-panel-strong absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-full ring-1 ring-[rgba(212,175,55,0.4)]"
                />
                <button onClick={() => setOpen(false)} className="p-2 text-[#f5c451]" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-5">
                {nav.map((n) => (
                  <a
                    key={n.label}
                    href={n.anchor}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "font-semibold uppercase tracking-[0.22em]",
                      isPartner(n)
                        ? "text-xl font-bold text-[#4ade80] hover:text-[#86efac]"
                        : "text-lg text-[#f2f0eb] hover:text-[#f5c451]",
                    )}
                  >
                    {n.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <TradingTerminalLink href={brokerLoginHref} compact onClick={() => setOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
