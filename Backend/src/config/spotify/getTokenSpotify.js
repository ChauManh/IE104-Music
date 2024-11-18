const axios = require('axios');
require('dotenv').config(); // Đọc biến từ file .env

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let token = null; // Biến để lưu trữ token
let tokenExpiresAt = null; // Biến để lưu thời gian hết hạn

const getSpotifyToken = async () => {
  // Kiểm tra xem token đã được lưu trữ và còn hợp lệ không
  if (token && tokenExpiresAt > Date.now()) {
    console.log('Using cached Spotify access token:', token);
    return token; // Sử dụng token đã lưu
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    // Lưu token và thời gian hết hạn
    token = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in * 1000); // Thời gian hết hạn là seconds

    console.log('Successfully fetched Spotify access token:', response.data);
    return token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    throw error;
  }
};

module.exports = { getSpotifyToken };
