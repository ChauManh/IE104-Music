const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify'); // Import hàm lấy token

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
      res.json({
        name: response.data.name,
        id: response.data.id,
        image: response.data.album.images[0].url,
        singer: response.data.artists[0].name,
        uri: response.data.uri,
        duration: response.data.duration_ms
      }); // Trả về dữ liệu track
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch track' });
    }
  }

  static async getPopularTracks(req, res) {
    try {
      const token = await getSpotifyToken(); 
      // console.log("Lấy token", token);
      // const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const playlistId = response.data.playlists.items[0].id;
      const responsePopularTracks = await axios.get(`https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 10,
        },     
      });
      const popularTracks = responsePopularTracks.data.items.map(item => ({
        name: item.track.name,
        id: item.track.id,
        image: item.track.album.images[0].url,
        singer: item.track.artists[0].name,
        uri: item.track.uri,
        duration: item.track.duration_ms
    }));
      res.status(200).json(popularTracks);
    }
    catch(e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = TrackController;
