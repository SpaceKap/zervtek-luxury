# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audiences (equal weight):

1. **Overseas end buyers** importing a luxury or performance car from Japan — browsing stock, confirming condition and total cost, then enquiring or WhatsApping a specialist to arrange purchase and shipping.
2. **Overseas dealers / brokers** sourcing inventory for resale — scanning availability, filtering by make/body/price, and opening enquiry or direct contact on specific units.

Both audiences evaluate on: authenticity of Japan-sourced stock, clarity of pricing and shipping path, and trust that a human will respond.

## Product Purpose

ZervTek Performance (ZervTek Co. Ltd, Chiba) sources, inspects, and exports performance cars, supercars, and luxury vehicles from Japan. The site is the public storefront and enquiry channel: browse curated stock, open a vehicle detail, and convert via enquiry form or WhatsApp — not a self-serve checkout cart.

Success means qualified enquiries and contact intent (WhatsApp / email) on real vehicles, with inventory that has been reviewed before public publish.

## Positioning

Japan-based **export concierge** for **premium European marques and performance cars from Japan** (Mercedes-AMG, Porsche, Ferrari, Land Rover / Defender, and peers): inspected stock, personal handling, transparent vehicle price in JPY with shipping quoted separately, and worldwide export support. Neighbouring sites that only list cars or only ship generic freight cannot truthfully claim this combined stock + concierge + Japan-origin export posture.

## Operating Context

- Public web: Home, Stock (search/filter), vehicle detail (`/stock/{make}/{model}/{grade}-for-sale`), Shipping, About (FAQ + contact).
- Conversion: enquiry forms (homepage, vehicle detail, contact) and WhatsApp (navbar and CTAs); phone/email as secondary.
- Internal: Admin at `/admin` for listing management; Hermes automation creates vehicles as `NEEDS_REVIEW` until a human publishes.
- Media: vehicle photos stored and served from the portal; cover/order controlled in admin.
- Analytics: GTM container with named business events (`view_item`, `select_item`, `generate_lead`, `contact_*`, etc.).

## Capabilities and Constraints

- Enquiry / WhatsApp is the primary conversion path — **no cart / checkout**.
- Prices shown in **JPY**; shipping is quoted separately (“plus shipping”).
- Inventory workflow: Hermes intake → human review (`NEEDS_REVIEW`) → public statuses (`AVAILABLE` / `RESERVED` / `SOLD`).
- Public site is **English-only** for now.
- Brand name and parent: **ZervTek Performance** / **ZervTek Co. Ltd**; tagline “The Pride for Quality”.
- Stack (implementation fact): Next.js App Router, Prisma/Postgres, Docker deploy at performance.zervtek.com.

Open / undecided (do not invent in design copy):

- Relative priority between end buyers vs dealers when messaging conflicts.
- Formal SLA or response-time claims.
- Specific shipping partners or ports as marketing claims beyond pages that already document them.

## Brand Commitments

- Name: ZervTek Performance; legal: ZervTek Co. Ltd.
- Tagline: “The Pride for Quality”.
- Contact: info@zervtek.com; WhatsApp / phone +81 80 6659 4632; Chiba address in site config.
- Voice: specialist, personal, no call-centre / no-pressure (as used on the site).
- Binding visual world is **not** decided in this file — incumbent UI is authority until `/impeccable document` or a deliberate redesign via new-work.

## Evidence on Hand

- Live site and copy in `src/lib/site.ts`, stock/detail/shipping/about pages.
- Real operational contact details and Chiba address (site config).
- Vehicle inventory and enquiries in Postgres via Prisma; Hermes API docs in `docs/hermes-vehicle-api.md`.
- Do **not** fabricate testimonials, press, customer logos, or pricing benchmarks not present in the repo or confirmed by the team.

## Product Principles

1. **Concierge over cart** — every path should make human contact easy and trustworthy.
2. **Japan-origin clarity** — stock, inspection posture, and export framing stay explicit.
3. **Transparent money talk** — JPY vehicle price visible; shipping never buried as “included” unless it truly is.
4. **Publish only what’s reviewed** — public stock reflects human approval, not raw automation dumps.
5. **Serve both buyer and broker** — scanability for brokers and reassurance for end buyers without splitting into two brands.

## Accessibility & Inclusion

No product-specific legal standard was confirmed beyond normal web expectations (keyboard use, readable contrast, form labels). Future work should not regress existing semantics without reason.
