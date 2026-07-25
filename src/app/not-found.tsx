import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ paddingBlock: 140, textAlign: "center" }}>
      <span className="eyebrow">404</span>
      <h1 className="heading" style={{ fontSize: 48, margin: "12px 0 16px" }}>
        Page not found
      </h1>
      <p className="muted" style={{ marginBottom: 28 }}>
        The page or vehicle you&apos;re looking for is no longer available.
      </p>
      <Link className="btn btn-gold" href="/stock">
        Browse the collection
      </Link>
    </main>
  );
}
