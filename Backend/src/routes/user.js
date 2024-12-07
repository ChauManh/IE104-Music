const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');

// Playlistr routes
router.post('/create_playlist', auth, UserController.createPlaylist);
router.get('/get_playlists', UserController.getUserPlaylists);
router.get('/playlist/:id', auth, UserController.getPlaylistById);
router.post('/playlist/add_song', UserController.addSongToPlaylist);
router.delete('/playlist/remove_song', UserController.removeSongFromPlaylist);
router.delete('/delete_playlist/:id', UserController.deletePlaylist);

// Favorite tracks routes
router.post('/favorites/add',UserController.addFavoriteTrack);
router.delete('/favorites/remove', UserController.removeFavoriteTrack);

// Artist following routes
router.post('/artists/follow', UserController.followArtist);
router.delete('/artists/unfollow', UserController.unfollowArtist);

// Album following routes
router.post('/albums/add', UserController.addFavoriteAlbum);
router.delete('/albums/remove', UserController.removeFavoriteAlbum);
module.exports = router;
