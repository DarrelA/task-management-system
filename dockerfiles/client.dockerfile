FROM alpine

WORKDIR /client

COPY ./client/package.json .

RUN apk add npm

RUN npm install

COPY ./client . 

CMD ["npm", "start"]