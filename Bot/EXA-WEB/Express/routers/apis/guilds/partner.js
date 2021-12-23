const { Router } = require('express');
const { client } = require('../../../../../index');
const db = require('../../../../../functions/database');

const router = Router();

router.all('/:guildID/partner/:task/:RoleChannelID?', async(req, res) => {
    const { guildID, task, RoleChannelID } = req.params;
    const guild = client.guilds.cache.get(guildID);
    if (task === 'info') {
        const partner_message = await db.get('partner_message') || {};
        const partnerChannel = await db.get('partner_channels') || {};
        const role = await db.get('partner_roles') || {};
        res.send({
            role: role[guild.id],
            channel: partnerChannel[guild.id],
            message: partner_message[guild.id]
        });
    } else if (task.startsWith('channel')) {
        const channel = guild.channels.cache.get(RoleChannelID);
        if (channel) {
            const setChannel = async(type) => {
                const partnerChannelsData = await db.get(type) || {};
                const willSave = channel.id;
                channel.send(`> **قناة ${type} => ${channel}**`);
                partnerChannelsData[guild.id] = willSave;
                res.send(db.set(type, partnerChannelsData));
            }
            if (task.endsWith('Request')) await setChannel('partner_requests')
            else await setChannel('partner_channels');
        } else return res.status(404).send({ message: RoleChannelID + ' غير معرف' });
    } else if (task === 'role') {
        const role = guild.roles.cache.get(RoleChannelID);
        if (role) {
            const partnerRolesData = await db.get('partner_roles') || {};
            const willSave = role.id;
            partnerRolesData[guild.id] = willSave;
            res.send(db.set('partner_roles', partnerRolesData));
        } else return res.status(404).send({ message: RoleChannelID + ' غير معرف' });
    } else if (task === 'message') {
        const { message } = req.body;
        if (message) {
            const partnerMessage = await db.get('partner_message') || {};
            partnerMessage[guild.id] = message;
            res.send(db.set('partner_message', partnerMessage));
        } else return res.status(404).send({ message: 'يرجى تحديد الرسالة' });
    } else return res.status(404).send({ message: task + ' غير معرف' });
});

module.exports = router;