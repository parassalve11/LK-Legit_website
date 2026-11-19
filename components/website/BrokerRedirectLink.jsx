"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LOADER_MS = 3500;
const LOADER_STEPS = [
  "Connecting to ByteFX…",
  "Securing your session…",
  "Taking you to ByteFX secure registration…",
];

// Opens the broker link once the loader finishes. Browsers only allow a new
// tab shortly after a click (Safari allows about a second), so if the tab is
// blocked the same tab navigates instead and the visitor always lands there.
function openBroker(href) {
  const tab = window.open(href, "_blank");
  if (tab) tab.opener = null;
  else window.location.assign(href);
}

// Full-screen white ByteFX loading screen shown for ~3.5s before redirecting.
function ActivationLoader({ href, onCancel }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(
      () => setStep((n) => Math.min(n + 1, LOADER_STEPS.length - 1)),
      LOADER_MS / LOADER_STEPS.length,
    );
    const done = setTimeout(() => {
      openBroker(href);
      onCancel();
    }, LOADER_MS);
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    // Keep the page underneath from scrolling while the screen is up.
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearInterval(stepTimer);
      clearTimeout(done);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
    };
  }, [href, onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bytefx-loader-title"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6 text-center"
    >
      <img
        src="/bytefx.png"
        alt="ByteFX"
        className="h-14 w-auto object-contain md:h-20"
      />

      <h3
        id="bytefx-loader-title"
        className="mt-8 max-w-2xl font-sans text-3xl font-extrabold leading-tight tracking-tight text-[#1f5fd6] md:text-5xl"
      >
        Activating your <span className="text-[#4caf2a]">ByteFX</span> trading terminal
      </h3>

      <p aria-live="polite" className="mt-5 h-5 text-sm font-medium text-gray-500">
        {LOADER_STEPS[step]}
      </p>

      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-gray-200 md:w-64">
        <div
          className="h-full origin-left rounded-full bg-linear-to-r from-[#1f5fd6] to-[#7ac943]"
          // CSS animation, not JS: it keeps running even if the page is busy.
          style={{ animation: `bytefx-progress ${LOADER_MS}ms ease-in-out forwards` }}
        />
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="mt-10 text-xs font-semibold text-gray-400 underline underline-offset-4 transition hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}

// A link-styled button that shows the ByteFX loading screen, then redirects.
// Without JavaScript it is still a normal link to the registration page.
export default function BrokerRedirectLink({ href, className, children }) {
  const [loading, setLoading] = useState(false);
  const close = useCallback(() => setLoading(false), []);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setLoading(true);
        }}
      >
        {children}
      </a>
      {loading && createPortal(<ActivationLoader href={href} onCancel={close} />, document.body)}
    </>
  );
}
