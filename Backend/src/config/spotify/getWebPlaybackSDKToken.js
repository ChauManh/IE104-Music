const axios = require('axios');
require('dotenv').config(); // Đọc biến từ file .env

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; 
let REFRESH_TOKEN = process.env.REFRESH_TOKEN; // Refresh token sẽ được lấy qua bước authorization code flow

let token = null;
let tokenExpiresAt = null;

const getWebPlaybackSDKToken = async () => {
  if (token && tokenExpiresAt > Date.now()) {
    console.log('Using cached Web Playback SDK access token:', token);
    return token; 
  }

  if (!REFRESH_TOKEN) {
    throw new Error('No refresh token available. Please complete the OAuth flow to get the refresh token.');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', REFRESH_TOKEN);
  
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    // Lưu token và thời gian hết hạn
    const { access_token, refresh_token, expires_in } = response.data;
    
    // Lưu refresh token mới (nếu có) và access token
    if (refresh_token) {
      REFRESH_TOKEN = refresh_token; // Cập nhật refresh token mới nếu có
    }

    token = access_token;
    tokenExpiresAt = Date.now() + (expires_in * 1000); // Thời gian hết hạn tính bằng milliseconds

    console.log('Successfully fetched Web Playback SDK access token:', token);
    return token;
  } catch (error) {
    console.error('Error fetching Web Playback SDK access token:', error);
    throw error;
  }
};

// Đoạn này sử dụng OAuth 2.0 để lấy refresh token nếu chưa có
const getRefreshToken = async (authorizationCode) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', authorizationCode);  // Authorization code nhận được sau khi người dùng cấp quyền
  params.append('redirect_uri', REDIRECT_URI);
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params);
    const { access_token, refresh_token, expires_in } = response.data;
    
    // Lưu refresh token và access token
    REFRESH_TOKEN = refresh_token; // Lưu refresh token để sử dụng sau
    token = access_token;
    tokenExpiresAt = Date.now() + (expires_in * 1000); // Thời gian hết hạn tính bằng milliseconds

    console.log('Successfully received refresh token and access token:', token);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    throw error;
  }
};

module.exports = { getWebPlaybackSDKToken, getRefreshToken };
