"use client";

const COLORFLOW_EMBED =
  "https://colorflow-embed.b-cdn.net/embed.html#e=Y4u_y_S-";

export function ColorflowBackground() {
  return (
    <div className="colorflow-bg" aria-hidden>
      <iframe
        src={COLORFLOW_EMBED}
        title=""
        tabIndex={-1}
        loading="eager"
      />
    </div>
  );
}
