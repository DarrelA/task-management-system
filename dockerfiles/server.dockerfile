FROM alpine

WORKDIR /server

COPY package.json .

RUN apk add --update npm

RUN npm install

COPY ./server .

RUN ls

CMD ["npm", "start"]