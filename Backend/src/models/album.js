const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    artistID: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    releaseDate: Date,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    coverImage: String
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;