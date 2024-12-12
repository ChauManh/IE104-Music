const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify'); // Import hàm lấy token

const AlbumController = {
  // Method để fetch new releases
  async getNewReleases(req, res) {
    try {
      const token = await getSpotifyToken();
  
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 20,
        },
      });
  
      const allAlbums = response.data.albums.items.map(item => ({
        name: item.name,
        id: item.id,
        image: item.images[0].url,
        singer: item.artists.map(artist => artist.name),
        date: item.release_date,
      }));
  
      const randomAlbums = allAlbums.sort(() => Math.random() - 0.5).slice(0, 10);
  
      res.status(200).json(randomAlbums);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch new releases' });
    }
  },

  async getAlbumTracks(req, res) {
    const albumsId = req.params.id;
    try {
      const token = await getSpotifyToken();
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumsId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const albumTracks = response.data.items.map(item => ({
        name: item.name,
        id: item.id,
        // image: item.images[0].url, // Uncomment if needed
        singers: item.artists.map(artist => artist.name), // Lấy tất cả tên nghệ sĩ
        duration: item.duration_ms,
        uri: item.uri,
    }));  
    res.status(200).json(albumTracks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch new releases' });
    }
  },

  async getAlbum(req, res) {
    try {
      const albumId = req.params.id;
      console.log("Fetching album with ID:", albumId); // Debug log
      
      const token = await getSpotifyToken();
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Album fetch error:", error); // Better error logging
      res.status(500).json({ 
        error: 'Failed to fetch album data',
        details: error.message 
      });
    }
  }
};

module.exports = AlbumController;
