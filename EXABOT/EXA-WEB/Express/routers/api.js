const { Router } = require('express');
const router = Router();

router.use((req, res, next) => {
    req.user = req.session.user;
    if (!req.user) return res.redirect('/api/auth/discord');
    next();
});

router.all('/', async(req, res) => {
    res.send(req.user);
});

const guildsAPI = require('./apis/guilds');
router.use('/guilds', guildsAPI);

module.exports = router;