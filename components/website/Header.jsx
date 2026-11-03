"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "@/components/common/icons";
import { GoldButton } from "@/components/common/Primitives";
import { cn } from "@/lib/utils";

export default function Header({ nav, siteName = "Trade with LK55", logoUrl = "/Logo.png" }) {
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[rgba(212,175,55,0.18)] bg-[rgba(8,7,4,0.75)] backdrop-blur-xl"
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

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.anchor}
                onClick={() => setActive(n.label)}
                className={cn(
                  "relative text-xs font-semibold uppercase tracking-[0.22em] transition",
                  active === n.label ? "text-[#f5c451]" : "text-[#c9c4b8] hover:text-[#f5c451]",
                )}
              >
                {n.label}
                {active === n.label && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-gold-gradient-bright"
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <GoldButton as="a" href="#contact">
              Join Community <ArrowRight className="h-4 w-4" />
            </GoldButton>
          </div>

          <button
            className="p-2 text-[#f5c451] lg:hidden"
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
            className="fixed inset-0 z-60 lg:hidden"
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
                    className="text-lg font-semibold uppercase tracking-[0.22em] text-[#f2f0eb] hover:text-[#f5c451]"
                  >
                    {n.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <GoldButton as="a" href="#contact" className="justify-center" onClick={() => setOpen(false)}>
                  Join Community <ArrowRight className="h-4 w-4" />
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
