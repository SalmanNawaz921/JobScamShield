# 1️⃣ Use a smaller, stable Node.js base image
FROM node:20-alpine AS builder

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy only package files for caching dependencies
COPY package*.json ./

# 4️⃣ Install dependencies (use npm ci for reproducibility)
RUN npm ci --omit=dev

# 5️⃣ Copy source code
COPY . .

# 6️⃣ Build the app (Next.js or similar)
RUN npm run build

# ────────────────────────────────────────────────
# 7️⃣ Use a separate lightweight image for production
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the built output and minimal files from builder
COPY --from=builder /app ./

# Set environment variable for production
ENV NODE_ENV=production

# 8️⃣ Expose the default app port
EXPOSE 3000

# 9️⃣ Start the app
CMD ["npm", "start"]
