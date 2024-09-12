const { Dropbox } = require('dropbox');
const axios = require('axios');
require('dotenv').config();
const refreshAccessToken = require('./refreshDropboxToken');

async function setupDropboxClient() {
    const fetch = (await import('node-fetch')).default;

    let accessToken = process.env.DROPBOX_ACCESS_TOKEN;

    // Ensure access token is refreshed if necessary (or simply for safety)
    if (!accessToken) {
        accessToken = await refreshAccessToken(); // Fetch new token if current one is missing/expired
    }

    const dbx = new Dropbox({
        accessToken: accessToken,
        fetch
    });

    return dbx;
}

module.exports = setupDropboxClient;
