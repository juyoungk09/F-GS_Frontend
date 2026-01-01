FROM node:22 AS builder

WORKDIR /front_app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-slim AS runner

WORKDIR /front_app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /front_app ./

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

CMD ["npm", "run", "start"]