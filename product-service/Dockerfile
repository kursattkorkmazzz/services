ARG NODE_VERSION=23
FROM node:${NODE_VERSION} AS base


# INSTALL REQUIRED DEPENDENCIES
FROM base AS deps
WORKDIR /app
COPY package-lock.json package.json ./

RUN \
    if [ -f package-lock.json ]; then npm ci; else echo "package-lock.json does not exist"; fi

# BUILD THE APP
FROM base AS build
WORKDIR /app
COPY --from=deps /app ./
COPY . .
RUN npm run build

# APP RUNNER
FROM base AS runner
ARG APP_ENV=prod
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ./.env.${APP_ENV} ./.env

EXPOSE 3000

ENTRYPOINT [ "node","--env-file=.env", "./dist/server.js"]