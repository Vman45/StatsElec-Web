FROM node:alpine

WORKDIR /opt/statselec
COPY . /opt/statselec

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]