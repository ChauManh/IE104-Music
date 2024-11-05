const axios = require('axios');
const { getSpotifyToken } = require('../config/db/getTokenSpotify'); // Import getSpotifyToken

const NewReleasesController = {
  // Method để fetch new releases
  async getNewReleases(req, res) {
    try {
      const token = await getSpotifyToken();
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.json(response.data.albums.items);
    } catch (error) {
      console.error('Error fetching new releases:', error);
      res.status(500).json({ error: 'Failed to fetch new releases' });
    }
  }
};

module.exports = NewReleasesController;
