export {};

const _ = require('lodash');
const web3Utils = require('web3-utils');

const utils = {
    isAddress(str: any) {
        return web3Utils.isAddress(str);
    },

    isNumber(str: any) {
        if (_.isString(str) && !/^[0-9.]+$/.test(str)) {
            return false;
        }
        return !isNaN(parseFloat(str));
    },

    getTimestamp() {
        return Math.floor(new Date().getTime() / 1000);
    },

    timestampToDateString(timestamp: any) {
        const date = new Date(timestamp * 1000);
        const dateTimeString = date.toISOString().split('.')[0];
        const dateString = dateTimeString.split('T')[0];
        const timeString = dateTimeString.split('T')[1];
        return _.reverse(dateString.split('-')).join('.') + ' ' + timeString;
    },
};

module.exports = utils;
