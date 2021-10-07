export interface ILobstersStorage {
    getUser(telegramId): Promise<any>;
    addTelegramIdUser(telegramId, count): Promise<any>;
    addEthereumAddressUser(address, count): Promise<any>;
    updateEthereumAddressUser(address, count): Promise<any>;
    updateUser(telegramId, address): Promise<any>;
    usersCount(): Promise<number>;
    usersCountWithAddress(): Promise<number>;
    usersCountWithoutAddress(): Promise<number>;
    usersList(): Promise<any[]>;
    usersListWithAddress(): Promise<any[]>;
    usersListWithoutAddress(): Promise<any[]>;
}

