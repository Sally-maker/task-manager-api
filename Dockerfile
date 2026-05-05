FROM node:20-alpine

WORKDIR /app

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma/

RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
