const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify'); // Import the function to get Spotify token

const SearchController = {
    async search(req, res) {
        const query = req.query.q; // Get the search query from the request
        const type = req.query.type || 'track'; // Get the type of search (track, album, artist, playlist)

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        try {
            const token = await getSpotifyToken(); // Get the Spotify access token
            console.log("đây là token", token);
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    q: query,
                    type: type,
                    limit: 10, // Limit the number of results
                },
            });

            res.status(200).json(response.data); // Return the search results
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch search results' });
        }
    },
};

module.exports = SearchController;