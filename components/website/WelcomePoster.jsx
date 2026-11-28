"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, X, Youtube } from "lucide-react";
import styles from "./WelcomePoster.module.css";
import { Coin, CoinSprite, GoldStack } from "./WelcomeVectors";

const SESSION_KEY = "lk55-welcome-poster-seen";

// Coins drifting up behind LK: horizontal position, size, timing, depth.
// Negative delays mean coins are already mid-flight when the popup opens.
const FLOATING_COINS = [
  { x: "6%", size: 34, dur: 7.5, delay: -1, blur: 0, op: 0.9, tilt: "-12deg" },
  { x: "22%", size: 22, dur: 9, delay: -5.5, blur: 1.5, op: 0.55, tilt: "18deg" },
  { x: "38%", size: 28, dur: 8, delay: -3, blur: 0.6, op: 0.75, tilt: "6deg" },
  { x: "55%", size: 40, dur: 10, delay: -7.5, blur: 0, op: 0.9, tilt: "-20deg" },
  { x: "70%", size: 20, dur: 8.5, delay: -2, blur: 2, op: 0.5, tilt: "10deg" },
  { x: "82%", size: 30, dur: 7, delay: -4.5, blur: 0.4, op: 0.8, tilt: "-6deg" },
  { x: "14%", size: 18, dur: 11, delay: -9, blur: 2.4, op: 0.45, tilt: "24deg" },
  { x: "64%", size: 24, dur: 9.5, delay: -0.5, blur: 1, op: 0.65, tilt: "-15deg" },
];
const linkProps = (href) =>
  /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function WelcomePoster({
  siteName = "Trade with LK",
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

      <header className={styles.header}>
        <a href={channelHref} {...linkProps(channelHref)} className={styles.brand}>
          <Image src="/Logo.png" alt="" width={36} height={36} />
          <span>{siteName}<small>{channelHandle}</small></span>
        </a>
      </header>

      <div className={styles.body}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>A seat in the trading room</span>
          <h2 id="welcome-poster-title" className={styles.headline}>
            Real charts.<br />Learn live.<br /><span>With LK.</span>
          </h2>
        </div>
        <div className={styles.visual}>
          <CoinSprite />
          <div className={styles.stage}>
            <div className={styles.coinField} aria-hidden="true">
              {FLOATING_COINS.map((c, i) => (
                <Coin
                  key={i}
                  className={styles.floatCoin}
                  style={{
                    "--x": c.x,
                    "--size": `${c.size}px`,
                    "--dur": `${c.dur}s`,
                    "--delay": `${c.delay}s`,
                    "--blur": `${c.blur}px`,
                    "--op": c.op,
                    "--tilt": c.tilt,
                  }}
                />
              ))}
            </div>
            <Image
              src="/images/lk-mentor-thumbnail.webp"
              alt="LK, your trading mentor"
              width={1122}
              height={1402}
              sizes="(max-width: 599px) 36vw, 260px"
              loading="eager"
              className={styles.portrait}
            />
          </div>
          <GoldStack className={styles.goldStack} />
        </div>

        <div className={styles.details}>
          <p id="welcome-poster-description" className={styles.description}>
            Understand the setup, the entry and the risk. Join LK on YouTube for live market breakdowns every trading day.
          </p>
          <p className={styles.markets}>Gold <span aria-hidden="true">/</span> Forex <span aria-hidden="true">/</span> Crypto</p>
        </div>
        <div className={styles.actions}>
          <a href={liveHref} {...linkProps(liveHref)} onClick={dismiss} className={styles.primary}>
            <Youtube size={19} aria-hidden="true" /> Watch on YouTube
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <button type="button" onClick={dismiss} className={styles.skip}>Explore the website</button>
        </div>
      </div>
      <p className={styles.fine}>
        Educational content only, not financial advice. Trading involves risk.
      </p>
    </dialog>
  );
}
