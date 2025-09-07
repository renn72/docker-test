# Stage 1: Build the frontend
# We use a bun base image for the build process.
FROM oven/bun:1.1.18-slim AS builder

# Set the working directory.
WORKDIR /app

# Copy package management files to leverage Docker's cache.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the entire monorepo source.
COPY . .

# Install Curl
RUN apt-get update && apt-get install -y curl &&\
apt-get clean && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - &&\
apt-get update && apt-get install -y nodejs && npm install -g npm@latest &&\
npm install -g pnpm && pnpm install --frozen-lockfile


# Build the web application using Turborepo.
RUN bunx turbo run build --filter=web

# Stage 2: Final production image
# Use a simple NGINX image to serve the static frontend files.
FROM nginx:alpine

# Copy the built frontend files from the builder stage to NGINX's public directory.
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Expose the frontend's port.
EXPOSE 3000

# The NGINX server will automatically start and serve the files.
CMD ["nginx", "-g", "daemon off;"]
