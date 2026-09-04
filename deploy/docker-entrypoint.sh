#!/bin/sh
set -eu

UPLOAD_ROOT="${VEHICLE_UPLOAD_DIR:-/var/lib/zervtek-luxury/vehicle-images}"
ADMIN_UPLOADS="/app/public/uploads"

require_auth_secrets() {
  if [ -z "${SESSION_SECRET:-}" ] || [ "${#SESSION_SECRET}" -lt 32 ]; then
    echo "[luxury] FATAL: SESSION_SECRET must be set and at least 32 characters." >&2
    exit 1
  fi
  case "${SESSION_SECRET}" in
    insecure-dev-secret|generate-with-openssl-rand-hex-32|change-me)
      echo "[luxury] FATAL: SESSION_SECRET is a forbidden placeholder." >&2
      exit 1
      ;;
  esac

  if [ -z "${ADMIN_PASSWORD:-}" ] || [ "${#ADMIN_PASSWORD}" -lt 12 ]; then
    echo "[luxury] FATAL: ADMIN_PASSWORD must be set and at least 12 characters." >&2
    exit 1
  fi
  case "${ADMIN_PASSWORD}" in
    change-me-admin-password|password|admin|admin123)
      echo "[luxury] FATAL: ADMIN_PASSWORD is a forbidden placeholder." >&2
      exit 1
      ;;
  esac
}

require_auth_secrets

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
