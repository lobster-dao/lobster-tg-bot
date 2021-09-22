module.exports = {
    startTimestamp: 1632239071,
    endTimestamp: 1633250019,
    admins: (process.env.ADMIN_IDS || '').split(',').map(i => parseInt(i))
};