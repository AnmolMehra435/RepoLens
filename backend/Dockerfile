FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git perl npm
RUN npm install -g cloc

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]