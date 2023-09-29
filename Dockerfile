FROM node:20.6.1 as build
WORKDIR /usr/src/app
COPY package* .
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20.6.1-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env.docker .env.docker
COPY --chown=node:node --from=build /usr/src/app/package* .
RUN npm install
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

ENV NODE_ENV production
CMD ["npm", "run", "start:prod"]