import {ILobstersTgBot} from "../tgBot/interface";
import {ILobstersApp} from "./interface";
import {ILobstersStorage} from "../storage/interface";

const fs = require('fs');
const _ = require('lodash');
const pIteration = require('p-iteration');
const utils = require('../utils');
const config = require('./config');
const treeHelper = require('lobster-dao/lobster-nft-contracts/helpers/tree');


function locale(name: string, options: any = {}) {
    return {
        'unknown_command': `Unknown command`,
        'export': `${options.usersCountWithAddress}/${options.usersCount} users sent their addresses. Rest tokens count: ${options.restCount}.\\n\\nGenerating Merkle Tree...`,
        'welcome': `🦞 Welcome to the Lobsters bot! Please, send your Ethereum address for NFT drop. If you’re on the list I will add it to Merkle Tree. Do not use exchange address!`,
        'welcome_not_in_list': `🦞 Welcome to the Lobsters bot! You are not on the List. Sorry!`,
        'didnt_start': `Sorry, we don’t collect addresses for the drop yet. Please come back on the <code>` + utils.timestampToDateString(config.startTimestamp) + ' UTC</code>',
        'not_in_list': `You’re not on the List or your telegramID is already deleted`,
        'finished': `Sorry, we have all the addresses now. You missed your chance bro!`,
        'address_incorrect': `Incorrect account address. Please, send the correct Ethereum address.`,
        'address_updated': `The address has been successfully added and the telegramID has been removed from DB`,
    }[name];
}

module.exports = async (storage: any, tgBot: any) => {
    const app = new LobstersApp(storage, tgBot);
    await app.init();
    return app;
};

class LobstersApp implements ILobstersApp {
    storage: ILobstersStorage;
    tgBot: ILobstersTgBot;

    constructor(storage: any, tgBot: any) {
        this.storage = storage;
        this.tgBot = tgBot;
    }

    async init() {
        const usersCount = await this.storage.usersCount();

        if (!usersCount) {
            const telegramIdLobstersContent = fs.readFileSync('./app/telegramIdLobsters.csv', {encoding: 'utf8'});
            await pIteration.forEach(telegramIdLobstersContent.split(/\r\n|\r|\n/g), async (line: any) => {
                const split = line.split(',');
                if (!utils.isNumber(split[0])) {
                    return;
                }
                return this.storage.addTelegramIdUser(split[0], parseInt(split[1])).catch(() => {/* already added */});
            });
        }

        const ethereumAddressLobstersContent = fs.readFileSync('./app/ethereumAddressLobsters.csv', {encoding: 'utf8'});
        await pIteration.forEach(ethereumAddressLobstersContent.split(/\r\n|\r|\n/g), async (line: any) => {
            const split = line.split(',');
            if (!utils.isAddress(split[0])) {
                return;
            }
            await this.storage.removeEthereumAddressUser(split[0]);
            return this.storage.addEthereumAddressUser(split[0], parseInt(split[1])).catch(() => {
                return this.storage.updateEthereumAddressUser(split[0], parseInt(split[1]))
            });
        });

        console.log('usersCount', await this.storage.usersCount(), 'usersCountWithAddress', await this.storage.usersCountWithAddress());

        this.tgBot.onMessage(async (messageType: any, telegramUserId: any, telegramChatId: any, messageText: any) => {
            if (telegramUserId !== telegramChatId || !telegramUserId) {
                return;
            }
            if (_.includes(config.admins, parseInt(telegramUserId))) {
                if (messageText === '/export') {
                    const [usersCount, usersCountWithAddress] = await Promise.all([
                        this.storage.usersCount(),
                        this.storage.usersCountWithAddress()
                    ]);

                    const users: any = _.shuffle(await this.storage.usersListWithAddress());
                    let restCount = config.totalTokensCount;
                    users.forEach((u: any) => {
                        restCount -= u.count;
                    });

                    await this.tgBot.sendMessageToUser(telegramUserId, locale('export', {
                        usersCountWithAddress,
                        usersCount,
                        restCount
                    }));

                    const addressToLeafDict = {} as any;
                    try {

                        users.push({ address: config.remainedMultisig, count: restCount });

                        const leaves = treeHelper.getLeaves(users, addressToLeafDict);
                        const tree = treeHelper.makeTree(leaves);

                        const jsonContent = {
                            treeRoot: tree.getHexRoot(),
                            treeLeaves: [],
                        } as any;


                        users.forEach((u: any) => {
                            const leaf = addressToLeafDict[u.address];
                            const proof = leaf ? tree.getHexProof(leaf, leaves.indexOf(leaf)) : null;
                            jsonContent.treeLeaves.push({
                                address: u.address,
                                count: u.count,
                                leaf: leaf ? `0x${leaf.toString('hex')}` : null,
                                proof,
                            });
                        });

                        return this.tgBot.sendDocumentToUser(
                            telegramUserId,
                            'lobsters-export-' + utils.timestampToDateString(utils.getTimestamp()) + '.json',
                            JSON.stringify(jsonContent)
                        );
                    } catch (e) {
                        return this.tgBot.sendMessageToUser(telegramUserId, `Error: <code>${(e as any)['message']}</code>`);
                    }
                } else if (messageType !== 'start' && _.startsWith(messageText, '/')) {
                    return this.tgBot.sendMessageToUser(telegramUserId, locale('unknown_command'));
                }
            }

            if (utils.getTimestamp() < config.startTimestamp) {
                return this.tgBot.sendMessageToUser(telegramUserId, locale('didnt_start'));
            }

            const user = await this.storage.getUser(telegramUserId);
            if (messageType === 'start') {
                if (user) {
                    return this.tgBot.sendMessageToUser(telegramUserId, locale('welcome'));
                } else {
                    return this.tgBot.sendMessageToUser(telegramUserId, locale('welcome_not_in_list'));
                }
            }
            if (messageType === 'start') {
                return;
            }
            if (!user) {
                return this.tgBot.sendMessageToUser(telegramUserId, locale('not_in_list'));
            }
            if (utils.getTimestamp() > config.endTimestamp) {
                return this.tgBot.sendMessageToUser(telegramUserId, locale('finished'));
            }
            if (!utils.isAddress(messageText)) {
                return this.tgBot.sendMessageToUser(telegramUserId, locale('address_incorrect'));
            }
            await this.storage.updateUser(telegramUserId, messageText);
            return this.tgBot.sendMessageToUser(telegramUserId, locale('address_updated'));
        });

        console.log('init finished');
    }
}
