"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Check, Play, Sparkles, X } from "lucide-react";
import styles from "./WelcomePoster.module.css";

const SESSION_KEY = "lk55-welcome-poster-seen";
const linkProps = (href) =>
  /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function WelcomePoster({
  siteName = "Trade with LK55",
  communityHref = "#contact",
  lessonsHref = "#videos",
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
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <Image src="/Logo.png" alt="" width={36} height={36} />
          <span>{siteName}</span>
        </div>
        <span className={styles.welcomeLabel}>A better place to begin</span>
        <button type="button" onClick={dismiss} className={styles.close} aria-label="Close welcome poster">
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.visual}>
          <div className={styles.arch} aria-hidden="true">
            <svg viewBox="0 0 300 360" fill="none" preserveAspectRatio="none">
              <path d="M0 280 45 235 80 252 126 173 165 195 215 108 250 127 300 38" />
              <path d="M0 320 45 275 80 292 126 213 165 235 215 148 250 167 300 78" />
            </svg>
          </div>
          <Image
            src="/images/lk-mentor-thumbnail.webp"
            alt="LK in his patterned shirt, with his arms crossed"
            width={1122}
            height={1402}
            sizes="(max-width: 639px) 44vw, 380px"
            loading="eager"
            className={styles.portrait}
          />
          <div className={styles.nameplate}>
            <strong>LK</strong>
            <span>Trader. Educator. Your mentor.</span>
          </div>
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>Welcome to your next chapter</p>
          <h2 id="welcome-poster-title" className={styles.headline}>
            Less guessing.<br />More <span>clarity.</span>
          </h2>
          <p id="welcome-poster-description" className={styles.description}>
            Learn to read the charts, understand the risk and build a process you can trust.
          </p>
          <ul className={styles.benefits}>
            {["Live chart breakdowns", "Risk-first learning", "A community to grow with"].map((item) => (
              <li key={item}><Check size={15} aria-hidden="true" />{item}</li>
            ))}
          </ul>
          <p className={styles.signoff}>Learn with <strong>LK.</strong> Grow at your pace.</p>
        </div>
      </div>

      <div className={styles.message}>
        <span className={styles.messageIcon}><Sparkles size={23} aria-hidden="true" /></span>
        <div>
          <p>Start with the process. <strong>The confidence follows.</strong></p>
          <span>Learn. Analyze. Execute.</span>
        </div>
      </div>

      <div className={styles.footer}>
        <a href={communityHref} {...linkProps(communityHref)} onClick={dismiss} className={styles.primary}>
          Join the community <ArrowRight size={17} aria-hidden="true" />
        </a>
        <a href={lessonsHref} {...linkProps(lessonsHref)} onClick={dismiss} className={styles.secondary}>
          <Play size={15} aria-hidden="true" /> Explore free lessons
        </a>
        <button type="button" onClick={dismiss} className={styles.skip}>I’ll explore first</button>
      </div>
    </dialog>
  );
}
