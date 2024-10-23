const axios = require('axios');
const { getSpotifyToken } = require('../config/db/getTokenSpotify'); // Import hàm lấy token

class TrackController {
  // Lấy thông tin về track theo ID
  static async getTrack(req, res) {
    const trackId = req.params.id; // Lấy track ID từ URL
    try {
      const token = await getSpotifyToken(); // Lấy access token
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sử dụng token để xác thực
        },
      });
      res.json(response.data); // Trả về dữ liệu track
    } catch (error) {
      console.error('Error fetching track:', error);
      res.status(500).json({ error: 'Failed to fetch track' });
    }
  }
}

module.exports = TrackController;
