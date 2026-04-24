# stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY src/frontend/package*.json ./
RUN npm ci

# Copy source
COPY src/frontend/ ./

# Build the application
RUN npm run build

# stage 2: run
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Production dependencies
RUN npm ci --omit=dev

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Start
EXPOSE 3000
CMD ["npm", "start"]