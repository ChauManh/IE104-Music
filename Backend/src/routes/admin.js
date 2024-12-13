const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// First use auth middleware to set req.user
router.use(auth);
// Then use adminAuth to check admin role
router.use(adminAuth);

router.post('/users', AdminController.createUser);
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/stats', AdminController.getStats);
router.get('/playlists', AdminController.getAllPlaylists);
router.delete('/playlists/:id', AdminController.deletePlaylist);

module.exports = router;