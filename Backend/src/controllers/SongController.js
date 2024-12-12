const mongoose = require('mongoose');
const Song = require('../models/song');
const axios = require('axios');
const { getSpotifyToken } = require('../config/spotify/getTokenSpotify');

const SongController = {
  // Create song
  async createSong(req, res) {
    try {
      const { spotifyId } = req.body;

      // Check if song already exists
      let song = await Song.findOne({ spotifyId });
      if (song) {
        return res.status(200).json({ 
          message: 'Song already exists',
          song 
        });
      }

      // Get track details from Spotify
      const token = await getSpotifyToken();
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Create new song with album name
      song = new Song({
        _id: new mongoose.Types.ObjectId(),
        title: response.data.name,
        duration: response.data.duration_ms,
        artistName: response.data.artists[0].name,
        album: response.data.album.name, // Make sure to save album name
        image: response.data.album.images[0].url,
        spotifyId: response.data.id,
        createdAt: new Date(),
      });

      await song.save();

      res.status(201).json({
        message: 'Song created successfully',
        song
      });

    } catch (error) {
      console.error('Error in createSong:', error);
      res.status(500).json({
        message: 'Error creating song',
        error: error.message
      });
    }
  },

  // Get single song by ID
  async getSong(req, res) {
    try {
      const songId = req.params.id;
      const song = await Song.findOne({ _id: songId });

      if (!song) {
        return res.status(404).json({ 
          message: 'Song not found' 
        });
      }

      res.status(200).json(song);
    } catch (error) {
      console.error('Error in getSong:', error);
      res.status(500).json({
        message: 'Error fetching song',
        error: error.message
      });
    }
  },

  // Get all songs from a playlist
  async getPlaylistSongs(req, res) {
    try {
      const { playlistId } = req.params;
      const songs = await Song.find({
        _id: { $in: req.playlist.songs }
      });

      res.status(200).json({
        message: 'Songs fetched successfully',
        songs
      });
    } catch (error) {
      console.error('Error in getPlaylistSongs:', error);
      res.status(500).json({
        message: 'Error fetching playlist songs',
        error: error.message
      });
    }
  },

  // Delete song
  async deleteSong(req, res) {
    try {
      const songId = req.params.id;
      const song = await Song.findByIdAndDelete(songId);

      if (!song) {
        return res.status(404).json({
          message: 'Song not found'
        });
      }

      res.status(200).json({
        message: 'Song deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteSong:', error);
      res.status(500).json({
        message: 'Error deleting song',
        error: error.message
      });
    }
  }
};

module.exports = SongController;