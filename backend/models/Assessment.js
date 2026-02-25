// Assessment schema
const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
  question: String,
  answer: Number, // 0-4 scale (Likert)
});

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responses: [questionResponseSchema],
  score: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['minimal', 'low_stress', 'moderate_stress', 'high_stress', 'severe'],
    required: true,
  },
  stressLevel: { type: Number, default: 0 },   // 0-100
  anxietyLevel: { type: Number, default: 0 },  // 0-100
  moodLevel: { type: Number, default: 0 },     // 0-100
  feedback: { type: String },
}, { timestamps: true });

// Auto-assign category based on score
assessmentSchema.pre('save', function (next) {
  const s = this.score;
  if (s <= 5) this.category = 'minimal';
  else if (s <= 10) this.category = 'low_stress';
  else if (s <= 18) this.category = 'moderate_stress';
  else if (s <= 27) this.category = 'high_stress';
  else this.category = 'severe';
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);