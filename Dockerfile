FROM node:20.10.0-alpine

WORKDIR /app
COPY package*.json /.
RUN npm install

COPY . .

ARG NODE_PORT
ENV PORT=${NODE_PORT}

CMD npx drizzle-kit generate && npx tsx src/db/migrate.ts && npm run dev

EXPOSE ${PORT}