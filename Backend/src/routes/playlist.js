const express = require('express');
const PlaylistController = require('../controllers/PlaylistController');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/popular', PlaylistController.getPlaylistToShow)
router.get('/:id', PlaylistController.getPlaylistByID);

module.exports = router;
