import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 16 }}>
              <Logo href="/" />
            </div>
            <p className="muted" style={{ maxWidth: 380, lineHeight: 1.7 }}>
              {SITE.description}
            </p>
          </div>

          <div>
            <h5>Explore</h5>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/stock?status=AVAILABLE">Available Stock</Link>
            <Link href="/about#bank-details">Bank Details</Link>
            <Link href="/about#contact-form">Contact</Link>
          </div>

          <div>
            <h5>Get in Touch</h5>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </span>
          <span>{SITE.address.street}, {SITE.address.city}, Japan</span>
        </div>
      </div>
    </footer>
  );
}
