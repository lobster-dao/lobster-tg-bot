# Lobsters Telegram Bot

## BOT IS UP  YOUR DATA MIGHT BE REKT

Go here and press just that one damn button [@lobsterdao_nft_bot](https://t.me/lobsterdao_nft_bot) 

If you fuck up, you won’t be able to change your address later. The bot matches your telegramID with the address, and then deletes the info. The only thing exposed to the public will be the merkle: which is basically just your address + the number of claims you get.

The bot is hosted by semi-anon devs who might rug, so if you worry about your privacy - just use a new address. The bot can fuck things up or do something weird, which no admin is responsible for. And those are not disclaimers, we just generally don’t know what’s inside of it (it could be different to github after all). let’s also double-check the output of addresses and claims after with the excel sheet.

Bot stops at  2021-09-29 UTC 04:30:57 which early morning Wednesday. All unclaimed pieces go to DAO. Nobody will give you yours after that. So be online or be rekt. Nobody will answer your questions.

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