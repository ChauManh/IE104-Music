const express = require('express');
const AlbumController = require('../controllers/AlbumController');
const router = express.Router();

router.get('/:id', AlbumController.getAlbum);
router.get('/:id/tracks', AlbumController.getAlbumTracks);

module.exports = router;