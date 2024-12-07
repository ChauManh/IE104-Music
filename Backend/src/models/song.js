const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    duration: Number,
    artistID: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    albumID: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    genre: String,
    audiofile: String,
    releaseDate: Date,
    spotifyId: String, // Add this field for Spotify track IDs
    name: String,      // Add this for track name
    image: String      // Add this for track image
});

// Make sure to register the model before using it
const Song = mongoose.model('Song', songSchema, 'songs'); // Added collection name explicitly

module.exports = Song;