// /models/artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  albums: [
    {
      title: String,
      year: Number,
      songs: [
        {
          name: String,
          rating: {
            type: Number,
            min: 1,
            max: 10,
            default: 0,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Artist', artistSchema);
