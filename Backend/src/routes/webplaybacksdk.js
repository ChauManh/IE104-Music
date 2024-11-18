// routes/webplaybacksdk.js
const express = require('express');
const router = express.Router();
const { getWebPlaybackSDKToken } = require('../config/spotify/getWebPlaybackSDKToken');
router.get('/gettoken', async (req, res) => {
  try {
    const token = await getWebPlaybackSDKToken();
    res.json({ token });  // Trả về token dưới dạng JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Web Playback SDK token' });
  }
});

module.exports = router;
