const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify'); // Import hàm lấy token
const Playlist = require('../models/playlist');
const mongoose = require('mongoose');

const PlayListController = {
    async getPlaylistByID(req, res) {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${req.params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            res.json(response.data);
        } catch(e) {
            res.status(500).json({ error: 'Failed to fetch playlist' });
        }
    },

    async getPlaylistToShow(req, res) {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    limit: 5,
                }
            });
            res.json(response.data);
        } catch(e) {
            res.status(500).json({ error: 'Failed to fetch popular playlist' });
        }
    },
    
}

module.exports = PlayListController;