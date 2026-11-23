"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, ChevronsRight } from "lucide-react";
import styles from "./TradingTerminalLink.module.css";

export default function TradingTerminalLink({ href, compact = false, onClick }) {
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const active = useRef(false);
  const resetTimer = useRef(null);
  const hintId = useId();
  const [travel, setTravel] = useState(0);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const labelOpacity = useTransform(x, (value) => 1 - Math.min(1, value / Math.max(1, travel * 0.55)));
  const fillScale = useTransform(x, (value) => Math.min(1, value / Math.max(1, travel)));

  useEffect(() => {
    const track = trackRef.current;
    const resize = () => {
      setTravel(Math.max(0, track.clientWidth - knobRef.current.offsetWidth - 12));
      x.set(0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(track);
    return () => {
      observer.disconnect();
      clearTimeout(resetTimer.current);
    };
  }, [x]);

  const activate = () => {
    if (active.current) return;
    active.current = true;
    animate(x, travel, { duration: reducedMotion ? 0 : 0.15 });
    const destination = href || "https://my.bytefx.com/login";
    const tab = window.open(destination, "_blank");
    if (tab) tab.opener = null;
    else window.location.assign(destination);
    resetTimer.current = setTimeout(() => {
      active.current = false;
      animate(x, 0, { duration: reducedMotion ? 0 : 0.2 });
    }, 600);
    onClick?.();
  };

  return (
    <button
      ref={trackRef}
      type="button"
      onClick={(event) => { if (event.detail === 0) activate(); }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!event.repeat) activate();
        }
      }}
      className={`${styles.capsule}${compact ? ` ${styles.compact}` : ""}`}
      aria-label="Activate your trading terminal — ByteFX login (opens in a new tab)"
      aria-describedby={hintId}
    >
      <motion.span className={styles.fill} style={{ scaleX: fillScale }} aria-hidden="true" />
      <motion.span className={styles.label} style={{ opacity: labelOpacity }} aria-hidden="true">
        <span>Activate your<br />trading terminal</span>
        <ChevronsRight size={14} className={styles.chevrons} />
      </motion.span>
      <Image
        src="/images/terminal-phone-laptop.webp"
        alt=""
        width={480}
        height={332}
        sizes="(max-width: 359px) 66px, 86px"
        className={styles.devices}
        draggable={false}
      />
      <motion.span
        ref={knobRef}
        className={styles.knob}
        aria-hidden="true"
        drag="x"
        dragConstraints={{ left: 0, right: travel }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x, touchAction: "pan-y" }}
        onDragEnd={() => {
          if (travel > 0 && x.get() >= travel * 0.85) activate();
          else animate(x, 0, { duration: reducedMotion ? 0 : 0.2 });
        }}
      >
        <ArrowRight size={18} strokeWidth={2.5} />
      </motion.span>
      <span id={hintId} className="sr-only">Swipe the arrow right toward the devices, or press Enter or Space, to open ByteFX login.</span>
    </button>
  );
}
