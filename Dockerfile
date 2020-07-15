FROM node:alpine as build

# Setup Python in case we need it
# This hack is widely applied to avoid python printing issues in docker containers.
ENV PYTHONUNBUFFERED=1
RUN echo "**** install Python 3 ****" && apk add --no-cache python3 python3-dev build-base && if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi
RUN echo "**** install pip ****" && python3 -m ensurepip && rm -r /usr/lib/python*/ensurepip 
RUN pip3 install --no-cache --upgrade pip setuptools wheel && if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi
RUN echo "**** install Python 2 ****" && apk add --no-cache python2 python2-dev

# Install Node Dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i

FROM node:alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
