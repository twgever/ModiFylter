
#stage 1: Build
    FROM ghcr.io/puppeteer/puppeteer:23.6.0 AS build

    WORKDIR /usr/src/app

    COPY package*.json ./

    RUN npm install && npm cache clean --force

    COPY . .

    #stage 2: Runtime

    FROM node:20-slim

    WORKDIR /usr/src/app

    RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    && rm -rf /var/lib/apt/lists/*

    ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

    COPY --from=build /usr/src/app /usr/src/app

    ENTRYPOINT ["node", "user.js"]

    CMD ["LD", "jpg", "Downloads", "[2,2]", "[500,1000]"]



