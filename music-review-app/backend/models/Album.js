const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Album', albumSchema);
