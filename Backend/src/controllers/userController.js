const axios = require('axios');
const Playlist = require('../models/playlist');
const mongoose = require('mongoose');

const UserController = {
    async createPlaylist(req, res) {
        try {
            const name = "Danh sách phát #";
            const userID = req.user.id;
            console.log(name);
            console.log(userID);
    
            if (!name || !userID) {
                return res.status(400).json({ message: 'Name and userID are required' });
            }
    
            const existingPlaylist = await Playlist.findOne({ name, userID });
            if (existingPlaylist) {
                return res.status(400).json({
                    message: `Playlist with name '${name}' already exists for this user.`,
                });
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

    async removeSongFromPlaylist(req, res) {
        try {
            const { playlistID, songID } = req.body;
    
            if (!playlistID || !songID) {
                return res.status(400).json({ message: 'Playlist ID and Song ID are required.' });
            }
    
            const playlist = await Playlist.findById(playlistID);
            if (!playlist) {
                return res.status(404).json({ message: 'Playlist not found.' });
            }
    
            if (!playlist.songs.includes(songID)) {
                return res.status(400).json({ message: 'Song does not exist in the playlist.' });
            }
    
            playlist.songs = playlist.songs.filter(song => song.toString() !== songID);
    
            await playlist.save();
    
            res.status(200).json({ 
                message: 'Song removed from playlist successfully.', 
                playlist 
            });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    },

    async deletePlaylist(req, res) {
        try {
            const playlistID = req.params.id; 
    
            if (!playlistID) {
                return res.status(400).json({ message: 'Playlist ID is required.' });
            }
    
            const playlist = await Playlist.findByIdAndDelete(playlistID);
    
            if (!playlist) {
                return res.status(404).json({ message: 'Playlist not found.' });
            }
    
            res.status(200).json({ message: 'Playlist deleted successfully.' });
        } catch (e) {
            res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    },

    async getUserPlaylists(req, res) {
        const userID  = req.user.id;
        try {
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