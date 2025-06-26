FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

# Default command
CMD ["serve", "-s", "dist", "-l", "3000"]
