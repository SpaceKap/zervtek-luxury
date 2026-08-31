# Hermes → ZervTek Performance Portal API

Internal integration for automated vehicle intake. **Do not use n8n.** Hermes calls this API directly.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `HERMES_VEHICLE_API_TOKEN` | Bearer token for `/api/internal/*` (required in prod) |
| `HERMES_ALLOW_HTTP` | Set `1` only for local non-TLS testing |
| `VEHICLE_UPLOAD_DIR` | Persistent image root (default `./storage/vehicle-images`) |
| `VEHICLE_MEDIA_URL_PREFIX` | Public URL prefix (default `/media/vehicles`) |
| `VEHICLE_MAX_IMAGES` | Max images per create (default `100`) |
| `VEHICLE_MAX_IMAGE_SIZE_MB` | Max bytes per image (default `15`) |
| `DATABASE_URL` | Postgres |
| `NEXT_PUBLIC_SITE_URL` | Used in `reviewUrl` responses |

Generate a token:

```bash
openssl rand -hex 32
```

## Database migration

```bash
npx prisma migrate deploy   # production
# or local:
npx prisma migrate dev --name hermes_vehicle_integration
npm run db:seed             # optional demo data
```

If migrating from the pre-Hermes schema, the migration drops `vehiclePrice` and expands statuses / source / availability / image tables.

## Local image storage

Host path (recommended):

```text
/srv/zervtek-luxury/vehicle-images
```

Container path:

```text
/var/lib/zervtek-luxury/vehicle-images
```

Layout:

```text
vehicle-images/<vehicleId>/original|large|medium|thumbnail/<random>.{ext,jpg}
```

Create and own the directory:

```bash
sudo mkdir -p /srv/zervtek-luxury/vehicle-images
sudo chown -R <app-user>:<app-user> /srv/zervtek-luxury/vehicle-images
```

Dev fallback (git-ignored): `./storage/vehicle-images`.

## Docker volume

Bind-mount host storage into the app container:

```yaml
volumes:
  - /srv/zervtek-luxury/vehicle-images:/var/lib/zervtek-luxury/vehicle-images
```

Set `VEHICLE_UPLOAD_DIR=/var/lib/zervtek-luxury/vehicle-images` in the container env.

## Caddy media route

See `deploy/Caddyfile.example`. Prefer Caddy `file_server` for `/media/vehicles/*` with long cache headers and **no** directory browsing. The Next.js route at `/media/vehicles/[...path]` is a fallback if Caddy is not used.

## API examples

### Create vehicle (multipart)

```bash
curl -sS -X POST "https://performance.zervtek.com/api/internal/vehicles" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
  -H "Idempotency-Key: dealer:dealer-983214" \
  -F 'metadata={"make":"Mercedes-AMG","model":"C-Class","variant":"C43 4MATIC Wagon","registrationYear":2025,"registrationMonth":3,"totalPriceJpy":9000000,"mileageKm":80000,"engineCc":3000,"transmission":"AUTOMATIC","fuel":"PETROL","drivetrain":"AWD","steering":"RHD","bodyType":"WAGON","exteriorColour":"Obsidian Black","interiorColour":"Black leather","location":"Osaka, Japan","frameNumber":"205264-123456","description":"Vehicle description","features":["Burmester sound system"],"sourceType":"DEALER","sourceListingId":"dealer-983214","sourceUrl":"https://dealer.example/vehicle/983214","coverImageIndex":0};type=application/json' \
  -F "images=@./front.jpg" \
  -F "images=@./side.jpg"
```

Always starts as `NEEDS_REVIEW`. Fee breakdown fields are rejected; use `totalPriceJpy` only.

Re-uploading the same Carsensor/dealer listing is blocked when `sourceListingId` already exists (returns `duplicate: true` with the existing `vehicleId`).

### List vehicles

```bash
curl -sS "https://performance.zervtek.com/api/internal/vehicles?status=NEEDS_REVIEW&limit=100" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN"
```

Query params: `status`, `createdByType`, `sourceListingId`, `limit` (max 200), `offset`.

### Get one vehicle

