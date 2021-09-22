import {ILobstersStorage} from "./interface";

const { Sequelize, DataTypes } = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Users = sequelize.define('Users', {
    telegramId: {
        type: DataTypes.STRING(100)
    },
    count: {
        type: DataTypes.INTEGER
    },
    address: {
        type: DataTypes.STRING(100),
        defaultValue: "",
    }
}, {
    indexes: [{ fields: ['telegramId'] }]
});

module.exports = async () => {
    const storage = new LobstersStorage();
    await storage.init();
    return storage;
};

class LobstersStorage implements ILobstersStorage {
    constructor() {}

    async init() {
        await Users.sync();
    }

    async getUser(telegramId: any) {
        return Users.findOne({where: {telegramId}});
    }

    async addTelegramIdUser(telegramId: any, count: any) {
        return Users.create({telegramId, count});
    }

    async addEthereumAddressUser(address: any, count: any) {
        return Users.create({address, count});
    }

    async updateUser(telegramId: any, address: any) {
        return Users.update({address, telegramId: ''}, {where: {telegramId}});
    }

    async usersCount() {
        return Users.count({});
    }

    async usersCountWithAddress() {
        return Users.count({where: {address: {[Op.ne]: ""}}});
    }

    async usersCountWithoutAddress() {
        return Users.count({where: {address: ""}});
    }

    async usersList() {
        return Users.findAll({});
    }

    async usersListWithAddress() {
        return Users.findAll({where: {address: {[Op.ne]: ""}}});
    }

    async usersListWithoutAddress() {
        return Users.findAll({where: {address: ""}});
    }
}
