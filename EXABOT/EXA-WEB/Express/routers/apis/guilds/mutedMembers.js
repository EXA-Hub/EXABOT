const { Router } = require('express');
const db = require('../../../../../functions/database');

const router = Router();

router.all('/:guildID/mutedMembers', async(req, res) => {
    const mutedPeople = await db.get("muted");
    if (!mutedPeople) return res.status(404).json({ message: 'لم يتم العثور على أعضاء في قاعدة البيانات' });
    const mutedMembers = mutedPeople[guildID];
    if (!mutedMembers) return res.json({ message: 'لا يوجد محظورين في المجتمع' });
    res.json(mutedMembers);
});

module.exports = router;