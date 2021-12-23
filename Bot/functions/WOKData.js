module.exports = async function WOKData(dataName) {
    const _ = require('lodash');
    if (!dataName || !_.isString(dataName)) return null;
    else if (!dataName.startsWith('wokcommands-'))
        dataName = `wokcommands-${dataName}`;
    const { mongo } = await require('../index').client;
    const model = mongo.models[
        dataName
        // "wokcommands-cooldowns"
        // "wokcommands-disabled-commands"
        // "wokcommands-languages"
        // "wokcommands-prefixes"
        // "wokcommands-required-roles"
        // "wokcommands-channel-commands"
        // "wokcommands-slash-commands"
    ];
    const results = await model;
    return results;
}