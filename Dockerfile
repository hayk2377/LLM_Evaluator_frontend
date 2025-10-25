# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source
COPY . .

# Ensure a public directory exists even if the app doesn't define one
# (avoids COPY failures in the runtime stage when no static assets are used)
RUN if [ ! -d public ]; then mkdir -p public; fi

# Build
RUN npm run build || (echo "Build failed" && exit 1)

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy public assets (folder is guaranteed to exist from the build stage)
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
