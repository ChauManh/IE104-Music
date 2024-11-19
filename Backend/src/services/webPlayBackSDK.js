const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function refreshAccessToken(refresh_token) {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token');
    }
}

module.exports = { refreshAccessToken }