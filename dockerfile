FROM node:18-slim


RUN apt-get update \
    && apt-get install -y ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm cache clean --force \
    && npm config rm proxy \
    && npm config rm https-proxy


WORKDIR /app
RUN mkdir client
RUN mkdir server

COPY client/package*.json /app/client
COPY server/package*.json /app/server
COPY client/tsconfig*.json /app/client
COPY server/tsconfig*.json /app/server
COPY package*.json /app

RUN npm install

COPY client /app/client
COPY server /app/server
COPY . .

RUN npm run build

CMD ["npm", "start"]

EXPOSE 4000
