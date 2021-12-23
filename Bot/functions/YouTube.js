function YTdata(cID, api_key, callback) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${cID}&key=${api_key}`;
    const request = require('request');
    request.get({
        url: url,
        json: true
    }, (err, res, data) => {
        if (err) return console.log('Error:', err);
        if (data.error) return;
        callback(data);
    });
}

module.exports = YTdata;