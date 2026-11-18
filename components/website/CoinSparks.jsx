"use client";

import { useEffect, useImperativeHandle, useRef } from "react";

const MAX_PARTICLES = 80;

export default function CoinSparks({ ref, diameter, reduced }) {
  const canvasRef = useRef(null);
  const emitRef = useRef(null);

  useImperativeHandle(ref, () => ({
    emit: (movement) => emitRef.current?.(movement),
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !diameter) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // The canvas stays in screen space, outside the coin's rotating 3D group.
    const size = diameter * 2;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * pixelRatio);
    canvas.height = Math.round(size * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (reduced) return;

    const glow = document.createElement("canvas");
    glow.width = glow.height = 24;
    const glowContext = glow.getContext("2d");
    if (!glowContext) return;
    const gradient = glowContext.createRadialGradient(12, 12, 0, 12, 12, 12);
    gradient.addColorStop(0, "rgba(255,249,217,1)");
    gradient.addColorStop(0.15, "rgba(255,220,116,0.9)");
    gradient.addColorStop(0.4, "rgba(238,165,45,0.3)");
    gradient.addColorStop(1, "rgba(218,135,22,0)");
    glowContext.fillStyle = gradient;
    glowContext.fillRect(0, 0, 24, 24);

    const scale = Math.min(1.2, Math.max(0.65, diameter / 330));
    const particles = [];
    let frame = 0;
    let previousTime = 0;
    let lastEmission = -Infinity;

    function draw(time) {
      const dt = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      context.clearRect(0, 0, size, size);
      context.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = (time - p.born) / 1000;
        if (age >= p.life) {
          particles.splice(i, 1);
          continue;
        }

        p.vx *= Math.exp(-1.1 * dt);
        p.vy += 135 * scale * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const shimmer = 0.75 + Math.sin(age * 24 + p.phase) * 0.25;
        const fade = Math.min(age / 0.035, 1) * (1 - age / p.life) ** 1.4;
        context.globalAlpha = fade * shimmer;

        // Fine warm trails with a bright core; a few grains briefly catch light.
        context.strokeStyle = "#eeb64f";
        context.lineWidth = p.radius * 0.6;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(p.x - p.vx * 0.022, p.y - p.vy * 0.022);
        context.stroke();
        const glowSize = p.radius * 8;
        context.drawImage(glow, p.x - glowSize / 2, p.y - glowSize / 2, glowSize, glowSize);

        if (p.glint && shimmer > 0.94) {
          context.strokeStyle = "#fff3cc";
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(p.x - p.radius * 2.5, p.y);
          context.lineTo(p.x + p.radius * 2.5, p.y);
          context.moveTo(p.x, p.y - p.radius * 2.5);
          context.lineTo(p.x, p.y + p.radius * 2.5);
          context.stroke();
        }
      }

      context.globalAlpha = 1;
      frame = particles.length ? requestAnimationFrame(draw) : 0;
    }

    emitRef.current = ({ deltaX, velocity, rotation, offsetY }) => {
      const time = performance.now();
      if (Math.abs(deltaX) < 0.5 || time - lastEmission < 28) return;
      lastEmission = time;
      const energy = Math.min(Math.abs(velocity) / 650, 1);
      const direction = Math.sign(deltaX);
      const projection = Math.max(0.08, Math.abs(Math.cos(rotation * Math.PI / 180)));
      const count = Math.min(3 + Math.round(energy * 5), MAX_PARTICLES - particles.length);

      for (let i = 0; i < count; i++) {
        const side = Math.random() < 0.8 ? direction : -direction;
        // Shed sparks from the bottom rim where the coin meets its podium.
        // Keep this origin attached to the coin, regardless of pointer height.
        const theta = Math.PI / 2 + (Math.random() - 0.5) * 0.42;
        particles.push({
          x: diameter + Math.cos(theta) * diameter * 0.49 * projection,
          y: diameter + Math.sin(theta) * diameter * 0.49 + offsetY,
          vx: side * (35 + energy * 115 + Math.random() * 45) * scale,
          vy: (Math.sin(theta) * 30 - 30 - Math.random() * 65) * scale,
          radius: (0.6 + Math.random() * 1.1) * scale,
          life: 0.55 + Math.random() * 0.65,
          born: time,
          phase: Math.random() * Math.PI * 2,
          glint: Math.random() < 0.18,
        });
      }

      // No idle animation loop: render only while emitted particles remain.
      if (!frame) {
        previousTime = time;
        frame = requestAnimationFrame(draw);
      }
    };

    return () => {
      emitRef.current = null;
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, size, size);
    };
  }, [diameter, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute z-10"
      // These offsets must match the drawing origin (diameter, diameter).
      // Explicit styles also prevent a missing utility from placing the canvas
      // after the coin and adding scrollable space below the footer.
      style={{ top: "-50%", left: "-50%", width: "200%", height: "200%" }}
    />
  );
}
