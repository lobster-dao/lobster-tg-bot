# Lobsters Telegram Bot

## Start
```
yarn
ADMIN_IDS=1111111222 TG_KEY=2222233333:AAA777sdfsdfdsgdsfsdfsdfsd npm start
```

## Start in background
```
yarn
yarn global add pm2
pm2 install typescript
ADMIN_IDS=1111111222 TG_KEY=2222233333:AAA777sdfsdfdsgdsfsdfsdfsd pm2 start --name "lobsters-bot"
```