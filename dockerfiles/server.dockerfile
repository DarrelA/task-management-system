FROM alpine

WORKDIR /server

COPY package.json .

RUN apk add --update npm

RUN npm install

COPY .env .
COPY ./server .

RUN ls

CMD ["node", "server.js"]