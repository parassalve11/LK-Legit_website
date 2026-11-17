"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpenCheck, Brain, Check, ChevronLeft, ChevronRight,
  FlaskConical, MousePointer2, NotebookPen, ShieldCheck, X,
} from "lucide-react";
import { Reveal } from "@/components/common/Primitives";

// ── Card illustrations ────────────────────────────────────────────────────
// Each card's `iconKey` (editable in the admin) picks one of these. Unknown
// keys fall back to the checklist so a typo never breaks the carousel.

function Hesitate() {
  return (
    <div className="ts-hesitate" aria-hidden="true">
      <span className="ts-q">?</span>
      <span className="ts-btn ts-buy">BUY</span>
      <span className="ts-btn ts-sell">SELL</span>
      <MousePointer2 className="ts-cursor" />
    </div>
  );
}

function Checklist() {
  const items = [
    { label: "Setups", ok: true },
    { label: "Indicators", ok: true },
    { label: "Process", ok: false },
  ];
  return (
    <ul className="ts-pills" aria-hidden="true">
      {items.map((it, i) => (
        <li key={it.label} data-missing={it.ok ? undefined : "true"} style={{ "--i": i }}>
          {it.ok ? <Check /> : <X />} {it.label}
        </li>
      ))}
    </ul>
  );
}

function Loop() {
  return (
    <div className="ts-loop" aria-hidden="true">
      <svg viewBox="0 0 160 160">
        <circle className="ts-loopRing" cx="80" cy="80" r="58" />
        <g className="ts-loopSpin">
          <circle cx="80" cy="22" r="5" fill="#ef5350" />
        </g>
      </svg>
      {["Losses", "Revenge", "Overtrade", "Doubt"].map((l, i) => (
        <span key={l} className="ts-loopLabel" data-pos={i}>
          {l}
        </span>
      ))}
      <span className="ts-loopCenter">repeat</span>
    </div>
  );
}

function Curves() {
  return (
    <svg className="ts-curves" viewBox="0 0 300 130" aria-hidden="true">
      <path
        className="ts-curve ts-curveAm"
        pathLength="1"
        d="M10 72 L38 48 L58 92 L84 38 L106 98 L128 58 L150 106 L176 70 L200 114 L226 84 L252 120 L290 106"
      />
      <path
        className="ts-curve ts-curvePro"
        pathLength="1"
        d="M10 112 C 60 102, 82 92, 112 82 S 172 62, 202 50 S 262 24, 290 16"
      />
      <text x="290" y="8" textAnchor="end" className="ts-curveLabel" fill="#4ade80">
        System
      </text>
      <text x="10" y="128" className="ts-curveLabel" fill="#ef5350">
        Emotion
      </text>
    </svg>
  );
}

function Compare() {
  const rows = [
    ["Change rules after every loss", "Fixed, written rules"],
    ["No idea what works", "Journal-proven edge"],
  ];
  return (
    <div className="ts-compare" aria-hidden="true">
      {rows.flatMap(([bad, good], i) => [
        <p key={bad}>
          <X /> {bad}
        </p>,
        <p key={good} data-good="true" style={{ "--i": i }}>
          <Check /> {good}
        </p>,
      ])}
    </div>
  );
}

function Rule() {
  return (
    <div className="ts-rule" aria-hidden="true">
      <span style={{ "--i": 0 }}>
        <b className="ts-k1">IF</b> price taps my zone
      </span>
      <span style={{ "--i": 1 }}>
        <b className="ts-k1">AND</b> structure confirms
      </span>
      <span style={{ "--i": 2 }}>
        <b className="ts-k2">THEN</b> enter · risk 1%
      </span>
      <span style={{ "--i": 3 }}>
        <b className="ts-k3">ELSE</b> wait<i className="ts-caret" />
      </span>
    </div>
  );
}

function Stack() {
  const items = [
    { Icon: BookOpenCheck, label: "Strategy" },
    { Icon: FlaskConical, label: "Backtesting" },
    { Icon: ShieldCheck, label: "Risk rules" },
    { Icon: NotebookPen, label: "Journal" },
    { Icon: Brain, label: "Psychology" },
  ];
  return (
    <ul className="ts-stack" aria-hidden="true">
      {items.map(({ Icon, label }, i) => (
        <li key={label} style={{ "--i": i }}>
          <Icon /> {label}
        </li>
      ))}
    </ul>
  );
}

