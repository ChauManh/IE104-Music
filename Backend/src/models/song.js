const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    duration: Number,
    artistName: String,
    album: String,
    image: String,
    spotifyId: String,
    createdAt: { type: Date, default: Date.now }
});

// Make sure to register the model before using it
const Song = mongoose.model('Song', songSchema, 'songs'); // Added collection name explicitly

module.exports = Song;