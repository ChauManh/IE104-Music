const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserController = require('../controllers/userController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/playlist-thumbnails';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Playlist routes
router.get('/get_playlists', auth, UserController.getUserPlaylists);
router.get('/playlist/:id', auth, UserController.getPlaylistById);
router.post('/create_playlist', auth, UserController.createPlaylist); // Ensure this route is correct
router.post('/playlist/add_song', auth, UserController.addSongToPlaylist);
router.delete('/playlist/:playlistId/songs/:songId', auth, UserController.removeSongFromPlaylist);
router.delete('/playlist/:id', auth, UserController.deletePlaylist);

// Playlist thumbnail
router.put('/playlist/:id/thumbnail', auth, upload.single('thumbnail'), UserController.updatePlaylistThumbnail);

// Playlist update
router.put('/playlist/:id', auth, UserController.updatePlaylist);

// Artist following
router.post('/artists/follow', auth, UserController.followArtist);
router.delete('/artists/unfollow', auth, UserController.unfollowArtist);

// Album following
router.post('/albums/add', auth, UserController.addFavoriteAlbum);
router.delete('/albums/remove', auth, UserController.removeFavoriteAlbum);

// User profile routes
router.put('/change-password', auth, UserController.changePassword);
router.put('/update_profile', auth, UserController.updateProfile);
router.put('/update_avatar', auth, upload.single('avatar'), UserController.updateAvatar);

// Recent tracks
router.get('/recent_tracks', auth, UserController.getRecentTracks);

module.exports = router;
