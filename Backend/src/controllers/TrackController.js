const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify'); // Import hàm lấy token
const { getNewReleases }= require('./AlbumController')

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
      const response1 = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                limit: 10,
              },
            });
            const newAlbumIds = response1.data.albums.items.map(item => ({id: item.id,}));
            const randomAlbumIds = newAlbumIds.sort(() => Math.random() - 0.5).slice(0, 5);
            const randomTrackIds = [];
            await Promise.all(
              randomAlbumIds.map(async (album) => {
                const response2 = await axios.get(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const tracks = response2.data.items;
                const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
                randomTrackIds.push(randomTrack.id); // Lưu ID bài hát
              })
            );
            const trackIdsString = randomTrackIds.join(','); // Tạo chuỗi ID
            const response3 = await axios.get(`https://api.spotify.com/v1/tracks?ids=${trackIdsString}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const popularTracks = response3.data.tracks.map(track => ({
              name: track.name,
              id: track.id,
              image: track.album.images[0]?.url,
              singer: track.artists[0].name,
              uri: track.uri,
              duration: track.duration_ms,
            }));
            res.status(200).json(popularTracks);
    }
    catch(e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = TrackController;
