FROM node:18-slim


RUN apt-get update \
    && apt-get install -y ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm cache clean --force \
    && npm config rm proxy \
    && npm config rm https-proxy


WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


EXPOSE 4000

CMD [ "npm", "run", "start" ]