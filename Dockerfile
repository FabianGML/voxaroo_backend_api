FROM node:18.17.1-alpine

RUN mkdir -p /home/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]