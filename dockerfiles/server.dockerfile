FROM alpine

WORKDIR /server

COPY ./server/package.json .

RUN apk add npm

RUN npm install

COPY ./server .

CMD ["npm", "start"]