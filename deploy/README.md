# VPS deploy (luxury.zervtek.com)

## One-time server prep

1. DNS: `luxury.zervtek.com` A/AAAA → VPS public IP
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

Snippet: `deploy/Caddyfile.snippet` — proxies `luxury.zervtek.com` → `luxury-app:3000` over the shared `caddy_proxy` network.

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

Migrations run automatically on container start (`prisma migrate deploy`).
