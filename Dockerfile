# ============
# Build
# ============

FROM node:22-alpine3.20 AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci && npm run build

# ============
# Final
# ============

FROM node:22-alpine3.20

WORKDIR /usr/src/app

ENV NODE_ENV=production

EXPOSE 3000

COPY --from=build /usr/src/app/build build

COPY package*.json .
COPY public public

RUN npm ci

CMD [ "npm", "run", "start" ]
