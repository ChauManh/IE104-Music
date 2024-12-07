const axios = require('axios');
const Playlist = require('../models/playlist');
const mongoose = require('mongoose');

const UserController = {
    async createPlaylist(req, res) {
        try {
            const userID = req.user.id;
            console.log(userID);
    
            if (!userID) {
                return res.status(400).json({ message: 'userID are required' });
            }

            const playlistCount = await Playlist.countDocuments({ userID });
    
            const name = `Danh sách phát #${playlistCount + 1}`;
            console.log(name);

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
    },

    async addFavoriteTrack(req, res) {
        try {
            const { trackId } = req.body;
            const userId = req.user.id;

            if (!trackId) {
                return res.status(400).json({ message: 'Track ID is required' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.likedSongs.includes(trackId)) {
                return res.status(400).json({ message: 'Track already in favorites' });
            }

            user.likedSongs.push(trackId);
            await user.save();

            res.status(200).json({ message: 'Track added to favorites' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding track to favorites', error: error.message });
        }
    },

    // Remove track from favorites
    async removeFavoriteTrack(req, res) {
        try {
            const { trackId } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.likedSongs = user.likedSongs.filter(id => id.toString() !== trackId);
            await user.save();

            res.status(200).json({ message: 'Track removed from favorites' });
        } catch (error) {
            res.status(500).json({ message: 'Error removing track from favorites', error: error.message });
        }
    },

    // Follow artist
    async followArtist(req, res) {
        try {
            const { artistId } = req.body;
            const userId = req.user.id;

            if (!artistId) {
                return res.status(400).json({ message: 'Artist ID is required' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.followingArtist.includes(artistId)) {
                return res.status(400).json({ message: 'Already following this artist' });
            }

            user.followingArtist.push(artistId);
            await user.save();

            res.status(200).json({ message: 'Artist followed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error following artist', error: error.message });
        }
    },

    // Unfollow artist
    async unfollowArtist(req, res) {
        try {
            const { artistId } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.followingArtist = user.followingArtist.filter(id => id.toString() !== artistId);
            await user.save();

            res.status(200).json({ message: 'Artist unfollowed successfully' });
        } catch (error) {2
            res.status(500).json({ message: 'Error unfollowing artist', error: error.message });
        }
    },

    // add Like Albums
    async addFavoriteAlbum(req, res) {
        try {
            const { albumId } = req.body;
            const userId = req.user.id;

            if (!albumId) {
                return res.status(400).json({ message: 'Album ID is required' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.likedAlbums.includes(albumId)) {
                return res.status(400).json({ message: 'Album already in favorites' });
            }

            user.likedAlbums.push(albumId);
            await user.save();

            res.status(200).json({ message: 'Album added to favorites' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding album to favorites', error: error.message });
        }
    },

    async removeFavoriteAlbum(req, res) {
        try {
            const { albumId } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.likedAlbums = user.likedAlbums.filter(id => id.toString() !== albumId);
            await user.save();

            res.status(200).json({ message: 'Album removed from favorites' });
        } catch (error) {
            res.status(500).json({ message: 'Error removing album from favorites', error: error.message });
        }
    }
}
module.exports = UserController;