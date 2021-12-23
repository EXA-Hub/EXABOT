const { Router } = require('express');
const { client } = require('../../../../../index');
const db = require('../../../../../functions/database');

const router = Router();

router.all('/:guildID/welcome/:task/:channelID?', async(req, res) => {
    const { guildID, task, channelID } = req.params;
    const guild = client.guilds.cache.get(guildID);
    if (task === 'on' || task === 'off') {
        const datafile = await db.get('welcome_on-off') || {};
        datafile[guild.id] = task;
        res.send(db.set('welcome_on-off', datafile));
    } else if (task === 'info') {
        const welcome_message = await db.get('welcome_message') || {};
        const welcomeChannel = await db.get('welcome_channels') || {};
        const working = await db.get('welcome_on-off') || {};
        res.send({
            switch: working[guild.id],
            channel: welcomeChannel[guild.id],
            message: welcome_message[guild.id]
        });
    } else if (task === 'channel') {
        const channel = guild.channels.cache.get(channelID);
        if (channel) {
            const welcomeChannelsData = await db.get('welcome_channels') || {};
            const willSave = channel.id;
            channel.send(`> **قناة الترحيب => ${channel}**`);
            welcomeChannelsData[guild.id] = willSave;
            res.send(db.set('welcome_channels', welcomeChannelsData));
        } else return res.status(404).send({ message: channelID + ' غير معرف' });
    } else if (task === 'message') {
        const { message } = req.body;
        if (message) {
            const welcomeMessage = await db.get('welcome_message') || {};
            welcomeMessage[guild.id] = message;
            res.send(db.set('welcome_message', welcomeMessage));
        } else return res.status(404).send({ message: 'يرجى تحديد الرسالة' });
    } else return res.status(404).send({ message: task + ' غير معرف' });
});

module.exports = router;