FROM alpine

WORKDIR /server

COPY ./server/package.json .

RUN apk add npm

RUN npm install

COPY ./server .

# https://stackoverflow.com/questions/49955097/how-do-i-add-a-user-when-im-using-alpine-as-a-base-image
RUN addgroup -S nonroot && adduser -S appuser -G nonroot

# Start Docker using appuser
USER appuser

CMD ["npm", "start"]