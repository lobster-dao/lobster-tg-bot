import {ILobstersTgBot} from "./interface";

const config = require('./config');
const telegramBot = require('node-telegram-bot-api');

module.exports = async () => {
    const app = new LobstersTgBot();
    app.init();
    return app;
};

class LobstersTgBot implements ILobstersTgBot {
    bot: any;
    adminIds: any;

    onMessageCallbacks: any = [];

    constructor() {}

    init() {
        this.bot = new telegramBot(config.botKey, {filepath: false, polling: true});
        this.bot.on('message', (msg: any) => {
            this.triggerOnMessage('common', msg.from.id, msg.chat.id, msg.text);
        });
    }

    onMessage(callback: any) {
        this.onMessageCallbacks.push(callback);
    }

    triggerOnMessage(messageType: any, telegramUserId: any, telegramChatId: any, messageText: any) {
        if (messageText === '/start') {
            messageType = 'start';
        }
        this.onMessageCallbacks.forEach((callback: any) => {
            callback(messageType, telegramUserId, telegramChatId, messageText);
        });
    }

    sendMessageToUser(telegramId: any, text: any) {
        return this.bot.sendMessage(telegramId, text, {parse_mode: 'HTML', disable_web_page_preview: true});
    }

    sendDocumentToUser(telegramId: any, documentName: any, documentContent: any) {
        return this.bot.sendDocument(telegramId, Buffer.from(documentContent, 'utf8'), {}, {
            filename: documentName,
            contentType: 'text/plain'
        });
    }

    sendMessageToAdmin(messageText: any) {
        console.log('sendMessageToAdmin', this.adminIds, messageText);
        this.adminIds.forEach((adminId: any) => {
            return this.bot.sendMessage(adminId, messageText, {parse_mode: 'HTML', disable_web_page_preview: true}).catch((e: any) => {
                console.error('sendMessageToAdmin', e.message);
            });
        });
    }
}
