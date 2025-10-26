# 1️⃣ Build stage
FROM node:20-alpine AS builder
WORKDIR /src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
# Next.js will pick up environment variables at build time from the OS
RUN npm run build

# ───────────────────────────────
# 2️⃣ Production stage
FROM node:20-alpine AS runner
WORKDIR /src/app

# Copy built output and package files
COPY --from=builder /src/app ./

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
