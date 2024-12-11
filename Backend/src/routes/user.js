const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');
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

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Playlist routes
router.post('/create_playlist', auth, UserController.createPlaylist);
router.get('/get_playlists', UserController.getUserPlaylists);
router.get('/playlist/:id', auth, UserController.getPlaylistById);
router.post('/playlist/add_song', UserController.addSongToPlaylist);
router.delete('/playlist/remove_song', UserController.removeSongFromPlaylist);
router.delete('/delete_playlist/:id', UserController.deletePlaylist);
router.post(
  '/playlist/update_thumbnail', 
  auth, 
  upload.single('thumbnail'), 
  UserController.updatePlaylistThumbnail
);
router.put('/playlist/:id', auth, UserController.updatePlaylist);

// Favorite tracks routes
router.post('/favorites/add', UserController.addFavoriteTrack);
router.delete('/favorites/remove', UserController.removeFavoriteTrack);

// Artist following routes
router.post('/artists/follow', UserController.followArtist);
router.delete('/artists/unfollow', UserController.unfollowArtist);

// Album following routes
router.post('/albums/add', UserController.addFavoriteAlbum);
router.delete('/albums/remove', UserController.removeFavoriteAlbum);

module.exports = router;
