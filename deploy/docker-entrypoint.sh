#!/bin/sh
set -eu

echo "[luxury] Running Prisma migrations…"
npx prisma migrate deploy

echo "[luxury] Starting Next.js…"
exec "$@"
