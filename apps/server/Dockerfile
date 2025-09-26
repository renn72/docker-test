# Stage 1: Build stage
FROM oven/bun:1.2-debian AS builder

ARG CORS_ORIGIN
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG DATABASE_URL
ENV CORS_ORIGIN=${CORS_ORIGIN}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV DATABASE_URL=${DATABASE_URL}

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb to leverage Docker layer caching
# Using bun.lockb* to handle potential variations
COPY package.json bun.lockb* ./

# Install dependencies using the lockfile for reproducibility
RUN bun install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production stage
FROM oven/bun:1.2-debian

RUN apt-get update && apt-get install -y curl

# Set the working directory
WORKDIR /app

# Copy dependency manifests from the builder
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN bun install --production

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the example environment file.
# In production, you should provide an actual .env file or set environment variables.

# Create a directory for the database. This is useful if you're using a file-based database like SQLite.
RUN mkdir -p db

# Expose the port the application will run on (Hono's default with Bun is 3000)
EXPOSE 3000

# The command to run the application
CMD ["bun", "run", "dist/index.js"]
