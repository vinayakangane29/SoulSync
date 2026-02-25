// Music routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Music = require('../models/Music');
const Recommendation = require('../models/Recommendation');

// @route GET /api/music
router.get('/', auth, async (req, res) => {
  try {
    const { genre, mood } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (mood) filter.mood = mood;
    const music = await Music.find(filter);
    res.json(music);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/music/recommended
router.get('/recommended', auth, async (req, res) => {
  try {
    const latestRec = await Recommendation.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('music');
    if (!latestRec) return res.json([]);
    res.json(latestRec.music);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/music/played/:trackId
router.post('/played/:trackId', auth, async (req, res) => {
  try {
    const latestRec = await Recommendation.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (latestRec) {
      latestRec.played.push({ track: req.params.trackId });
      await latestRec.save();
    }
    res.json({ message: 'Tracked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;