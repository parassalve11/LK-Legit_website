"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRight, Radio, X, Youtube } from "lucide-react";
import styles from "./WelcomePoster.module.css";

const SESSION_KEY = "lk55-welcome-poster-seen";
const linkProps = (href) =>
  /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function WelcomePoster({
  siteName = "Trade with LK55",
  channelHandle = "@TradewithLK55",
  channelHref = "https://www.youtube.com/@TradewithLK55",
  liveHref = "https://www.youtube.com/@TradewithLK55/live",
}) {
  const dialogRef = useRef(null);
  const restorePageRef = useRef(() => {});

  const dismiss = () => {
    restorePageRef.current();
    dialogRef.current?.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // The popup still works when browser storage is unavailable.
    }

    let shown = false;
    let restorePage = null;
    let touchY = null;
    const initialScrollY = window.scrollY;

    const unlock = () => {
      restorePage?.();
      restorePage = null;
    };
    restorePageRef.current = unlock;

    const show = () => {
      if (shown || document.querySelector("dialog[open]")) return;
      shown = true;
      removeListeners();

      const { body, documentElement } = document;
      const x = window.scrollX;
      const y = window.scrollY;
      const previous = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        width: body.style.width,
        paddingRight: body.style.paddingRight,
        overflow: documentElement.style.overflow,
      };
      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      const paddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0;

      Object.assign(body.style, {
        position: "fixed",
        top: `-${y}px`,
        left: `-${x}px`,
        width: "100%",
        paddingRight: `${paddingRight + scrollbarWidth}px`,
      });
      documentElement.style.overflow = "hidden";
      restorePage = () => {
        const { overflow, ...bodyStyles } = previous;
        Object.assign(body.style, bodyStyles);
        documentElement.style.overflow = overflow;
        window.scrollTo({ left: x, top: y, behavior: "instant" });
      };

      // Native modal dialogs make the page inert and keep keyboard focus inside.
      dialog.showModal();
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Removing the listeners also prevents repeats for this page visit.
      }
    };

    const onWheel = (event) => {
      if (event.deltaY > 0 && !event.ctrlKey) show();
    };
    const onTouchStart = (event) => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event) => {
      if (touchY !== null && event.touches.length === 1 && touchY - event.touches[0].clientY > 12) show();
    };
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest(
        "input, textarea, select, button, a, [contenteditable], [role='slider']",
      )) return;
      if (["ArrowDown", "PageDown", "End", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
    };
    const onScroll = () => {
      if (window.scrollY - initialScrollY > 48) show();
    };
    function removeListeners() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    dialog.addEventListener("close", unlock);

    return () => {
      removeListeners();
      unlock();
      dialog.removeEventListener("close", unlock);
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="welcome-poster-title"
      aria-describedby="welcome-poster-description"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
      }}
    >
      <button type="button" onClick={dismiss} className={styles.close} aria-label="Close">
        <X size={16} aria-hidden="true" />
      </button>

      <a href={channelHref} {...linkProps(channelHref)} className={styles.site}>
        <span className={styles.siteBar} aria-hidden="true" />
        youtube.com/<strong>{channelHandle}</strong>
      </a>

      <div className={styles.body}>
        <div className={styles.visual}>
          <span className={styles.shapeBack} aria-hidden="true" />
          <span className={styles.shape} aria-hidden="true" />
          <Image
            src="/images/lk-mentor-cutout-bw.webp"
            alt="LK, your trading mentor"
            width={1122}
            height={1402}
            sizes="(max-width: 639px) 45vw, 210px"
            loading="eager"
            className={styles.portrait}
          />
        </div>

        <div className={styles.copy}>
          <span className={styles.pill}>
            <span className={styles.liveDot} aria-hidden="true" /> Daily Livestream
          </span>
          <h2 id="welcome-poster-title" className={styles.headline}>
            Trade the <br />markets <b>live</b> <br /><b>with <em>LK!</em></b>
          </h2>
          <p id="welcome-poster-description" className={styles.description}>
            Join every trading day on YouTube for <b>real charts, real setups.</b>
          </p>
        </div>
      </div>

      <div className={styles.message}>
        <span className={styles.messageIcon} aria-hidden="true"><ChevronRight size={22} strokeWidth={3} /></span>
        <p>Your trading growth starts with <b>watching it live.</b></p>
      </div>

      <div className={styles.actions}>
        <a href={liveHref} {...linkProps(liveHref)} onClick={dismiss} className={styles.primary}>
          <Youtube size={17} aria-hidden="true" /> Watch <b>Live</b>
        </a>
        <button type="button" onClick={dismiss} className={styles.skip}>Maybe later</button>
      </div>

      <div className={styles.footer}>
        <span className={styles.logo}>
          <Image src="/Logo.png" alt="" width={22} height={22} /> {siteName}
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.meta}>
          <Radio size={16} aria-hidden="true" />
          <span><small>Live on YouTube</small>Every trading day</span>
        </span>
      </div>
      <p className={styles.fine}>
        Educational content only, not financial advice. Trading involves risk.
      </p>
    </dialog>
  );
}
