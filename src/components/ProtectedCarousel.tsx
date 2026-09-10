"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { vehicleGridImageUrl } from "@/lib/vehicle-media-url";

type Props = {
  images: string[];
  alt: string;
};

/** Stable stage — avoids enquiry-panel jump when slide ratios differ. */
const STAGE_RATIO = "3 / 2";
const MAX_DOTS = 8;
const THUMB_ROWS = 3;
const THUMB_ROWS_MIN = 6;

function neighborIndexes(active: number, count: number): Set<number> {
  const set = new Set<number>([active]);
  if (count > 1) {
    set.add((active - 1 + count) % count);
    set.add((active + 1) % count);
  }
  return set;
}

export function ProtectedCarousel({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = images.length;

  const mounted = useMemo(() => neighborIndexes(index, count), [index, count]);

  const go = useCallback(
    (next: number) => {
      setPaused(true);
      setIndex((prev) => (next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return;
    const id = window.setInterval(() => setIndex((p) => (p + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [count, paused, reduceMotion]);

  const block = (e: React.SyntheticEvent) => e.preventDefault();

  if (count === 0) {
    return <div className="carousel" style={{ aspectRatio: STAGE_RATIO }} />;
  }

  return (
    <div>
      <div
        className="carousel"
        onContextMenu={block}
        onDragStart={block}
        onPointerDown={() => setPaused(true)}
        onKeyDown={() => setPaused(true)}
      >
        <div className="carousel-stage" style={{ aspectRatio: STAGE_RATIO }}>
          {images.map((src, i) => {
            const active = i === index;
            const shouldLoad = mounted.has(i);
            return (
              <div key={src + i} className={`carousel-slide${active ? " active" : ""}`}>
                {shouldLoad ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`${alt}, photo ${i + 1}`}
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    decoding="async"
                    width={1200}
                    height={800}
                    onDragStart={block}
                    onContextMenu={block}
                  />
                ) : null}
              </div>
            );
          })}
          <div className="carousel-guard" onContextMenu={block} onDragStart={block} aria-hidden />

          {count > 1 && (
            <>
              <button
                type="button"
                className="carousel-nav prev"
                aria-label="Previous photo"
                onClick={() => go(index - 1)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="carousel-nav next"
                aria-label="Next photo"
                onClick={() => go(index + 1)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {!reduceMotion ? (
                <button
                  type="button"
                  className="carousel-pause"
                  aria-pressed={paused}
                  aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? "Play" : "Pause"}
                </button>
              ) : null}
              {count <= MAX_DOTS ? (
                <div className="carousel-dots" role="tablist" aria-label="Photo position">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={i === index ? "active" : ""}
                      aria-label={`Go to photo ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => go(i)}
                    />
                  ))}
                </div>
              ) : (
                <div className="carousel-counter" aria-live="polite">
                  {index + 1} / {count}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {count > 1 && (
        <div
          className={`carousel-thumbs${count >= THUMB_ROWS_MIN ? " carousel-thumbs--rows" : ""}`}
          style={
            count >= THUMB_ROWS_MIN
              ? {
                  gridTemplateColumns: `repeat(${Math.ceil(count / THUMB_ROWS)}, minmax(64px, 1fr))`,
                }
              : undefined
          }
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={i === index ? "active" : ""}
              onClick={() => go(i)}
              aria-label={`View photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vehicleGridImageUrl(src)}
                alt=""
                loading="lazy"
                decoding="async"
                width={160}
                height={120}
                draggable={false}
                onContextMenu={block}
                onDragStart={block}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
