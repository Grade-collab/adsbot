FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm
RUN npm install -g prisma
RUN pnpm install

CMD npx  prisma migrate deploy && npx prisma generate && pnpm start  