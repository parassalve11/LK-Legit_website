"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
export function ActivationLoader({ href, onCancel }) {
  const [step, setStep] = useState(0);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    const stepTimer = setInterval(
      () => setStep((n) => Math.min(n + 1, LOADER_STEPS.length - 1)),
      LOADER_MS / LOADER_STEPS.length,
    );
    const done = setTimeout(() => {
      openBroker(href);
      onCancel();
    }, LOADER_MS);
    // Keep the page underneath from scrolling while the screen is up.
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearInterval(stepTimer);
      clearTimeout(done);
      dialog.close();
      document.documentElement.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [href, onCancel]);

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="bytefx-loader-title"
      onCancel={(event) => { event.preventDefault(); onCancel(); }}
      className="fixed inset-0 z-[9999] m-0 flex h-dvh max-h-none w-screen max-w-none flex-col items-center justify-center border-0 bg-white px-6 text-center backdrop:bg-white"
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

      <p aria-live="polite" className="mt-5 min-h-10 max-w-sm text-sm font-medium text-gray-500">
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
        className="mt-8 min-h-11 px-4 text-sm font-semibold text-gray-500 underline underline-offset-4 transition hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f5fd6]"
      >
        Cancel
      </button>
    </dialog>
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
