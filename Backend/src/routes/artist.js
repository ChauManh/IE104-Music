const express = require('express');
const ArtistController = require('../controllers/ArtistController');
const router = express.Router();

router.get('/:id', ArtistController.getArtist);
router.get('/:id/albums', ArtistController.getArtistAlbums);
router.get('/:id/top-tracks', ArtistController.getArtistTopTracks);
router.get('/:id/related-artists', ArtistController.getRelatedArtists);

module.exports = router;