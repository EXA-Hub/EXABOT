const express = require('express');
const url = require('url');
const axios = require('axios');
const app = express();
const config = require('./data/config');
const port = config.dashboard.port;
const DISCORD_OAUTH_CLIENT_ID = config.dashboard.DISCORD_OAUTH_CLIENT_ID || config.bot.client.id;
const DISCORD_OAUTH_SECRET = config.dashboard.DISCORD_OAUTH_SECRET || config.bot.client.secret;
const DISCORD_REDIRECT_URL = config.dashboard.url.redirect_url;
app.listen(port, () => console.log(`listening to http://localhost:${port}`));

app.use('/ping', (req, res) => {
    res.send(new Date());
});

app.get('/api/auth/discord', async(req, res) => {
    const { code } = req.query;
    if (!code) return res.send('code is required');
    const formData = new url.URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENT_ID,
        client_secret: DISCORD_OAUTH_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: DISCORD_REDIRECT_URL,
    });
    const response = await axios.post(
        'https://discord.com/api/v8/oauth2/token',
        formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    res.json(response.data);
});

app.get('/api/auth/revoke', async(req, res) => {
    const { access_token } = req.query;
    if (!access_token) return res.send('access_token is required');
    const formData = new url.URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENT_ID,
        client_secret: DISCORD_OAUTH_SECRET,
        token: access_token,
    });
    const response = await axios.post(
        'https://discord.com/api/v8/oauth2/token/revoke',
        formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    res.json(response.data);
});

app.get('/api/auth/refresh', async(req, res) => {
    const { refresh_token } = req.query;
    if (!refresh_token) return res.send('refresh_token is required');
    if (refresh_token) {
        const formData = new url.URLSearchParams({
            client_id: DISCORD_OAUTH_CLIENT_ID,
            client_secret: DISCORD_OAUTH_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        });
        const response = await axios.post(
            'https://discord.com/api/v8/oauth2/token',
            formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        res.json(response.data);
    }
});



app.get('/api/auth/user', async(req, res) => {
    const { access_token } = req.query;
    if (!access_token) return res.send('access_token is required');
    if (access_token) {
        const response = await axios.get('https://discord.com/api/v8/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token.toString()}`,
            },
        });
        res.json(response.data);
    }
});