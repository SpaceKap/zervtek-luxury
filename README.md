# ZervTek Luxury — luxury.zervtek.com

A dark-mode luxury vehicle showcase and export site, inspired by toprank.jp and built for the ZervTek brand.

## Stack

- **Next.js 16** (App Router, TypeScript, server components)
- **Radix UI Themes** — dark appearance, amber accent
- **SSGOI** — page transitions for web & mobile (`@ssgoi/react`)
- **Prisma + PostgreSQL** — vehicle & inquiry data
- Animated CSS gradient background (colorflow-style flowing mesh)

## Features

- Full-page landing hero with animated gradient backdrop
- **Stock** page with search + filters (make, body type, sort, keyword) and pagination
- **Vehicle detail** pages with a **non-downloadable** image carousel (right-click / drag disabled, transparent guard layer, `noimageindex` header on originals)
- **About** page including a FAQ accordion
- **Inquiry form** on the homepage and every vehicle page; WhatsApp button in the navbar
- **Admin backend** (`/admin`) to upload/manage vehicles with drag-free image upload
- **SEO**: per-page metadata, canonical URLs, SEO-friendly slugs (`/stock/2023-mercedes-amg-c-class-c43-4matic-wagon-<id>`), JSON-LD schema (`AutoDealer`, `WebSite`, `Car`, `BreadcrumbList`, `FAQPage`, `ItemList`), `sitemap.xml`, `robots.txt`

## Getting started

```bash
# 1. Install
npm install

# 2. Configure env (copy and edit)
cp .env.example .env
#   - set DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, NEXT_PUBLIC_WHATSAPP_NUMBER

# 3. Start Postgres (Docker)
docker compose up -d

# 4. Create tables + seed demo vehicles
npm run db:push
npm run db:seed

# 5. Run
npm run dev
```

Visit `http://localhost:3000`. Admin panel: `http://localhost:3000/admin` (log in with `ADMIN_PASSWORD`).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:seed` | Insert demo vehicles |

## Environment variables

| Var | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `ADMIN_PASSWORD` | Single-admin login password |
| `SESSION_SECRET` | Secret used to sign the admin session cookie (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for SEO / schema / sitemap) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (digits only, incl. country code) |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | Default WhatsApp prefill message |

## Hermes vehicle intake

Direct Hermes → Portal API (no n8n). See [docs/hermes-vehicle-api.md](docs/hermes-vehicle-api.md).

## Production (VPS + Caddy)

Host: **luxury.zervtek.com**

```bash
# laptop → VPS
./deploy/deploy.sh --host zervtek-vps --dir /opt/zervtek-luxury --repo git@github.com:<org>/luxury.git

# or on the server
cd /opt/zervtek-luxury && ./deploy/deploy.sh --local
```

Details: [deploy/README.md](deploy/README.md). Caddy snippet: [deploy/Caddyfile.snippet](deploy/Caddyfile.snippet).

Repo: `https://github.com/SpaceKap/zervtek-luxury`

## Image uploads

- Admin uploads: `public/uploads/` (git-ignored; VPS bind `/srv/zervtek-luxury/uploads`)
- Hermes uploads: persistent `VEHICLE_UPLOAD_DIR` at `/media/vehicles/...` (VPS bind `/srv/zervtek-luxury/vehicle-images`)

## Project structure

```
src/
  app/
    page.tsx              # landing (hero, featured, inquiry)
    stock/                # list + [slug] detail
    about/                # about + FAQ
    admin/                # login + dashboard (guarded)
    api/                  # vehicles, upload, inquiries, auth, hermes internal
    media/                # vehicle image media route
    sitemap.ts, robots.ts
    ssgoi-provider.tsx    # page transitions
  components/             # Navbar, Footer, VehicleCard, ProtectedCarousel, InquiryForm, Faq, SearchFilters, admin/*
  lib/                    # prisma, auth, vehicles, seo, slug, format, site, hermes
prisma/schema.prisma      # Vehicle + Inquiry + Hermes tables
deploy/                   # VPS deploy script + Caddy snippet
```