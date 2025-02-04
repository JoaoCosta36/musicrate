// /routes/artist.js
const express = require('express');
const Artist = require('../models/Artist');
const router = express.Router();

// Buscar artistas
router.get('/:name', async (req, res) => {
  try {
    const artist = await Artist.findOne({ name: req.params.name }).populate({
      path: 'albums.songs',
    });
    if (!artist) return res.status(404).send('Artista não encontrado');
    res.json(artist);
  } catch (error) {
    res.status(500).send('Erro ao buscar artista');
  }
});

// Classificar música
router.post('/:artistId/rate-song/:songId', async (req, res) => {
  const { rating } = req.body;
  try {
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).send('Artista não encontrado');
    
    const album = artist.albums.find((album) =>
      album.songs.some((song) => song._id.toString() === req.params.songId)
    );

    const song = album.songs.find((song) => song._id.toString() === req.params.songId);
    song.rating = rating;
    await artist.save();
    
    res.status(200).json(song);
  } catch (error) {
    res.status(500).send('Erro ao classificar música');
  }
});

module.exports = router;
