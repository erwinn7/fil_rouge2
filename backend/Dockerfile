FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client at build time (no real DB needed for generate)
# DATABASE_URL is only read by prisma.config.ts during generate, not used to connect
ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

EXPOSE 3001

# At runtime: run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
