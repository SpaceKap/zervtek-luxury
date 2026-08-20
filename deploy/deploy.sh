#!/usr/bin/env bash
# Deploy ZervTek Luxury to the VPS (luxury.zervtek.com).
#
# Usage (from laptop):
#   ./deploy/deploy.sh
#   ./deploy/deploy.sh --host zervtek-vps --dir /opt/zervtek-luxury
#
# Usage (already on the VPS, inside the repo):
#   ./deploy/deploy.sh --local
set -euo pipefail

HOST="${DEPLOY_HOST:-zervtek-vps}"
REMOTE_DIR="${DEPLOY_DIR:-/opt/zervtek-luxury}"
REPO_URL="${DEPLOY_REPO:-}"
BRANCH="${DEPLOY_BRANCH:-main}"
LOCAL=0
SEED=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="$2"; shift 2 ;;
    --dir) REMOTE_DIR="$2"; shift 2 ;;
    --repo) REPO_URL="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --local) LOCAL=1; shift ;;
    --seed) SEED=1; shift ;;
    -h|--help)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

remote() {
  if [[ "$LOCAL" -eq 1 ]]; then
    bash -lc "$*"
  else
    ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new "$HOST" "$*"
  fi
}

echo "==> Target: ${LOCAL:-0}" 
if [[ "$LOCAL" -eq 1 ]]; then
  echo "==> Local deploy in $(pwd)"
else
  echo "==> Remote deploy via $HOST → $REMOTE_DIR"
fi

remote "set -euo pipefail
  sudo mkdir -p /srv/zervtek-luxury/vehicle-images /srv/zervtek-luxury/uploads '$REMOTE_DIR'
  # App container runs as nextjs uid/gid 1001 — bind mounts must match or writes fail.
  sudo chown -R 1001:1001 /srv/zervtek-luxury/vehicle-images /srv/zervtek-luxury/uploads
  sudo chown -R \"\$(id -u):\$(id -g)\" '$REMOTE_DIR' || true
  docker network inspect caddy_proxy >/dev/null 2>&1 || docker network create caddy_proxy

  if [[ ! -d '$REMOTE_DIR/.git' ]]; then
    if [[ -z '${REPO_URL}' ]]; then
      echo 'Repo missing on server and --repo / DEPLOY_REPO not set.' >&2
      exit 1
    fi
    git clone --branch '$BRANCH' '${REPO_URL}' '$REMOTE_DIR'
  fi

  cd '$REMOTE_DIR'
  git fetch origin
  git checkout '$BRANCH'
  git pull --ff-only origin '$BRANCH'

  if [[ ! -f .env ]]; then
    echo 'Missing .env in $REMOTE_DIR — copy from .env.example and fill secrets.' >&2
    exit 1
  fi

  # Ensure DATABASE_URL points at compose db service if unset in .env
  if ! grep -q '^POSTGRES_PASSWORD=' .env; then
    echo 'POSTGRES_PASSWORD is required in .env' >&2
    exit 1
  fi

  docker compose build app
  docker compose up -d

  echo 'Waiting for app health…'
  for i in \$(seq 1 40); do
    if curl -fsS http://127.0.0.1:3010/robots.txt >/dev/null 2>&1; then
      echo 'App is up.'
      break
    fi
    sleep 3
    if [[ \$i -eq 40 ]]; then
      echo 'App failed health check' >&2
      docker compose logs --tail=80 app >&2 || true
      exit 1
    fi
  done

  if [[ '$SEED' -eq 1 ]]; then
    docker compose exec -T app npm run db:seed || true
  fi

  # Caddy: Docker container wins (this VPS). Host CLI exists but has no admin API.
  if docker ps --format '{{.Names}}' | grep -qx caddy; then
    echo 'Reloading Docker Caddy…'
    docker exec caddy caddy validate --config /etc/caddy/Caddyfile
    docker exec caddy caddy reload --config /etc/caddy/Caddyfile
  elif [[ -f /etc/caddy/Caddyfile ]] && command -v caddy >/dev/null 2>&1; then
    if ! grep -q 'luxury.zervtek.com' /etc/caddy/Caddyfile; then
      echo 'Appending luxury.zervtek.com block to /etc/caddy/Caddyfile'
      sudo tee -a /etc/caddy/Caddyfile >/dev/null < deploy/Caddyfile.snippet
    fi
    sudo caddy validate --config /etc/caddy/Caddyfile
    if systemctl is-active --quiet caddy; then
      sudo systemctl reload caddy
    else
      echo 'Host caddy.service inactive — skip host reload.'
    fi
  else
    echo 'No Caddy (Docker or host) found. Add deploy/Caddyfile.snippet to your Caddy config.'
  fi

  echo 'Done. Check: curl -sI https://luxury.zervtek.com | head -1'
"
