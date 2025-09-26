# Stage 1: Build the frontend
# We use a bun base image for the build process.
FROM oven/bun:1.1.18-slim AS builder

# Accept the VITE_SERVER_URL build argument
ARG VITE_SERVER_URL
# Set it as an environment variable for the build
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

# Set the working directory.
WORKDIR /

# Copy package management files to leverage Docker's cache.
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the entire monorepo source.
COPY . .

# Install Curl
RUN apt-get update && apt-get install -y curl &&\
apt-get clean && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - &&\
apt-get update && apt-get install -y nodejs && npm install -g npm@latest &&\
npm install -g pnpm && pnpm install

RUN env

# Build the web application using Turborepo.
RUN bunx vite build

# Stage 2: Final production image
# Use a simple NGINX image to serve the static frontend files.
FROM nginx:alpine

# Copy the built frontend files from the builder stage to NGINX's public directory.
COPY --from=builder /dist /usr/share/nginx/html

# Expose the frontend's port.
EXPOSE 80

# The NGINX server will automatically start and serve the files.
CMD ["nginx", "-g", "daemon off;"]
