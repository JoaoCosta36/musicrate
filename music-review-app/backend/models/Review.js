const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: String,
    artist: String,
    album: String,
    song: String,
    rating: Number,
    comment: String
});

module.exports = mongoose.model('Review', ReviewSchema);
