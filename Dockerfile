# syntax=docker/dockerfile:1

# Etapa 1: instalar solo las dependencias de producción.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Etapa 2: imagen final mínima, sin devDependencies ni código de tests.
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Ejecutar como usuario sin privilegios (ya existe en la imagen oficial).
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
