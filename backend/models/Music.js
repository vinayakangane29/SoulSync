// Music schema
const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: {
    type: String,
    enum: ['meditation', 'classical', 'ambient', 'uplifting', 'nature', 'jazz', 'acoustic', 'lofi'],
    required: true,
  },
  mood: {
    type: [String],
    enum: ['calming', 'energizing', 'uplifting', 'relaxing', 'focusing', 'healing'],
  },
  suitableFor: {
    type: [String],
    enum: ['minimal', 'low_stress', 'moderate_stress', 'high_stress', 'severe'],
  },
  duration: { type: String }, // e.g. "3:45"
  youtubeId: { type: String }, // YouTube video ID for embedding
  thumbnailUrl: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Music', musicSchema);