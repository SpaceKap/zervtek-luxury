import Link from "next/link";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/admin", label: "Vehicles" },
  { href: "/admin/blog", label: "Blog" },
] as const;

export function AdminShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <main className="container admin-shell" style={{ paddingBlock: 48 }}>
      <div className="admin-shell-top">
        <div>
          <nav className="admin-shell-nav" aria-label="Admin sections">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="admin-shell-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="eyebrow">Admin</span>
          <h1 className="heading admin-shell-title">{title}</h1>
          {subtitle ? <p className="muted admin-shell-subtitle">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </main>
  );
}
