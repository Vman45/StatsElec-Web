FROM node:alpine
LABEL maintainer="Michael Vieira <contact+dev[at]mvieira[dot]fr>"

WORKDIR /opt/statselec
COPY . /opt/statselec

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]