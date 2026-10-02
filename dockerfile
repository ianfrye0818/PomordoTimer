# syntax=docker/dockerfile:1

# =============================================================================
# Pomodoro Timer — TanStack Start (Nitro) + pnpm
# Build:  docker build -t pomodoro-timer .
# Run:    docker run -p 3000:3000 pomodoro-timer
# Server: node .output/server/index.mjs (Nitro node-server preset)
# =============================================================================

ARG NODE_VERSION=24

# -----------------------------------------------------------------------------
# Base: Node + pnpm via Corepack
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# pnpm 11 prompts to wipe node_modules when there is no TTY; CI makes it non-interactive.
ENV CI=true

RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

WORKDIR /app

# -----------------------------------------------------------------------------
# Dependencies
# pnpm-workspace.yaml must be present: it holds allowBuilds for esbuild,
# @tailwindcss/oxide, and the other packages pnpm 11 will not compile otherwise.
# -----------------------------------------------------------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Build: Vite/Nitro production build
# -----------------------------------------------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY . .

RUN pnpm build

# Keep only production dependencies for the runtime image
RUN pnpm prune --prod

# -----------------------------------------------------------------------------
# Runtime
# -----------------------------------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs appuser

COPY --from=builder --chown=appuser:nodejs /app/.output ./.output
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

USER appuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
