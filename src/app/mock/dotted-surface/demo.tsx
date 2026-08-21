"use client";

import Link from "next/link";
import DottedSurface from "@/components/ui/dotted-surface";

export default function DottedSurfaceDemo() {
  return (
    <main style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "10px 20px",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <span>Mock · Dotted surface</span>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
          Back to site
        </Link>
      </div>

      <DottedSurface className="dotted-surface-demo" />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
          paddingBlock: "clamp(120px, 18vh, 220px) 80px",
        }}
      >
        <span className="eyebrow">Background</span>
        <h1 className="heading" style={{ fontSize: "clamp(32px, 5vw, 56px)", maxWidth: 720, marginTop: 12 }}>
          Animated dotted surface
        </h1>
        <p className="muted" style={{ maxWidth: 520, marginTop: 16, lineHeight: 1.7 }}>
          Three.js particle wave used for mock backgrounds. Resize the viewport to see the canvas adapt.
        </p>
      </div>
    </main>
  );
}
