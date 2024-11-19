const express = require('express');
const SearchController = require('../controllers/SearchController'); // Import the SearchController
const router = express.Router();

router.get('/', SearchController.search); // Define the search route

module.exports = router;