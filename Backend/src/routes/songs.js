const express = require('express');
const router = express.Router();
const SongController = require('../controllers/SongController');
const auth = require('../middleware/auth');

router.post('/create', auth, SongController.createSong);
router.get('/:id', auth, SongController.getSong);
router.get('/by-spotify-id/:spotifyId', auth, SongController.getSongBySpotifyId); // Add this route
router.get('/playlist/:playlistId', auth, SongController.getPlaylistSongs);
router.delete('/:id', auth, SongController.deleteSong);

module.exports = router;