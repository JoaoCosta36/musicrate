const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    ratings: [{ type: Number, min: 1, max: 10 }]
});

songSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
    return total / this.ratings.length;
};

module.exports = mongoose.model('Song', songSchema);
