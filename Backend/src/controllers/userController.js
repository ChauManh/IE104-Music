const axios = require('axios');
const Playlist = require('../models/playlist');
const mongoose = require('mongoose');

const UserController = {
    async createPlaylist(req, res) {
        try {
            const { name, userID } = req.body;
    
            if (!name || !userID) {
                return res.status(400).json({ message: 'Name and userID are required' });
            }
    
            const newPlaylist = new Playlist({
                _id: new mongoose.Types.ObjectId(),
                name,
                userID,
                songs: [],
            });
    
            await newPlaylist.save();
    
            res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    async addSongToPlaylist(req, res) {
        try {
            const { playlistID, songID } = req.body;
    
            if (!playlistID || !songID) {
                return res.status(400).json({ message: 'Playlist ID and Song ID are required.' });
            }
    
            const playlist = await Playlist.findById(playlistID);
            if (!playlist) {
                return res.status(404).json({ message: 'Playlist not found.' });
            }
    
            if (playlist.songs.includes(songID)) {
                return res.status(400).json({ message: 'Song already exists in the playlist.' });
            }
    
            playlist.songs.push(songID);
    
            await playlist.save();
    
            res.status(200).json({ message: 'Song added to playlist successfully.', playlist });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    },

    async getUserPlaylists(req, res) {
        try {
            const { userID } = req.params;
    
            if (!userID) {
                return res.status(400).json({ message: 'User ID is required.' });
            }
    
            // Lấy danh sách playlist của user
            const playlists = await Playlist.find({ userID });
    
            if (!playlists.length) {
                return res.status(404).json({ message: 'No playlists found for this user.' });
            }
    
            res.status(200).json({ message: 'User playlists fetched successfully.', playlists });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    }
}

module.exports = UserController;