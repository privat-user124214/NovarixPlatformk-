# ----------- STAGE 1: Build Frontend + Backend -----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build frontend and backend
RUN npm run build

# ----------- STAGE 2: Production Server -----------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the build output from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Environment (secure defaults)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]
