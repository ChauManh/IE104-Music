const express = require('express');
const SpotifyAuthController = require('../controllers/SpotifyAuthController.js'); // Import controller
const router = express.Router();

router.get('/callback', SpotifyAuthController.getCallback); 

router.get('/login', SpotifyAuthController.getLogin); // Route: Chuyển hướng đến trang đăng nhập Spotify

router.get('/token', SpotifyAuthController.getToken); // Route

router.get('/refresh_token', SpotifyAuthController.getRefreshToken); // Route

module.exports = router;
