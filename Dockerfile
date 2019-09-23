FROM node:8.16.1-alpine

WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 3001:3001

ENV NAME development

CMD ["npm", "start"]