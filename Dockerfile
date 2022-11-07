FROM node:16-alpine AS migrate
WORKDIR /usr/src/app

COPY prisma ./prisma

CMD ["npx", "prisma", "migrate", "deploy"]

FROM node:16-alpine AS builder
WORKDIR /usr/src/app

ARG NPM_TOKEN
COPY .npmrc.docker ./.npmrc

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma

RUN yarn install --production --frozen-lockfile --non-interactive
RUN cp -R node_modules prod_node_modules

RUN yarn install --frozen-lockfile --non-interactive
COPY . ./

RUN rm -f .npmrc

RUN yarn build

# Start Server
FROM node:16-alpine AS server
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/prod_node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma

CMD ["yarn", "start:prod"]
