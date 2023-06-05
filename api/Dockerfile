FROM node:latest

RUN apt-get update && apt-get install inotify-tools -y

WORKDIR /api

ADD package.json /api
ADD yarn.lock /api

RUN yarn

ADD . /api

EXPOSE 3000