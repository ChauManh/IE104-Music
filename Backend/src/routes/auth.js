const express = require('express');
const AuthController = require('../controllers/AuthController.js'); // Import controller
const router = express.Router();

router.get('/callback', AuthController.getCallback); 

router.get('/login', AuthController.getLogin); // Route: Chuyển hướng đến trang đăng nhập Spotify

router.get('/token', AuthController.getToken); // Route

router.get('/refresh_token', AuthController.getRefreshToken); // Route

module.exports = router;
