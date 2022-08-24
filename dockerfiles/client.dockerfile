FROM alpine

WORKDIR /client

COPY package.json .

RUN apk add npm

RUN npm install

COPY ./client . 

CMD [ "npm", "start" ]