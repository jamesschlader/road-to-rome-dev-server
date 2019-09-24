FROM node:8.16.1-alpine

WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 3001

ENV NODE_ENV development

CMD ["npm", "start"]