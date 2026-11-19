"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ActivationLoader } from "./BrokerRedirectLink";
import styles from "./BrokerActivationSlider.module.css";

const KNOB_SIZE = 46;
const INSET = 6;

export default function BrokerActivationSlider({ href, label = "Activate Your Trading Terminal" }) {
  const trackRef = useRef(null);
  const ignoreClickUntil = useRef(0);
  const active = useRef(false);
  const helpId = useId();
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState(0);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const fillWidth = useTransform(x, (value) => value + KNOB_SIZE);
  const labelOpacity = useTransform(x, (value) => 1 - Math.min(1, value / Math.max(1, travel * 0.7)));

  useEffect(() => {
    const track = trackRef.current;
    const resize = () => {
      setTravel(Math.max(0, track.clientWidth - KNOB_SIZE - INSET * 2));
      if (!active.current) x.set(0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(track);
    return () => observer.disconnect();
  }, [x]);

  const reset = useCallback(() => {
    active.current = false;
    ignoreClickUntil.current = 0;
    setLoading(false);
    animate(x, 0, { duration: reducedMotion ? 0 : 0.25 });
    requestAnimationFrame(() => trackRef.current?.focus({ preventScroll: true }));
  }, [x, reducedMotion]);

  const activate = () => {
    if (active.current) return;
    active.current = true;
    animate(x, travel, { duration: reducedMotion ? 0 : 0.2 });
    setLoading(true);
  };

  return (
    <div className={styles.wrapper}>
      <button
        ref={trackRef}
        type="button"
        className={styles.track}
        aria-label={label}
        aria-describedby={helpId}
        aria-haspopup="dialog"
        disabled={loading}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate();
          }
        }}
        onClick={(event) => {
          if (event.detail === 0 || Date.now() >= ignoreClickUntil.current) activate();
        }}
      >
        <motion.span className={styles.fill} style={{ width: fillWidth }} aria-hidden="true" />
        <motion.span className={styles.label} style={{ opacity: labelOpacity }} aria-hidden="true">
          <span className="activate-shimmer">{label}</span>
          <span className={styles.chevrons}>
            <ChevronRight size={15} /><ChevronRight size={15} /><ChevronRight size={15} />
          </span>
        </motion.span>
        <motion.span
          className={styles.knob}
          aria-hidden="true"
          drag="x"
          dragConstraints={{ left: 0, right: travel }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x, touchAction: "pan-y" }}
          onDragStart={() => { ignoreClickUntil.current = Infinity; }}
          onDragEnd={() => {
            ignoreClickUntil.current = Date.now() + 350;
            if (travel > 0 && x.get() >= travel * 0.85) activate();
            else animate(x, 0, { duration: reducedMotion ? 0 : 0.25 });
          }}
        >
          <ArrowRight size={21} strokeWidth={2} />
        </motion.span>
      </button>
      <p id={helpId} className={styles.hint}>Swipe right to get started. You can also tap or press Enter.</p>
      {loading && createPortal(<ActivationLoader href={href} onCancel={reset} />, document.body)}
    </div>
  );
}
