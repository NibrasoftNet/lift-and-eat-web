# Use the latest Node.js version (20.x) as the base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy package files for dependency installation
COPY package.json package-lock.json ./ 

# Install dependencies using npm
RUN npm ci
RUN npm install sharp

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . ./ 

# Build the Next.js application
RUN npm run build

# Create the production image
FROM base AS runner
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Install curl in the final image
RUN apk add --no-cache curl

# Install sharp in the final image
RUN npm install sharp

# Set the NEXT_SHARP_PATH environment variable
ENV NEXT_SHARP_PATH="/app/node_modules/sharp"

# Create a non-root user for running the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files to the production image
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set permissions for the prerender cache
RUN mkdir -p .next && chown nextjs:nodejs .next

# Switch to the non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
