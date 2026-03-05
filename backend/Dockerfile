# Base image
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install dependencies required for Prisma
RUN apk add --no-cache openssl

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# --- Stage 2: Production ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Install openssl for prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy built app and generated Prisma client from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000

# Start server
CMD ["npm", "start"]
