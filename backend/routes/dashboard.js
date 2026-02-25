// Dashboard routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const Recommendation = require('../models/Recommendation');

// @route GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Last 10 assessments
    const assessments = await Assessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Total assessments
    const totalAssessments = await Assessment.countDocuments({ user: userId });

    // Latest assessment
    const latest = assessments[0] || null;

    // Average score of last 7
    const last7 = assessments.slice(0, 7);
    const avgScore = last7.length
      ? Math.round(last7.reduce((s, a) => s + a.score, 0) / last7.length)
      : 0;

    // Trend data for chart
    const trendData = assessments
      .slice(0, 7)
      .reverse()
      .map(a => ({
        date: a.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        score: a.score,
        mood: a.moodLevel,
        stress: a.stressLevel,
        anxiety: a.anxietyLevel,
        category: a.category,
      }));

    // Category distribution
    const categoryCount = {};
    assessments.forEach(a => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    });

    // Music stats
    const recommendations = await Recommendation.find({ user: userId }).populate('played.track', 'title genre');
    const totalPlayed = recommendations.reduce((s, r) => s + r.played.length, 0);

    res.json({
      totalAssessments,
      latestAssessment: latest,
      averageScore: avgScore,
      trendData,
      categoryDistribution: categoryCount,
      totalMusicPlayed: totalPlayed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;