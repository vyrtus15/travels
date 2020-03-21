FROM node:12
RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app
WORKDIR /usr/app

# add npm dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i

# add tests source code
USER node
COPY nest-cli.json nest-cli.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY src src
COPY test test
ENTRYPOINT ["npm", "run", "test:e2e:run"]