# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files FIRST — this layer is cached unless package.json changes
COPY package.json package-lock.json* ./

# Install dependencies (cached layer — only re-runs when package.json changes)
RUN npm install --legacy-peer-deps

# Copy source AFTER install so code changes don't bust the install cache
COPY . .

# Build arguments – Vite bakes these into the static bundle at build time
ARG VITE_APP_BASE_NAME=/admin/
ARG VITE_APP_VERSION=v1.5.0
ARG GENERATE_SOURCEMAP=false
ARG PUBLIC_URL=

ENV VITE_APP_BASE_NAME=${VITE_APP_BASE_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV GENERATE_SOURCEMAP=${GENERATE_SOURCEMAP}
ENV PUBLIC_URL=${PUBLIC_URL}

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

# Copy built assets into /admin/ subfolder so nginx serves by subpath
COPY --from=builder /app/dist /usr/share/nginx/html/admin

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
