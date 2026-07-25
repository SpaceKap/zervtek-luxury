# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
# postinstall runs `prisma generate` — schema must be present
COPY prisma ./prisma
RUN npm ci

FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Prisma generate needs a URL; migrate runs at deploy time against real DB.
ENV DATABASE_URL="postgresql://luxury:luxury@db:5432/luxury?schema=public"
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl curl su-exec vips
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY deploy/docker-entrypoint.sh /docker-entrypoint.sh

RUN mkdir -p /var/lib/zervtek-luxury/vehicle-images /app/public/uploads \
  && chown -R nextjs:nodejs /app /var/lib/zervtek-luxury \
  && chmod +x /docker-entrypoint.sh

# Entrypoint starts as root to chown bind mounts, then drops to nextjs.
USER root
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/robots.txt >/dev/null || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
