FROM node:20-alpine

WORKDIR /app

# ── Dépendances ──────────────────────────────────────────────
COPY package*.json ./
RUN npm install

# ── Code source ──────────────────────────────────────────────
COPY . .

# ── Prisma generate (pas de vraie DB nécessaire au build) ────
ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# ── Entrypoint exécutable ─────────────────────────────────────
RUN sed -i 's/\r//' entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 3001

# Au démarrage : migrations → seeds → serveur
ENTRYPOINT ["sh", "entrypoint.sh"]