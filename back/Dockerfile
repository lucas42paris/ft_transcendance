FROM node:latest

RUN npm install -g npm@9.6.5

WORKDIR /back

ENV NODE_ENV=development
# COPY ./bin/sh/entrypoint.sh /usr/bin/entrypoint.sh
COPY . /back

RUN apt-get update && apt-get install -y netcat-openbsd

EXPOSE 8080

RUN chmod +x /back/entrypoint.sh
CMD ["sh", "/back/entrypoint.sh"]