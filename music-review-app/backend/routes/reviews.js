const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

router.post('/', async (req, res) => {
    const review = new Review(req.body);
    await review.save();
    res.send('Review added');
});

router.get('/', async (req, res) => {
    const reviews = await Review.find();
    res.json(reviews);
});

module.exports = router;
