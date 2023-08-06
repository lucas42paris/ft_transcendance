FROM node:latest

RUN npm install -g npm@9.6.5

ENV NODE_ENV=development

WORKDIR /front

COPY . /front

RUN chmod +x /front/entrypoint.sh
CMD ["sh", "/front/entrypoint.sh"]