const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    duration: Number,
    artistID: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    albumID: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    genre: String,
    audiofile: String,
    releaseDate: Date
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;