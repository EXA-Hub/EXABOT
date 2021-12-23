const { Router } = require('express');
const { client } = require('../../../../../index');
const db = require('../../../../../functions/database');
const unmute = require('../../../APIfunctions/unmute');

const router = Router();

router.all('/:guildID/unmute/:memberID', async(req, res) => {
    const { guildID, memberID } = req.params;
    if (!memberID) return res.status(404).json({ message: 'guildID & memberID مطلوبين' });
    const mutedPeople = await db.get("muted");
    if (!mutedPeople) return res.status(404).json({ message: 'لم يتم العثور على أعضاء في قاعدة البيانات' });
    const mutedMembers = mutedPeople[guildID];
    if (!mutedMembers) return res.status(404).json({ message: 'لا يوجد محظورين في المجتمع' });
    if (!mutedMembers.includes(memberID)) return res.status(404).json({ message: 'هذا العضو غير محظور' });
    const guild = client.guilds.cache.get(guildID);
    if (!guild) return res.status(404).json({ message: 'لا يوجد مجتمع' });
    const member = guild.members.cache.get(memberID);
    if (!member) return res.status(404).json({ message: 'لا يوجد عضو' });
    res.send(unmute({ guild }, member));
});

module.exports = router;