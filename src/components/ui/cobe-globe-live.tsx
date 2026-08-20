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

const TAU = Math.PI * 2;
const RING_GAP = 40;
const TAG_GAP = 10;

function tagTransform(x: number, y: number) {
  return `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
}

function wrapAngle(a: number) {
  return ((a % TAU) + TAU) % TAU;
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

    function markerAngle(id: string, cx: number, cy: number, fallback: number) {
      if (!root || !canvas) return fallback;
      const host = canvas.parentElement;
      if (!host) return fallback;
      const needle = `--cobe-${id}`;
      for (const node of host.children) {
        if (!(node instanceof HTMLElement) || node === canvas) continue;
        if (!node.style.cssText.includes(needle)) continue;
        const rect = node.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        const mx = rect.left - rootRect.left + rect.width / 2;
        const my = rect.top - rootRect.top + rect.height / 2;
        return Math.atan2(my - cy, mx - cx);
      }
      return fallback;
    }

    function separateOnCircle(
      items: { el: HTMLElement; angle: number; half: number }[],
    ) {
      if (items.length < 2) return;
      let total = 0;
      for (const it of items) total += it.half * 2;
      if (total >= TAU) {
        const scale = (TAU * 0.98) / total;
        for (const it of items) it.half *= scale;
      }

      for (let iter = 0; iter < 18; iter++) {
        items.sort((a, b) => a.angle - b.angle);
        for (let i = 0; i < items.length; i++) {
          const a = items[i];
          const b = items[(i + 1) % items.length];
          let gap = b.angle - a.angle;
          if (gap <= 0) gap += TAU;
          const need = a.half + b.half;
          if (gap >= need) continue;
          const push = (need - gap) / 2;
          a.angle = wrapAngle(a.angle - push);
          b.angle = wrapAngle(b.angle + push);
        }
      }
    }

    function placeOnOuterCircle(els: HTMLElement[]) {
      const n = els.length;
      if (n === 0 || !root || !canvas) return;

      const rootRect = root.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const cx = canvasRect.left - rootRect.left + canvasRect.width / 2;
      const cy = canvasRect.top - rootRect.top + canvasRect.height / 2;
      const maxW = Math.max(...els.map((el) => Math.max(el.offsetWidth, 48)));
      const globeR = canvasRect.width / 2;
      const maxR =
        Math.min(cx, cy, rootRect.width - cx, rootRect.height - cy) -
        maxW / 2 -
        8;
      const r = Math.max(globeR + 24, Math.min(maxR, globeR + RING_GAP));

      const items = els.map((el, i) => {
        const w = Math.max(el.offsetWidth, 48);
        const id = el.dataset.portId ?? "";
        return {
          el,
          angle: wrapAngle(markerAngle(id, cx, cy, -Math.PI / 2 + (i * TAU) / n)),
          half: Math.atan2(w / 2 + TAG_GAP / 2, r),
        };
      });

      separateOnCircle(items);

      for (const item of items) {
        const x = cx + Math.cos(item.angle) * r;
        const y = cy + Math.sin(item.angle) * r;
        const next = tagTransform(x, y);
        if (item.el.style.transform !== next) {
          item.el.style.transform = next;
        }
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

      placeOnOuterCircle(facing);

      const key = facing.map((el) => el.dataset.portId).join("|");
      if (key !== lastFacingKey) {
        lastFacingKey = key;
        for (const el of tagEls) {
          el.classList.toggle("is-on", facing.includes(el));
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

      placeOnOuterCircle(tagEls.filter((el) => el.classList.contains("is-on")));

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
