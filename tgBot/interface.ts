export interface ILobstersTgBot {
    sendMessageToAdmin(messageText);
    onMessage(callback);
    sendMessageToUser(telegramId, text);
    sendDocumentToUser(telegramId, documentName, documentContent);
}