```bash
curl -sS "https://performance.zervtek.com/api/internal/vehicles/<vehicleId>" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN"
```

### Update vehicle (price / metadata)

Hermes can update listings in `NEEDS_REVIEW`, `DRAFT`, or `UNAVAILABLE` only. Cannot set `status` or publish.

```bash
curl -sS -X PATCH "https://performance.zervtek.com/api/internal/vehicles/<vehicleId>" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"totalPriceJpy":9720000}'
```

### Delete vehicle

Only allowed for `NEEDS_REVIEW`, `DRAFT`, or `UNAVAILABLE`.

```bash
curl -sS -X DELETE "https://performance.zervtek.com/api/internal/vehicles/<vehicleId>" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN"
```

### Dedupe by sourceListingId

Keeps the oldest record per `sourceListingId`, deletes newer duplicates. Default filter: `NEEDS_REVIEW` + `AUTOMATION`.

```bash
curl -sS -X POST "https://performance.zervtek.com/api/internal/vehicles/dedupe" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dryRun":true}'

# apply
curl -sS -X POST "https://performance.zervtek.com/api/internal/vehicles/dedupe" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Bulk price adjust

Increase or decrease prices by a percentage for filtered listings.

```bash
curl -sS -X POST "https://performance.zervtek.com/api/internal/vehicles/price-adjust" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"percent":8,"status":"NEEDS_REVIEW","createdByType":"AUTOMATION","dryRun":true}'
```

Use `vehicleIds` or `sourceListingIds` to target specific rows.

### Check queue

```bash
curl -sS "https://performance.zervtek.com/api/internal/vehicles/check-queue?limit=50" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN"
```

### Availability result

```bash
curl -sS -X POST "https://performance.zervtek.com/api/internal/vehicles/<vehicleId>/availability-check" \
  -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"result":"UNAVAILABLE","checkedAt":"2026-07-25T00:00:00.000Z","httpStatus":404,"evidence":"Listing returned 404"}'
```

Rules: first `UNAVAILABLE` increments counter only; second consecutive sets status `UNAVAILABLE`. `UNKNOWN` never changes public status. Locked listings return `409`.

## Approve a Hermes listing

1. Open `reviewUrl` from the create response (`/admin/vehicles/<id>`), or Admin → Hermes badge.
2. Review photos, price (`totalPriceJpy` / Total price), source URL.
3. Click **Save & publish** (sets `AVAILABLE`) or set status manually.

## Restore an automatically hidden vehicle

1. Open the admin vehicle form (status `UNAVAILABLE`).
2. Click **Restore from UNAVAILABLE** (restores `statusBeforeUnavailable`, resets consecutive counter), or set status manually.
3. Optionally enable **Lock automatic availability checks** so Hermes cannot re-hide it.

## Rotate Hermes API token

1. Generate a new token: `openssl rand -hex 32`
2. Update `HERMES_VEHICLE_API_TOKEN` on the portal host and restart the app.
3. Update Hermes with the same token.
4. Old token stops working immediately (constant-time compare; no dual-token window unless you deploy both sides together).

## Backup / restore images

Backup:

```bash
rsync -a /srv/zervtek-luxury/vehicle-images/ /backup/zervtek-luxury/vehicle-images/
# plus Postgres dump
pg_dump "$DATABASE_URL" > /backup/zervtek-luxury/db.sql
```

Restore:

```bash
rsync -a /backup/zervtek-luxury/vehicle-images/ /srv/zervtek-luxury/vehicle-images/
psql "$DATABASE_URL" < /backup/zervtek-luxury/db.sql
```

DB rows in `VehicleImage` must match files under `VEHICLE_UPLOAD_DIR`.

## Security notes

- Hermes auth is **Bearer token only** — not the admin session cookie.
- Hermes can create, list, update, delete, dedupe, and price-adjust via `/api/internal/*`.
- Hermes cannot publish listings (`AVAILABLE`) or change `status` via the internal API.
- Never log the raw bearer token.
- Public pages / JSON-LD / sitemap never include `sourceUrl`, `sourceListingId`, or availability internals.
- Hermes cannot create `AVAILABLE` listings.
