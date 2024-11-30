const express = require('express');
const AlbumController = require('../controllers/AlbumController'); // Import controller
const router = express.Router();

router.get('/new', AlbumController.getNewReleases); 
router.get('/:id/tracks', AlbumController.getAlbumTracks);
router.get('/:id', AlbumController.getAlbum);

module.exports = router;
