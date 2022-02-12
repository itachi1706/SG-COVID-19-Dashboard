# Stage 1 build and install dependencies
FROM node:16-alpine3.13 as build

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

# Stage 2 add files and remove unwanted files. Also generate the SHA
FROM node:16-alpine3.13 as preparse

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

RUN apk add --no-cache git
RUN git rev-parse --short HEAD > COMMITSHA

# Remove git directory
RUN rm -rf .git && rm -rf .gitignore && rm -rf Dockerfile && rm -rf .gitlab-ci.yml

# Stage 3 copy and prepare final image
FROM node:16-alpine3.13

WORKDIR /usr/src/app
COPY --from=preparse /usr/src/app .

EXPOSE 3000

CMD [ "npm", "start" ]
