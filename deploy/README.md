# VPS deploy (performance.zervtek.com)

## One-time server prep

1. DNS: `performance.zervtek.com` A/AAAA → VPS public IP (keep `luxury.zervtek.com` for redirect)
2. Shared Docker network (if missing):
   ```bash
   docker network create caddy_proxy
   ```
3. Persistent dirs:
   ```bash
   sudo mkdir -p /srv/zervtek-luxury/vehicle-images /srv/zervtek-luxury/uploads /opt/zervtek-luxury
   ```

## First deploy

On the VPS (or from laptop via SSH):

```bash
# clone once
git clone git@github.com:SpaceKap/zervtek-luxury.git /opt/zervtek-luxury
cd /opt/zervtek-luxury
cp .env.example .env
# edit .env — set POSTGRES_PASSWORD, ADMIN_PASSWORD, SESSION_SECRET, HERMES_VEHICLE_API_TOKEN

./deploy/deploy.sh --local
# optional demo data:
./deploy/deploy.sh --local --seed
```

From your laptop (after Tailscale/SSH works):

```bash
./deploy/deploy.sh --host zervtek-vps --dir /opt/zervtek-luxury --repo git@github.com:SpaceKap/zervtek-luxury.git
```

## Caddy (Dockerized on this VPS)

Snippet: `deploy/Caddyfile.snippet` — proxies `performance.zervtek.com` → `luxury-app:3000` over the shared `caddy_proxy` network. `luxury.zervtek.com` 301s to the new host.

Add the block to the Caddyfile the `caddy` container mounts (the n8n stack, e.g. `/opt/n8n/Caddyfile`), then:

```bash
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

Host/systemd Caddy instead: use `reverse_proxy 127.0.0.1:3010` (compose publishes that port on localhost).

## Updates

```bash
cd /opt/zervtek-luxury
git pull
./deploy/deploy.sh --local
```

Migrations run automatically on container start (`prisma migrate deploy` inside the `luxury-app` container).

**Do not run `npx prisma` on the VPS host.** Ubuntu’s global `npx` may install Prisma 7, which rejects this repo’s Prisma 6 schema and fails with `P1012` (`url` in `schema.prisma`).

If you need to run migrations manually:

```bash
cd /opt/zervtek-luxury
docker compose exec app npx prisma migrate deploy
# or
docker compose exec app npm run db:migrate
```

Verify the blog table after deploy:

```bash
docker compose logs --tail=30 app | grep -i prisma
docker compose exec db psql -U luxury -d luxury -c '\dt "BlogPost"'
curl -sI https://performance.zervtek.com/blog | head -1
```
