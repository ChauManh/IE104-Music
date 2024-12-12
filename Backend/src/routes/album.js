const express = require('express');
const AlbumController = require('../controllers/AlbumController');
const router = express.Router();

router.get('/new', AlbumController.getNewReleases);
router.get('/:id', AlbumController.getAlbum);
router.get('/:id/tracks', AlbumController.getAlbumTracks);


module.exports = router;