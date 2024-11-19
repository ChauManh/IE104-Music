const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    followingArtist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    listeningHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const User = mongoose.model('user', userSchema);

module.exports = User;