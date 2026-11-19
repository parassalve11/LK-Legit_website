"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CoinSparks from "./CoinSparks";

// ============================================================
// HeroCoin — the LK coin revolving on its rock podium.
//
// Circular, embossed gold faces and a milled rim share one CSS 3D
// context. Each face has a reflection driven by its rotation so
// the gold catches the light during automatic and manual spins.
//
// drive="auto"   — revolves continuously; scrolling does not touch it.
// drive="scroll" — angle follows scroll as the coin comes into view.
// Dragging interferes with the spin in both modes.
// ============================================================

// Fewer rim panels on small coins: each panel is its own 3D layer, and the
// footer coin or a phone-sized hero coin cannot show 52 distinct reeds anyway.
const edgePanels = (d) => (d < 220 ? 24 : d < 380 ? 36 : 48);
const THICKNESS_RATIO = 0.065;
const BASE_SPEED = 26; // degrees per second
const DRAG_GAIN = 0.55; // degrees per pixel dragged
const SETTLE = 0.7;

const CONTACT_Y = 0.686; // podium contact point, fraction of the platform image
const COIN_SCALE = 0.56;

function reedGradient(panelWidth) {
  const reed = Math.max(3.2, panelWidth / 7);
  return (
    `repeating-linear-gradient(90deg,` +
    ` #7d5a1c 0px,` +
    ` #d9a63c ${reed * 0.28}px,` +
    ` #fff3d0 ${reed * 0.5}px,` +
    ` #d9a63c ${reed * 0.72}px,` +
    ` #7d5a1c ${reed}px)`
  );
}

