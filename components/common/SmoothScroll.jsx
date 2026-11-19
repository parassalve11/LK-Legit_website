"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Eased mouse-wheel scrolling for desktop. Phones and tablets keep the
// browser's native touch scrolling, which is already smooth and runs off the
// main thread; overriding it there only adds lag.
export default function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // Leave open dialogs and the horizontal card track to native scrolling.
      prevent: (node) => Boolean(node.closest?.("dialog[open], .ts-track, [data-lenis-prevent]")),
    });

    // The welcome poster locks the page while it is open. Pause Lenis for that
    // time and resync to the restored scroll position once it closes.
    const observer = new MutationObserver(() => {
      if (document.querySelector("dialog[open]")) lenis.stop();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });

    // `close` does not bubble, so listen in the capture phase. The poster
    // restores the scroll position in its own close handler, which runs after
    // this one, hence the extra frame before resyncing.
    let frame = 0;
    const onDialogClose = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (document.querySelector("dialog[open]")) return;
        lenis.start();
        lenis.resize();
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      });
    };
    document.addEventListener("close", onDialogClose, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("close", onDialogClose, true);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
