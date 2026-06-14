# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy all source files
COPY . .

# Use npm instead of Yarn to avoid Corepack network downloads at build time.
# Generate package-lock.json from package.json and install.
RUN npm install --legacy-peer-deps

# Build arguments – Vite bakes these into the static bundle at build time
ARG VITE_APP_BASE_NAME=/
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

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets into /admin/ subfolder so nginx can serve by subpath
COPY --from=builder /app/dist /usr/share/nginx/html/admin

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
