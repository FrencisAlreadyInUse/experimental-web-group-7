# experimental-web-group-7

School group assignment for Experimental Web

## Installation

Download

```Bash
git clone https://github.com/vgesteljasper/experimental-web-group-7.git
cd ./experimental-web-group-7
yarn install
```

Generate ssl certs for https to work locally

```Bash
chmod a+x ./server/config/generate-ssl-certs.sh
./server/config/generate-ssl-certs.sh
```

Fill in the .env file

```Bash
mv ./.env-example ./.env
vim ./.env
```

## Run

Development

```Bash
# development
yarn development
```

Production

```Bash
# make production build
yarn production

# serve production build
yarn serve
```