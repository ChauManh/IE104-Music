const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify');

const ArtistController = {
    async getArtist(req, res) {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch artist data' });
        }
    },

    async getArtistAlbums(req, res) {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}/albums`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { limit: 20 }
            });
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch artist albums' });
        }
    },

    async getArtistTopTracks(req, res) {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}/top-tracks`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { market: 'US' }
            });
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch artist top tracks' });
        }
    },

    async getRelatedArtists(req, res) {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}/related-artists`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch related artists' });
        }
    }
};

module.exports = ArtistController;