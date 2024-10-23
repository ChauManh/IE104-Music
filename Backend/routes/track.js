const express = require('express');
const TrackController = require('../controllers/TrackController.js'); // Import TrackController
const router = express.Router();

// Route: Fetch thông tin về track từ Spotify API
router.get('/:id', TrackController.getTrack); // Sử dụng method getTrack từ TrackController

module.exports = router;
