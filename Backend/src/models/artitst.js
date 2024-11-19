const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    bio: String,
    genre: String,
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    createdAt: { type: Date, default: Date.now }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;