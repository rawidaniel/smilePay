FROM node:20.6.1

WORKDIR /api

COPY . .

RUN npm i

RUN npx prisma migrate dev --name init

CMD ['npm', 'run', 'start:dev']