// /routes/song.js
const express = require('express');
const Artist = require('../models/Artist');
const Song = require('../models/Song');
const router = express.Router();

// Buscar todas as músicas de um artista específico
router.get('/artist/:artistId', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.artistId).populate('albums.songs');
    if (!artist) return res.status(404).send('Artista não encontrado');
    
    const songs = artist.albums.reduce((acc, album) => {
      acc.push(...album.songs);
      return acc;
    }, []);
    
    res.json(songs);
  } catch (error) {
    res.status(500).send('Erro ao buscar músicas do artista');
  }
});

// Buscar uma música específica por seu ID
router.get('/:songId', async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId).populate('artist');
    if (!song) return res.status(404).send('Música não encontrada');
    res.json(song);
  } catch (error) {
    res.status(500).send('Erro ao buscar música');
  }
});

// Classificar uma música (Nota de 1 a 10)
router.post('/:songId/rate', async (req, res) => {
  const { rating } = req.body;
  try {
    if (rating < 1 || rating > 10) return res.status(400).send('A nota deve ser entre 1 e 10');
    
    const song = await Song.findById(req.params.songId);
    if (!song) return res.status(404).send('Música não encontrada');
    
    song.rating = rating;
    await song.save();
    
    res.status(200).json(song);
  } catch (error) {
    res.status(500).send('Erro ao classificar música');
  }
});

// Adicionar uma nova música a um artista
router.post('/add', async (req, res) => {
  const { artistId, songName, albumTitle } = req.body;
  try {
    // Verifica se o artista existe
    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).send('Artista não encontrado');
    
    // Cria a nova música
    const newSong = new Song({
      name: songName,
      artist: artistId,
    });
    
    await newSong.save();
    
    // Adiciona a música ao álbum do artista
    const album = artist.albums.find(album => album.title === albumTitle);
    if (!album) {
      // Se o álbum não existir, cria um novo álbum
      const newAlbum = { title: albumTitle, year: new Date().getFullYear(), songs: [newSong] };
      artist.albums.push(newAlbum);
    } else {
      album.songs.push(newSong);
    }
    
    await artist.save();
    
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).send('Erro ao adicionar a música');
  }
});

module.exports = router;
