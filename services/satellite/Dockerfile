FROM node:22-alpine AS builder
WORKDIR /build/services/satellite
COPY tsconfig.json /build/tsconfig.json
COPY services/satellite/package*.json ./
RUN npm ci
COPY services/satellite/server.mjs services/satellite/billing.mjs services/satellite/build.mjs ./
COPY src/lib/satellite/auth.ts /build/src/lib/satellite/auth.ts
COPY src/lib/mobile-sensors/math.ts /build/src/lib/mobile-sensors/math.ts
COPY src/lib/astronomy /build/src/lib/astronomy
COPY src/lib/geo /build/src/lib/geo
RUN npm run build
FROM node:22-alpine
WORKDIR /app
ARG SOURCE_REVISION=unknown
LABEL org.opencontainers.image.source="https://github.com/atamoradi14/sufi-astronomy-platform" org.opencontainers.image.revision=$SOURCE_REVISION
RUN addgroup -S -g 1001 satellite && adduser -S -u 1001 -G satellite satellite
COPY --from=builder --chown=1001:1001 /build/services/satellite/dist/server.cjs ./server.cjs
COPY --chown=1001:1001 services/satellite/downloads ./downloads
USER 1001:1001
ENV PORT=3860 SATELLITE_DB_PATH=/data/satellite.sqlite APK_DIR=/app/downloads
EXPOSE 3860
CMD ["node","server.cjs"]
