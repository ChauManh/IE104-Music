const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');

router.get('/create_playlist', UserController.createPlaylist);
router.get('/get_playlists', UserController.getUserPlaylists);
router.post('/playlist/add_song', UserController.addSongToPlaylist);
router.delete('/playlist/remove_song', UserController.removeSongFromPlaylist);
router.delete('/delete_playlist/:id', UserController.deletePlaylist);

module.exports = router;
