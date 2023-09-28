FROM node:20.6.1

WORKDIR /usr/src/api

COPY --chown=node:node . .

RUN npm i

ENV NODE_ENV=development
ENV DB_USER=smilepay
ENV DB_PASSWORD=smilepay
ENV DB_NAME=smilepay
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

RUN echo "DATABASE_URL=${DATABASE_URL}" > .env && cat .env

# RUN npx prisma migrate dev --name init

USER node
CMD npx prisma migrate dev --name init && npm run start:dev