# Set node and alpine versions
ARG NODE_VER="16"
ARG ALPINE_VER="3.15"
FROM node:$NODE_VER-alpine$ALPINE_VER as builder

ARG SQLCIPHER_VER="4.4.3"

RUN mkdir -p /app
WORKDIR /app
ENV NODE_ENV production

COPY package.json ./
COPY .npmrc ./
ARG GITHUB_PAT
RUN npm install --production
RUN npm install @next/swc-linux-x64-gnu

COPY src ./src
COPY config-overrides.js ./
COPY tsconfig.json ./
COPY public ./public
RUN npm run build

FROM node:$NODE_VER-alpine$ALPINE_VER
RUN mkdir -p /app
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/server.js ./server.js

CMD [ "node", "server.js" ]