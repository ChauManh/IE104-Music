const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify');
require('dotenv').config();
const { refreshAccessToken } = require('../services/webPlayBackSDK')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

global.access_token = '';
global.refresh_token = '';
global.expires_in = '';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error('Missing Spotify API credentials');
    process.exit(1);
}

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const AuthController = {
    async getLogin(req, res) {
        const scope = "streaming user-read-email user-read-private";
        const state = generateRandomString(16); // Tạo state ngẫu nhiên
        const auth_query_parameters = new URLSearchParams({
            response_type: "code",
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        });

        // Redirect tới Spotify với state
        res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`);
    },

    async getCallback(req, res) {
        const code = req.query.code; // Lấy mã xác thực từ query
        const state = req.query.state; // Lấy state từ query

        if (!code) {
            return res.status(400).json({ error: "Authorization code not found" });
        }

        try {
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code'
                }),
                {
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = response.data;
            global.access_token = access_token;
            global.refresh_token = refresh_token;
            global.expires_in = expires_in;
            res.redirect('http://localhost:5173');
        } catch (error) {
            console.error('Error fetching tokens:', error);
            res.status(500).json({ error: "Failed to fetch tokens" });
        }
    },

    async getToken(req, res) {
        res.json({ access_token: access_token, refresh_token: refresh_token, expires_in: expires_in});
    },

    async getRefreshToken(req, res) {
        const refresh_token = req.query.refresh_token; // Lấy refresh_token từ query parameter
        if (!refresh_token) {
            return res.status(400).json({ error: "Missing refresh token" });
        }

        try {
            // Sử dụng hàm refreshAccessToken để lấy access_token mới
            const data = await refreshAccessToken(refresh_token);

            const { access_token, expires_in } = data;
            
            // Trả về access_token mới
            res.json({ 
                access_token, 
                expires_in 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = AuthController;
