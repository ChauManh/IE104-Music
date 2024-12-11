const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify'); // Import the function to get Spotify token

const SearchController = {
    async search(req, res) {
        const query = req.query.q;
        const type = req.query.type || 'track,artist,album';

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        try {
            const token = await getSpotifyToken();
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    q: query,
                    type: type,
                    limit: 20
                },
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ error: 'Failed to fetch search results' });
        }
    }
};

module.exports = SearchController;