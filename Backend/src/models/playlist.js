const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    type: { 
        type: String, 
        enum: ['playlist', 'artist', 'album', 'playlistLikeSongs'],
        default: 'playlist' 
    },
    artistId: String,
    albumId: String,
    thumbnail: { 
        type: String,
        default: null
    },
    createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model('Playlist', playlistSchema, 'playlists');

module.exports = Playlist;