import {ILobstersApp} from "./app/interface";
import {ILobstersTgBot} from "./tgBot/interface";
import {ILobstersStorage} from "./storage/interface";

// https://github.com/yagop/node-telegram-bot-api/issues/319
process.env.NTBA_FIX_319 = '1';
process.env.NTBA_FIX_350 = '1';

(async() => {
    const lobstersStorage: ILobstersStorage = await require('./storage')();
    const tgBot: ILobstersTgBot = await require('./tgBot')();
    const app: ILobstersApp = await require('./app')(lobstersStorage, tgBot);
})().catch((e) => {
    console.error('app error', new Date(), e);
});


process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});
