# 1️⃣ Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev) for building
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# 2️⃣ Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app ./

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
