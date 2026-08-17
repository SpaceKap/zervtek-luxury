"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

/** Common frame ratios — stage snaps to the nearest so layout stays tidy. */
const FRAME_RATIOS: { css: string; value: number }[] = [
  { css: "16 / 9", value: 16 / 9 },
  { css: "3 / 2", value: 3 / 2 },
  { css: "4 / 3", value: 4 / 3 },
  { css: "5 / 4", value: 5 / 4 },
  { css: "1 / 1", value: 1 },
  { css: "4 / 5", value: 4 / 5 },
  { css: "3 / 4", value: 3 / 4 },
  { css: "2 / 3", value: 2 / 3 },
  { css: "9 / 16", value: 9 / 16 },
];

const DEFAULT_RATIO = "3 / 2";
/** Dots overflow the stage past this — switch to a compact counter. */
const MAX_DOTS = 8;
/** Enough thumbs to fill two rows and better match the enquiry panel height. */
const THUMB_ROWS_MIN = 6;

function nearestFrameRatio(width: number, height: number): string {
  if (!width || !height) return DEFAULT_RATIO;
  const r = width / height;
  let best = FRAME_RATIOS[0];
  let bestDist = Infinity;
  for (const candidate of FRAME_RATIOS) {
    // log distance treats relative ratio error evenly (e.g. 3:2 vs 16:9)
    const dist = Math.abs(Math.log(r / candidate.value));
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best.css;
}

export function ProtectedCarousel({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
  const [frameRatio, setFrameRatio] = useState(DEFAULT_RATIO);
  const [knownSizes, setKnownSizes] = useState<Record<number, { w: number; h: number }>>({});
  const count = images.length;

  const go = useCallback(
    (next: number) => setIndex((prev) => (next + count) % count),
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  // When active slide changes, snap frame to that photo's nearest ratio.
  useEffect(() => {
    const size = knownSizes[index];
    if (size) setFrameRatio(nearestFrameRatio(size.w, size.h));
  }, [index, knownSizes]);

  function onImageLoad(i: number, e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;
    setKnownSizes((prev) => {
      const existing = prev[i];
      if (existing && existing.w === w && existing.h === h) return prev;
      return { ...prev, [i]: { w, h } };
    });
    if (i === index) setFrameRatio(nearestFrameRatio(w, h));
  }

  const block = (e: React.SyntheticEvent) => e.preventDefault();

  if (count === 0) {
    return <div className="carousel" style={{ aspectRatio: DEFAULT_RATIO }} />;
  }

  return (
    <div>
      <div className="carousel" onContextMenu={block} onDragStart={block}>
        <div className="carousel-stage" style={{ aspectRatio: frameRatio }}>
          {images.map((src, i) => (
            <div key={i} className={`carousel-slide${i === index ? " active" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                draggable={false}
                onDragStart={block}
                onContextMenu={block}
                onLoad={(e) => onImageLoad(i, e)}
              />
            </div>
          ))}
          <div className="carousel-guard" onContextMenu={block} onDragStart={block} />

          {count > 1 && (
            <>
              <button
                className="carousel-nav prev"
                aria-label="Previous photo"
                onClick={() => go(index - 1)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="carousel-nav next"
                aria-label="Next photo"
                onClick={() => go(index + 1)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {count <= MAX_DOTS ? (
                <div className="carousel-dots" role="tablist" aria-label="Photo position">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={i === index ? "active" : ""}
                      aria-label={`Go to photo ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => setIndex(i)}
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
                  gridTemplateColumns: `repeat(${Math.ceil(count / 2)}, minmax(64px, 1fr))`,
                }
              : undefined
          }
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`View photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" draggable={false} onContextMenu={block} onDragStart={block} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
