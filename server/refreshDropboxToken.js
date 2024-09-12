const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

async function refreshAccessToken() {
    try {
        const response = await axios.post('https://api.dropboxapi.com/oauth2/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.DROPBOX_REFRESH_TOKEN, // Use env variable
            client_id: process.env.DROPBOX_CLIENT_ID, // Store this in env
            client_secret: process.env.DROPBOX_CLIENT_SECRET // Store this in env
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const newAccessToken = response.data.access_token;
        console.log('New Access Token:', newAccessToken);

        // Update .env file dynamically (optional but recommended)
        const envFileContent = fs.readFileSync('.env', 'utf8');
        const updatedEnv = envFileContent.replace(/DROPBOX_ACCESS_TOKEN=.*/g, `DROPBOX_ACCESS_TOKEN=${newAccessToken}`);
        fs.writeFileSync('.env', updatedEnv);

        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = refreshAccessToken;
