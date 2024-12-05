const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth'); // Middleware xác thực

router.post('/signup', AuthController.createUser);
router.post('/login', AuthController.handleLogin);
router.get('/user', auth, AuthController.getUser);  // Đảm bảo người dùng đã đăng nhập
router.get('/account', auth, AuthController.getAccount);  // Lấy thông tin tài khoản người dùng
router.post('/google', AuthController.handleGoogleAuth);

module.exports = router; //export default
