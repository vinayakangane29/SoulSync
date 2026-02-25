// Recommendation schema
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  music: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music',
  }],
  played: [{
    track: { type: mongoose.Schema.Types.ObjectId, ref: 'Music' },
    playedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);