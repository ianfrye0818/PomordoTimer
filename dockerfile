FROM node:20.14.0-bullseye-slim

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install all dependencies (including dev dependencies for build)
RUN pnpm install

# Copy the rest of your source code
COPY . .

# Build the application
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start:prod"]