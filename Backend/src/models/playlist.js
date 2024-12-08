const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    createdAt: { type: Date, default: Date.now },
    thumbnail: { 
        type: String,
        default: null  // Default value for when no thumbnail is set
    }
});

const Playlist = mongoose.model('Playlist', playlistSchema, 'playlists');

module.exports = Playlist;