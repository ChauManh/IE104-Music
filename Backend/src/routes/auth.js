const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth'); // Middleware xác thực

router.post('/signup', AuthController.createUser);
router.post('/login', AuthController.handleLogin);
router.get('/user', auth, AuthController.getUser);  // Đảm bảo người dùng đã đăng nhập
router.get('/account', auth, AuthController.getAccount);  // Lấy thông tin tài khoản người dùng
router.post('/google', AuthController.handleGoogleAuth);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router; //export default