export default function HeroCoin({
  src = "/coin-face-gold.webp",
  platform,
  drive = "auto",
  scrollSpin = 360,
  shadow = Boolean(platform),
  className,
}) {
  const root = useRef(null);
  const stage = useRef(null);
  const sparks = useRef(null);
  const [diameter, setDiameter] = useState(0);
  const reduced = useReducedMotion();

  // The 3D layout needs real pixels (translateZ has no percentage form).
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setDiameter(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Stop revolving once scrolled away — no point burning frames unseen.
  const onScreen = useRef(true);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const angle = useMotionValue(0);
  const speed = useRef(BASE_SPEED);
  const dragging = useRef(false);
  const dragOffset = useRef(0);

  // Hooks cannot be conditional, so useScroll always runs; its output is only
  // written to the angle when drive="scroll". The sweep finishes once the coin
  // is fully in view — a footer can never scroll past the viewport top, so an
  // "end start" range would strand it mid-turn at the bottom of the page.
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start end", "end end"],
  });
  const scrollDeg = useTransform(scrollYProgress, [0, 1], [0, scrollSpin]);
  const smoothScrollDeg = useSpring(scrollDeg, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
    restDelta: 0.01,
  });
  useMotionValueEvent(smoothScrollDeg, "change", (v) => {
    if (drive === "scroll" && !dragging.current && !reduced) {
      angle.set(v + dragOffset.current);
    }
  });

  const pointerPitch = useMotionValue(0);
  const pitch = useSpring(pointerPitch, { stiffness: 55, damping: 14 });
  const bob = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    if (reduced || !onScreen.current) return;
    const dt = Math.min(delta, 50) / 1000;
    if (drive === "auto" && !dragging.current) {
      speed.current += (BASE_SPEED - speed.current) * Math.min(1, SETTLE * dt);
      angle.set(angle.get() + speed.current * dt);
    }
    bob.set(Math.sin(t / 2400) * 6);
  });

  const rotateY = angle;
  const rotateX = useTransform([pitch], ([p]) => -2.5 + p);

  const facing = useTransform(rotateY, (deg) => Math.abs(Math.cos((deg * Math.PI) / 180)));
  // Dimming is an overlay's opacity, not a CSS filter: opacity is composited
  // on the GPU, while an animated filter repaints both faces every frame.
  const faceDim = useTransform(facing, (f) => (1 - f) * 0.1);
  const glowOpacity = useTransform(facing, [0, 1], [0.3, 0.72]);
  const contactScale = useTransform(facing, [0, 1], [0.5, 1]);
  const contactOpacity = useTransform(facing, [0, 1], [0.45, 0.85]);

  const lastX = useRef(0);
  const lastT = useRef(0);

  const onPointerDown = (e) => {
    if (reduced) return;
    dragging.current = true;
    lastX.current = e.clientX;
    lastT.current = e.timeStamp;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerPitch.set((((e.clientY - r.top) / r.height) * 2 - 1) * -10);
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    const dt = Math.max(1, e.timeStamp - lastT.current);
    dragOffset.current += dx * DRAG_GAIN;
    angle.set(angle.get() + dx * DRAG_GAIN);
    speed.current = (dx * DRAG_GAIN * 1000) / dt;
    sparks.current?.emit({
      deltaX: dx,
      velocity: speed.current,
      rotation: angle.get(),
      offsetY: bob.get(),
    });
    lastX.current = e.clientX;
    lastT.current = e.timeStamp;
  };

  const endDrag = (e) => {
    if (dragging.current && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragging.current = false;
    // Cap the throw so a violent flick cannot spin it into a blur.
    speed.current = Math.max(-900, Math.min(900, speed.current));
  };

  const onPointerLeave = (e) => {
    pointerPitch.set(0);
    endDrag(e);
  };

  const radius = diameter / 2;
  const thickness = diameter * THICKNESS_RATIO;
  const panelCount = edgePanels(diameter);
  const panelWidth = diameter ? (Math.PI * diameter) / panelCount + 1.5 : 0;

  return (
    <div ref={root} className={className}>
      <div
        className="relative w-full"
        style={{ aspectRatio: platform ? "1448 / 1086" : "1 / 1" }}
      >
        {/* Rock podium. The source render carries its own candlestick backdrop, so it
            is masked down to the plinth and screen-blended: the remaining near-black
            pixels drop into the page instead of showing a rectangular plate. */}
        {platform && (
          <img
            src={platform}
            alt=""
            aria-hidden
            draggable={false}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full select-none object-contain"
            style={{
              mixBlendMode: "screen",
              // Horizontal radius is exactly 50%, so the fade reaches fully
              // transparent right at the image edge — no rectangular seam. The
              // solid region still runs to 80% of that (x 10%–90%), which
              // covers the whole plinth (~12%–89%). Everything above it, the
              // candlestick backdrop, fades out.
              WebkitMaskImage:
                "radial-gradient(ellipse 50% 40% at 50% 78%, #000 80%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 50% 40% at 50% 78%, #000 80%, transparent 100%)",
            }}
          />
        )}

        <div
          className="absolute touch-pan-y cursor-grab active:cursor-grabbing motion-reduce:cursor-default motion-reduce:active:cursor-default"
          style={{
            width: platform ? `${COIN_SCALE * 100}%` : "100%",
            left: "50%",
            top: platform ? `${CONTACT_Y * 100}%` : "50%",
            transform: platform ? "translate(-50%, -100%)" : "translate(-50%, -50%)",
            perspective: 1600,
            perspectiveOrigin: "50% 55%",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={onPointerLeave}
        >
          <div ref={stage} className="relative aspect-square w-full">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-[-34%] rounded-full"
              style={{
                opacity: glowOpacity,
                willChange: "opacity",
                // A soft gradient instead of a 70px blur filter, which is very
                // expensive to re-composite on phones.
                background:
                  "radial-gradient(circle closest-side at 50% 50%, rgba(255,224,138,0.34), rgba(212,175,55,0.14) 45%, rgba(212,175,55,0.05) 72%, transparent 100%)",
              }}
            />

            <motion.div
              className="relative h-full w-full"
              style={{
                rotateY,
                rotateX,
                y: reduced ? 0 : bob,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* Milled rim: a cylinder of thin panels around the Z axis. */}
              <div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d", transform: "rotateX(90deg)" }}
              >
                {diameter > 0 &&
                  Array.from({ length: panelCount }, (_, i) => {
                    const a = (i / panelCount) * 360;
                    // Gentle key light: enough to read as metal, never enough to go
                    // muddy — the panels revolve, so a wide dark range would swing
                    // dull faces into view at the edge-on pose.
                    const shade = 0.82 + 0.3 * Math.max(0, Math.cos(((a - 32) * Math.PI) / 180));
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          width: panelWidth,
                          height: thickness,
                          marginLeft: -panelWidth / 2,
                          marginTop: -thickness / 2,
                          transform: `rotateY(${a}deg) translateZ(${radius}px)`,
                          // Shade is baked into a tint layer rather than a per-panel filter.
                          backgroundImage: `${shadeLayer(shade)}, linear-gradient(180deg, rgba(255,248,225,0.5), rgba(255,255,255,0) 30%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.42)), ${reedGradient(panelWidth)}`,
                        }}
                      />
                    );
                  })}
              </div>

              <CoinFace src={src} z={thickness / 2} dim={faceDim} angle={angle} />
              <CoinFace src={src} z={thickness / 2} dim={faceDim} angle={angle} back />
            </motion.div>
            <CoinSparks ref={sparks} diameter={diameter} reduced={reduced} />
          </div>

          {shadow && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 h-[9%] w-[70%] -translate-x-1/2 translate-y-1/2 rounded-[50%]"
              style={{
                scaleX: contactScale,
                opacity: contactOpacity,
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 45%, transparent 72%)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function shadeLayer(shade) {
  const tint =
    shade < 1
      ? `rgba(0,0,0,${(1 - shade).toFixed(3)})`
      : `rgba(255,244,214,${((shade - 1) * 0.55).toFixed(3)})`;
  return `linear-gradient(${tint}, ${tint})`;
}

// The light band is painted once and slid across the face with a transform,
// so the sweep is composited instead of regenerating a gradient each frame.
const REFLECTION_BAND =
  "linear-gradient(110deg, transparent 20%, rgba(255,239,181,0.08) 34%, rgba(255,250,221,0.3) 50%, rgba(255,239,181,0.08) 66%, transparent 80%)";

function CoinFace({ src, z, dim, angle, back = false }) {
  // Offset the reverse face's lighting by half a turn. This keeps the light
  // moving across the visible metal in the same direction on either side.
  const reflectionX = useTransform(angle, (degrees) => {
    const phase = ((degrees + (back ? 180 : 0)) * Math.PI) / 180;
    return `${Math.sin(phase) * 48}%`;
  });

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-full"
      style={{
        transform: `translateZ(${back ? -z : z}px)${back ? " rotateY(180deg)" : ""}`,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        backgroundColor: "#dcae47",
      }}
    >
      <img
        src={src}
        alt={back ? "" : "LK Level King gold coin"}
        aria-hidden={back || undefined}
        draggable={false}
        className="block h-full w-full select-none rounded-full"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ x: reflectionX, background: REFLECTION_BAND }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-black"
        style={{ opacity: dim }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,236,167,0.7), inset 0 2px 4px rgba(255,249,213,0.28), inset 0 -2px 5px rgba(113,67,7,0.24)",
        }}
      />
    </motion.div>
  );
}
