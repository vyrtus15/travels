FROM node:12-alpine AS builder
RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app
WORKDIR /usr/app
RUN apk add --no-cache python make g++

# add npm dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --only=production
RUN cp -r ./node_modules ./production_node_modules
RUN npm ci

# add source code
COPY nest-cli.json nest-cli.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY src src

# build source code
RUN npm run build


FROM node:12-alpine
LABEL maintainer="Radu Proca"
RUN apk --no-cache add curl
RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app
WORKDIR /usr/app
USER node
ENV NODE_OPTIONS="--no-warnings"
COPY package*.json ./
COPY --chown=node:node --from=builder /usr/app/production_node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/app/dist .

EXPOSE 3000
ENTRYPOINT ["node", "main.js"]