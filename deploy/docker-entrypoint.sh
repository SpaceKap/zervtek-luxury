#!/bin/sh
set -eu

UPLOAD_ROOT="${VEHICLE_UPLOAD_DIR:-/var/lib/zervtek-luxury/vehicle-images}"
ADMIN_UPLOADS="/app/public/uploads"

# Bind mounts overwrite image ownership — fix so nextjs (uid 1001) can write.
if [ "$(id -u)" = "0" ]; then
  mkdir -p "$UPLOAD_ROOT" "$ADMIN_UPLOADS"
  chown -R nextjs:nodejs "$UPLOAD_ROOT" "$ADMIN_UPLOADS" || true
  chmod -R u+rwX "$UPLOAD_ROOT" "$ADMIN_UPLOADS" || true
  echo "[luxury] Running Prisma migrations…"
  su-exec nextjs npx prisma migrate deploy
  echo "[luxury] Starting Next.js…"
  exec su-exec nextjs "$@"
fi

echo "[luxury] Running Prisma migrations…"
npx prisma migrate deploy
echo "[luxury] Starting Next.js…"
exec "$@"
