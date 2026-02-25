// Assessment page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself – or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite – being so fidgety or restless",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half' },
  { value: 3, label: 'Nearly every day' },
];

const CATEGORY_INFO = {
  minimal: { label: 'Minimal / No Distress', color: 'var(--green)', emoji: '😊' },
  low_stress: { label: 'Mild Stress', color: 'var(--accent2)', emoji: '😐' },
  moderate_stress: { label: 'Moderate Stress', color: 'var(--accent)', emoji: '😟' },
  high_stress: { label: 'High Stress / Depression', color: 'var(--red)', emoji: '😔' },
  severe: { label: 'Severe Distress', color: '#ff6060', emoji: '🆘' },
};

export default function Assessment() {
  const [step, setStep] = useState('intro'); // intro | quiz | result
  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState(Array(QUESTIONS.length).fill(null));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const handleAnswer = (value) => {
    const newResponses = [...responses];
    newResponses[currentQ] = value;
    setResponses(newResponses);
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    setError('');
    try {
      const formattedResponses = responses.map((answer, i) => ({
        question: QUESTIONS[i],
        answer: answer ?? 0,
      }));
      const { data } = await axios.post('/api/assessment/submit', { responses: formattedResponses });
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📋</div>
          <h1 className="section-title" style={{ marginBottom: '16px' }}>Mental Health Self-Assessment</h1>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: '32px', fontSize: '15px' }}>
            This is a PHQ-9 based questionnaire designed to help you understand your current 
            emotional and psychological state. It takes about 5 minutes and is completely private.
          </p>

          <div className="card" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 600 }}>Before you begin:</h3>
            {[
              '9 questions about your feelings over the past 2 weeks',
              'Results are private and stored securely',
              'You will receive personalized music recommendations',
              'This tool does not replace professional medical advice',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', color: 'var(--text2)', fontSize: '14px' }}>
                <span style={{ color: 'var(--primary-light)' }}>✓</span> {item}
              </div>
            ))}
          </div>

          <button onClick={() => setStep('quiz')} className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 40px' }}>
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const answered = responses.filter(r => r !== null).length;
    const allAnswered = answered === QUESTIONS.length;

    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Progress */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
                Question {Math.min(currentQ + 1, QUESTIONS.length)} of {QUESTIONS.length}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{answered} answered</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>

          {/* Current Question */}
          <div className="card fade-up" style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Over the last 2 weeks, how often have you been bothered by...
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', lineHeight: 1.4, marginBottom: '32px' }}>
              {QUESTIONS[currentQ]}
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: `2px solid ${responses[currentQ] === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: responses[currentQ] === opt.value ? 'rgba(124,111,247,0.12)' : 'var(--bg2)',
                    color: responses[currentQ] === opt.value ? 'var(--primary-light)' : 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: responses[currentQ] === opt.value ? 600 : 400,
                    transition: 'all 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {opt.label}
                  <span style={{ fontSize: '12px', color: 'var(--text3)', fontWeight: 400 }}>Score: {opt.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                className="btn btn-outline btn-sm"
                disabled={currentQ === 0}
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentQ(Math.min(QUESTIONS.length - 1, currentQ + 1))}
                className="btn btn-outline btn-sm"
                disabled={currentQ === QUESTIONS.length - 1}
              >
                Next →
              </button>
            </div>

            {allAnswered && (
              <button onClick={submitAssessment} className="btn btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : '🎵 Get Music Recommendations'}
              </button>
            )}
          </div>

          {/* All questions mini nav */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `2px solid ${i === currentQ ? 'var(--primary)' : responses[i] !== null ? 'var(--primary)' : 'var(--border)'}`,
                  background: i === currentQ ? 'var(--primary)' : responses[i] !== null ? 'rgba(124,111,247,0.2)' : 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error" style={{ marginTop: '16px' }}>{error}</div>}
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    const { assessment, recommendations } = result;
    const info = CATEGORY_INFO[assessment.category];

    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Result header */}
          <div className="card fade-up" style={{
            textAlign: 'center', marginBottom: '32px',
            background: 'linear-gradient(135deg, var(--card), var(--bg2))',
            border: `1px solid ${info.color}33`,
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{info.emoji}</div>
            <div className={`badge badge-${assessment.category}`} style={{ marginBottom: '12px' }}>
              {info.label}
            </div>
            <h2 className="section-title" style={{ marginBottom: '16px', color: info.color }}>
              Score: {assessment.score} / 27
            </h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 24px' }}>
              {assessment.feedback}
            </p>

            {assessment.category === 'severe' && (
              <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 16px' }}>
                🆘 Please reach out to a mental health professional or call a crisis helpline. You are not alone.
              </div>
            )}

            {/* Sub-metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '8px' }}>
              {[
                { label: 'Mood Level', value: assessment.moodLevel, color: 'var(--primary-light)' },
                { label: 'Stress Level', value: assessment.stressLevel, color: 'var(--accent)' },
                { label: 'Anxiety Level', value: assessment.anxietyLevel, color: 'var(--accent2)' },
              ].map(metric => (
                <div key={metric.label} style={{ background: 'var(--bg3)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: metric.color, fontWeight: 700, fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
                    {metric.value}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>{metric.label}</div>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div className="progress-fill" style={{ width: `${metric.value}%`, background: metric.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Music recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div>
              <h3 className="section-title" style={{ marginBottom: '8px', fontSize: '1.4rem' }}>
                🎵 Your Personalized Music Therapy
              </h3>
              <p style={{ color: 'var(--text2)', marginBottom: '24px', fontSize: '14px' }}>
                Based on your assessment, here are tracks selected to support your emotional well-being.
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {recommendations.map(track => (
                  <div key={track._id} className="music-card" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                      }}>🎵</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{track.title}</div>
                        <div style={{ color: 'var(--text2)', fontSize: '13px' }}>{track.artist} · {track.genre}</div>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{track.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/music')} className="btn btn-primary">
              🎧 Listen Now
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
              📊 View Dashboard
            </button>
            <button onClick={() => { setStep('intro'); setCurrentQ(0); setResponses(Array(QUESTIONS.length).fill(null)); setResult(null); }} className="btn btn-outline">
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}