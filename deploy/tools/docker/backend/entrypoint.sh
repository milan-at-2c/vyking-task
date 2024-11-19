#!/bin/sh

yarn install

yarn global add pm2
npm install -g nodemon

echo "Waiting for the database to be ready..."
while ! nc -z vyking-db 3306; do
  sleep 1
done

yarn migrate

echo "Waiting for redis to be ready..."
while ! nc -z vyking-redis 6379; do
  sleep 1
done

pm2-runtime start ecosystem.config.js