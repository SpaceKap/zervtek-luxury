import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsgoiProvider } from "./ssgoi-provider";
import { ColorflowBackground } from "@/components/ColorflowBackground";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Luxury & Performance Cars from Japan`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "luxury cars Japan",
    "import luxury car from Japan",
    "Mercedes-AMG Japan",
    "Porsche Japan export",
    "Ferrari Japan",
    "Land Rover Defender Japan",
    "used luxury cars Japan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | Luxury & Performance Cars from Japan`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Luxury & Performance Cars from Japan`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        <ColorflowBackground />
        <Theme
          appearance="light"
          accentColor="amber"
          grayColor="mauve"
          radius="none"
          panelBackground="translucent"
          scaling="100%"
        >
          <CurrencyProvider>
            <div className="app-shell">
              <Navbar />
              <SsgoiProvider>{children}</SsgoiProvider>
              <Footer />
            </div>
          </CurrencyProvider>
        </Theme>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
