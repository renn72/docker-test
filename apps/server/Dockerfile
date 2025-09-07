# Stage 1: Build the server
# We use a bun base image for the build process.
FROM oven/bun:1.1.18-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package management files to leverage Docker's cache.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install Curl
RUN apt-get update && apt-get install -y curl &&\
apt-get clean && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - &&\
apt-get update && apt-get install -y nodejs && npm install -g npm@latest &&\
npm install -g pnpm && pnpm install --frozen-lockfile


# Copy the entire monorepo source.
COPY . .

# Build the server application using Turborepo.
RUN bunx turbo run build --filter=server

# Stage 2: Final production image
# Use a minimal Bun image for a lean final image.
FROM oven/bun:1.1.18-slim

# Set the working directory.
WORKDIR /app

# Copy only the necessary server build artifacts from the builder stage.
COPY --from=builder /app/apps/server/dist ./dist

# Copy the server's package.json to install only production dependencies.
COPY --from=builder /app/apps/server/package.json ./package.json

# Install production dependencies for the server.
RUN pnpm install --prod

# Create the directory for the SQLite database.
# This ensures the directory exists before the volume is mounted.
RUN mkdir -p /app/db

# Expose the server's port.
EXPOSE 3001

# Set the command to run the Hono server.
CMD
