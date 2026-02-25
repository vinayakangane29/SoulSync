// Assessment routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const Music = require('../models/Music');
const Recommendation = require('../models/Recommendation');

// PHQ-9 style questions (adapted)
const QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself – or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking slowly (or being fidgety/restless)",
  "Thoughts of being better off dead or hurting yourself in some way",
];

const FEEDBACK = {
  minimal: "You're doing well! Your mental health appears to be in a good place. Keep maintaining healthy habits and self-care practices.",
  low_stress: "You're experiencing some mild stress or discomfort. This is common and manageable. Try relaxation techniques and stay connected with loved ones.",
  moderate_stress: "You're showing signs of moderate stress. Consider speaking with a counselor or therapist. Regular self-care and music therapy can help.",
  high_stress: "You're experiencing significant stress or depression. We strongly recommend talking to a mental health professional. Music therapy is a great supportive tool.",
  severe: "You're showing signs of severe distress. Please reach out to a mental health professional or crisis helpline immediately. You are not alone.",
};

// @route GET /api/assessment/questions
router.get('/questions', (req, res) => {
  res.json(QUESTIONS.map((q, i) => ({ id: i, question: q })));
});

// @route POST /api/assessment/submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { responses } = req.body; // [{question, answer}]

    if (!responses || responses.length !== QUESTIONS.length) {
      return res.status(400).json({ message: 'Please answer all questions' });
    }

    const score = responses.reduce((sum, r) => sum + (r.answer || 0), 0);

    // Derive sub-metrics
    const stressLevel = Math.round((responses.slice(3, 6).reduce((s, r) => s + r.answer, 0) / 12) * 100);
    const anxietyLevel = Math.round((responses.slice(0, 3).reduce((s, r) => s + r.answer, 0) / 12) * 100);
    const moodLevel = Math.round(100 - (score / (QUESTIONS.length * 3)) * 100);

    // Determine category
    let category;
    if (score <= 4) category = 'minimal';
    else if (score <= 9) category = 'low_stress';
    else if (score <= 14) category = 'moderate_stress';
    else if (score <= 19) category = 'high_stress';
    else category = 'severe';

    const assessment = await Assessment.create({
      user: req.user.id,
      responses,
      score,
      category,
      stressLevel,
      anxietyLevel,
      moodLevel,
      feedback: FEEDBACK[category],
    });

    // Generate music recommendations
    const musicTracks = await Music.find({ suitableFor: category }).limit(6);
    
    await Recommendation.create({
      user: req.user.id,
      assessment: assessment._id,
      music: musicTracks.map(m => m._id),
    });

    res.status(201).json({
      assessment,
      recommendations: musicTracks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/assessment/history
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/assessment/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment || assessment.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    const recommendation = await Recommendation.findOne({ assessment: assessment._id })
      .populate('music');
    res.json({ assessment, recommendations: recommendation?.music || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;