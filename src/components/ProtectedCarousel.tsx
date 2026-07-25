"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export function ProtectedCarousel({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
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

  const block = (e: React.SyntheticEvent) => e.preventDefault();

  if (count === 0) {
    return <div className="carousel" style={{ aspectRatio: "1 / 1" }} />;
  }

  return (
    <div>
      <div className="carousel" onContextMenu={block} onDragStart={block}>
        <div className="carousel-stage">
          {images.map((src, i) => (
            <div key={i} className={`carousel-slide${i === index ? " active" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                draggable={false}
                onDragStart={block}
                onContextMenu={block}
              />
            </div>
          ))}
          {/* Transparent guard layer discourages right-click / drag saving */}
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
              <div className="carousel-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={i === index ? "active" : ""}
                    aria-label={`Go to photo ${i + 1}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="carousel-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
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
