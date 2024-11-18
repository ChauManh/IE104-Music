// routes/webplaybacksdk.js
const express = require('express');
const router = express.Router();
const { getWebPlaybackSDKToken } = require('../config/spotify/getWebPlaybackSDKToken');
require('dotenv').config();
const token = process.env.WEBPLAYBACKSDK_TOKEN;
router.get('/gettoken', async (req, res) => {
  // try {
  //   const token = await getWebPlaybackSDKToken();
  //   res.json({ token });  // Trả về token dưới dạng JSON
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to fetch Web Playback SDK token' });
  // }
  try {
    res.json({ token });
  } catch (err) {

  }

});

module.exports = router;
