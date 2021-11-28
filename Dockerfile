FROM node:14

ENV UNQFY_HOST 'http://host.docker.internal:8080'

WORKDIR /home/node/newsletter

COPY package.json .
COPY package-lock.json .
COPY credentials.json .
COPY token.json .
RUN ["npm", "install"]

EXPOSE 3001

COPY src /home/node/newsletter/src

RUN chown -R node:users /home/node/newsletter

USER node

CMD ["npm", "run", "api"]