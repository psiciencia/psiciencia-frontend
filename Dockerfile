# Imagen de producción del frontend SvelteKit (adapter-node).
FROM node:22-alpine AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm
WORKDIR /app

# 1. Dependencias: capa cacheada mientras no cambien package.json / pnpm-lock.yaml.
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# 2. Compilación: adapter-node empaqueta todo en build/ (todas las dependencias son devDependencies).
#    ORIGIN es la URL pública del sitio (protección CSRF de los formularios).
ARG ORIGIN=""
COPY . .
RUN ORIGIN="$ORIGIN" pnpm build

# 3. Runtime mínimo: solo Node y la carpeta build/.
FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/build ./build
USER node
EXPOSE 3000

CMD ["node", "build"]
