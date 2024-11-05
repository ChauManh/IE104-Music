const express = require('express');
const NewReleasesController = require('../../controllers/NewReleasesController'); // Import controller
const router = express.Router();

// Route: Fetch danh sách New Releases từ Spotify API
router.get('/', NewReleasesController.getNewReleases); // Sử dụng method getNewReleases từ controller

module.exports = router;
