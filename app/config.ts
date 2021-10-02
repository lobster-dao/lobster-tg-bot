module.exports = {
    startTimestamp: 1632587457,
    endTimestamp: 1632587457 + (84 + 48 + 72) * 60 * 60,
    admins: (process.env.ADMIN_IDS || '').split(',').map(i => parseInt(i)),
    remainedMultisig: '0x557068A9b7d66F97A61b97C80541eb17672E1e6f',
    totalTokensCount: 6501
};