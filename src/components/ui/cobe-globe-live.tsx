"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface LiveMarker {
  id: string;
  location: [number, number];
  /** Floating tag text (port name). Omit to show only a map dot. */
  label?: string;
}

interface GlobeLiveProps {
  markers?: LiveMarker[];
  className?: string;
  speed?: number;
}

const defaultMarkers: LiveMarker[] = [
  { id: "sf", location: [37.78, -122.44], label: "San Francisco" },
  { id: "london", location: [51.51, -0.13], label: "London" },
  { id: "tokyo", location: [35.68, 139.65], label: "Tokyo" },
  { id: "paris", location: [48.86, 2.35], label: "Paris" },
  { id: "sydney", location: [-33.87, 151.21], label: "Sydney" },
  { id: "nyc", location: [40.71, -74.01], label: "New York" },
];

const RING_GAP = 36;
const TAG_PAD = 22;
const TAG_GAP = 10;

function tagTransform(x: number, y: number) {
  return `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
}

export function GlobeLive({
  markers = defaultMarkers,
  className = "",
  speed = 0.0025,
}: GlobeLiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;
    const tagEls = Array.from(
      root.querySelectorAll<HTMLElement>(".globe-port-tag"),
    );

    let lastFacingKey = "";

    function placeOnRing(
      els: HTMLElement[],
      r: number,
      cx: number,
      cy: number,
      startAngle: number,
    ) {
      const n = els.length;
      if (n === 0) return [] as { el: HTMLElement; x: number; y: number; w: number; h: number }[];

      const widths = els.map((el) => Math.max(el.offsetWidth, 48));
      const heights = els.map((el) => Math.max(el.offsetHeight, 22));
      const sumW = widths.reduce((a, b) => a + b, 0);
      const pad = Math.max(TAG_PAD, (Math.PI * 2 * r - sumW) / n);
      const placed: { el: HTMLElement; x: number; y: number; w: number; h: number }[] = [];

      let angle = startAngle - widths[0] / 2 / r;
      for (let i = 0; i < n; i++) {
        angle += widths[i] / 2 / r;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        placed.push({ el: els[i], x, y, w: widths[i], h: heights[i] });
        angle += widths[i] / 2 / r + pad / r;
      }
      return placed;
    }

    function separate(
      items: { el: HTMLElement; x: number; y: number; w: number; h: number }[],
      cx: number,
      cy: number,
      minR: number,
      rootW: number,
      rootH: number,
    ) {
      for (let iter = 0; iter < 14; iter++) {
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i];
            const b = items[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const overlapX = (a.w + b.w) / 2 + TAG_GAP - Math.abs(dx);
            const overlapY = (a.h + b.h) / 2 + TAG_GAP - Math.abs(dy);
            if (overlapX <= 0 || overlapY <= 0) continue;

            let nx = dx;
            let ny = dy;
            const len = Math.hypot(nx, ny);
            if (len < 0.001) {
              const ang = (i + j) * 1.7;
              nx = Math.cos(ang);
              ny = Math.sin(ang);
            } else {
              nx /= len;
              ny /= len;
            }
            const push = Math.min(overlapX, overlapY) / 2 + 0.5;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }

        for (const item of items) {
          const vx = item.x - cx;
          const vy = item.y - cy;
          const dist = Math.hypot(vx, vy) || 1;
          if (dist < minR) {
            item.x = cx + (vx / dist) * minR;
            item.y = cy + (vy / dist) * minR;
          }
          const hw = item.w / 2 + 4;
          const hh = item.h / 2 + 4;
          item.x = Math.min(rootW - hw, Math.max(hw, item.x));
          item.y = Math.min(rootH - hh, Math.max(hh, item.y));
        }
      }
    }

    function placeEven(els: HTMLElement[]) {
      const n = els.length;
      if (n === 0 || !root || !canvas) return;

      const rootRect = root.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const cx = canvasRect.left - rootRect.left + canvasRect.width / 2;
      const cy = canvasRect.top - rootRect.top + canvasRect.height / 2;
      const widths = els.map((el) => Math.max(el.offsetWidth, 48));
      const sumW = widths.reduce((a, b) => a + b, 0);
      const maxW = Math.max(...widths);
      const minR = canvasRect.width / 2 + RING_GAP;
      const maxR =
        Math.min(rootRect.width, rootRect.height) / 2 - maxW / 2 - 8;
      const neededR = (sumW + n * TAG_PAD) / (Math.PI * 2);
      const twoRings = neededR > maxR && n >= 6;

      let placed: { el: HTMLElement; x: number; y: number; w: number; h: number }[];

      if (twoRings) {
        const inner = els.filter((_, i) => i % 2 === 0);
        const outer = els.filter((_, i) => i % 2 === 1);
        const innerR = minR;
        const outerR = Math.max(minR + 28, Math.min(maxR, minR + 36));
        placed = [
          ...placeOnRing(inner, innerR, cx, cy, -Math.PI / 2),
          ...placeOnRing(outer, outerR, cx, cy, -Math.PI / 2 + Math.PI / outer.length),
        ];
      } else {
        const r = Math.min(Math.max(minR, neededR), Math.max(minR, maxR));
        placed = placeOnRing(els, r, cx, cy, -Math.PI / 2);
      }

      separate(placed, cx, cy, minR, rootRect.width, rootRect.height);
      for (const item of placed) {
        item.el.style.transform = tagTransform(item.x, item.y);
      }
    }

    function syncFades() {
      const rootStyle = getComputedStyle(document.documentElement);
      const facing: HTMLElement[] = [];
      for (const el of tagEls) {
        const id = el.dataset.portId ?? "";
        const on =
          rootStyle.getPropertyValue(`--cobe-visible-${id}`).trim() !== "";
        if (on) facing.push(el);
      }

      const key = facing.map((el) => el.dataset.portId).join("|");
      if (key !== lastFacingKey) {
        const appearing = facing.filter((el) => !el.classList.contains("is-on"));
        for (const el of appearing) {
          el.style.transition = "opacity 0.5s ease-in-out";
        }
        placeEven(facing);
        lastFacingKey = key;
        for (const el of appearing) {
          el.classList.add("is-on");
        }
        for (const el of tagEls) {
          if (!facing.includes(el)) el.classList.remove("is-on");
        }
        requestAnimationFrame(() => {
          for (const el of appearing) el.style.transition = "";
        });
        return;
      }

      for (const el of tagEls) {
        const on = facing.includes(el);
        if (el.classList.contains("is-on") !== on) {
          el.classList.toggle("is-on", on);
        }
      }
    }

    function init() {
      if (!canvas) return;
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.15,
        dark: 0,
        diffuse: 1.4,
        mapSamples: 14000,
        mapBrightness: 8,
        baseColor: [0.92, 0.91, 0.88],
        markerColor: [0.72, 0.55, 0.08],
        glowColor: [0.96, 0.95, 0.93],
        markerElevation: 0.02,
        markers: markers.map((m) => ({
          location: m.location,
          size: m.label ? 0.055 : 0.028,
          id: m.id,
        })),
        arcs: [],
        arcColor: [0.72, 0.55, 0.08],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.85,
      });

      placeEven(tagEls.filter((el) => el.classList.contains("is-on")));

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.15 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        syncFades();
        animationId = requestAnimationFrame(animate);
      }
      animationId = requestAnimationFrame(animate);
      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1";
      });
    }

    const resize = new ResizeObserver(() => {
      if (!globe) return;
      lastFacingKey = "";
      syncFades();
    });
    resize.observe(root);

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const wait = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          wait.disconnect();
          init();
        }
      });
      wait.observe(canvas);
      return () => {
        wait.disconnect();
        resize.disconnect();
        if (animationId) cancelAnimationFrame(animationId);
        if (globe) globe.destroy();
      };
    }

    return () => {
      resize.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  const tagged = markers.filter((m) => m.label);

  return (
    <div ref={rootRef} className={`globe-live ${className}`}>
      <div className="globe-live-stage">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="globe-live-canvas"
        />
      </div>
      {tagged.map((m) => (
        <div key={m.id} className="globe-port-tag" data-port-id={m.id}>
          {m.label}
        </div>
      ))}
    </div>
  );
}
