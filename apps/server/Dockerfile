# Stage 1: Build the server
# We use a bun base image for the build process.
FROM oven/bun:1.1.18-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package management files to leverage Docker's cache.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install pnpm.
RUN apt-get update && apt-get install -y ca-certificates curl gnupg && mkdir -p /etc/apt/keyrings && curl -fsSL https://www.google.com/search?q=https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://www.google.com/search?q=https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && apt-get update && apt-get install -y nodejs


# Install pnpm.
RUN npm install -g pnpm

# Install all dependencies.
RUN pnpm install --frozen-lockfile

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
