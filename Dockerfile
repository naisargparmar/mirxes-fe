### ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    npm install; \
  fi

# Copy the rest of the source and build
COPY . .
RUN npm run build

### ---- Runtime stage (Node) ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what is needed to run the preview server
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    npm install; \
  fi

# Copy built app from builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 4173

# Use Vite preview to serve the built app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