function Pulse() {
  const d = "M10 80 L70 80 L90 80 L105 40 L120 110 L135 60 L150 80 L290 80";
  return (
    <svg className="ts-pulse" viewBox="0 0 300 130" aria-hidden="true">
      <path className="ts-pulseBg" d={d} />
      <path className="ts-pulseLine" pathLength="1" d={d} />
      <circle className="ts-pulseDot" cx="290" cy="80" r="5" />
      <text x="290" y="60" textAnchor="end" className="ts-pulseLabel">
        In control
      </text>
    </svg>
  );
}

const VISUALS = {
  "visual-hesitate": { C: Hesitate },
  "visual-checklist": { C: Checklist },
  "visual-loop": { C: Loop },
  "visual-curves": { C: Curves },
  "visual-compare": { C: Compare },
  "visual-rule": { C: Rule, dark: true },
  "visual-stack": { C: Stack },
  "visual-pulse": { C: Pulse },
};

// ── Carousel ──────────────────────────────────────────────────────────────

export default function TradeSystem({ section, steps }) {
  const f = section.fields || {};
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  // Where the carousel is heading. Lets rapid prev/next clicks step from the
  // destination instead of the half-scrolled current position.
  const target = useRef(0);
  const settle = useRef(0);

  const cards = () => Array.from(trackRef.current?.querySelectorAll("[data-card]") || []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const list = cards();
    const padLeft = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const x = track.scrollLeft + padLeft;
    let best = 0;
    list.forEach((el, i) => {
      if (Math.abs(el.offsetLeft - x) < Math.abs(list[best].offsetLeft - x)) best = i;
    });
    setIndex(best);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      target.current = best;
    }, 150);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("resize", onScroll);
      clearTimeout(settle.current);
    };
  }, [onScroll]);

  const goTo = (i) => {
    const track = trackRef.current;
    const next = Math.max(0, Math.min(steps.length - 1, i));
    const el = cards()[next];
    if (!track || !el) return;
    target.current = next;
    const padLeft = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    track.scrollTo({ left: el.offsetLeft - padLeft, behavior: "smooth" });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(target.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(target.current - 1);
    }
  };

  const external = /^https?:\/\//.test(f.ctaLink || "");

  return (
    <section id="system" aria-labelledby="system-title" className="relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-5 px-4">
        <Reveal>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2
            id="system-title"
            className="mt-3 font-display text-3xl font-bold leading-tight text-[#f2f0eb] sm:text-4xl md:text-[44px]"
          >
            {section.title} <span className="text-gold-gradient">{section.subtitle}</span>
          </h2>
        </Reveal>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ts-nav"
            aria-label="Previous card"
            disabled={index === 0}
            onClick={() => goTo(target.current - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="ts-nav"
            aria-label="Next card"
            disabled={atEnd}
            onClick={() => goTo(target.current + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className="ts-track mt-8"
        role="region"
        aria-roledescription="carousel"
        aria-label="Why trading without a system keeps you stuck"
        tabIndex={0}
      >
        {steps.map((step, i) => {
          const v = VISUALS[step.iconKey] || VISUALS["visual-checklist"];
          const last = i === steps.length - 1;
          return (
            <article
              key={step.title}
              data-card
              className="ts-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${steps.length}: ${step.meta}`}
            >
              <div className={`ts-visual${v.dark ? " ts-visualDark" : ""}`}>
                <v.C />
              </div>
              <p className="ts-kicker">
                <span>{String(i + 1).padStart(2, "0")}</span> {step.meta}
              </p>
              <h3 className="ts-title">{step.title}</h3>
              <p className="ts-body">{step.body}</p>
              {last && f.ctaText ? (
                <a
                  href={f.ctaLink || "#"}
                  className="ts-cta"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {f.ctaText} <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className="ts-dot"
            aria-label={`Go to card ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
