const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');

router.get('/create_playlist', UserController.createPlaylist);
router.get('/get_playlist/:id', UserController.getUserPlaylists);


module.exports = router;
