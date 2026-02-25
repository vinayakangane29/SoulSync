// Dashboard page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProgressChart from '../components/ProgressChart';

const CATEGORY_INFO = {
  minimal: { label: 'Minimal', color: 'var(--green)', emoji: '😊' },
  low_stress: { label: 'Low Stress', color: 'var(--accent2)', emoji: '😐' },
  moderate_stress: { label: 'Moderate', color: 'var(--accent)', emoji: '😟' },
  high_stress: { label: 'High Stress', color: 'var(--red)', emoji: '😔' },
  severe: { label: 'Severe', color: '#ff6060', emoji: '🆘' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, histRes] = await Promise.all([
          axios.get('/api/dashboard'),
          axios.get('/api/assessment/history'),
        ]);
        setData(dashRes.data);
        setHistory(histRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">
            Welcome back, <em style={{ color: 'var(--primary-light)' }}>{user?.name?.split(' ')[0]}</em> 👋
          </h1>
          <p style={{ color: 'var(--text2)', marginTop: '8px' }}>
            Here's your mental health overview and progress
          </p>
        </div>

        {data?.totalAssessments === 0 ? (
          // Empty state
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📋</div>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>No assessments yet</h2>
            <p style={{ color: 'var(--text2)', marginBottom: '32px' }}>
              Take your first self-assessment to see your mental health dashboard and get personalized music recommendations.
            </p>
            <Link to="/assessment" className="btn btn-primary">Take Your First Assessment</Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--primary-light)' }}>{data.totalAssessments}</div>
                <div className="stat-label">Total Assessments</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent)' }}>{data.averageScore}</div>
                <div className="stat-label">Avg Score (7 days)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent2)' }}>{data.totalMusicPlayed}</div>
                <div className="stat-label">Tracks Played</div>
              </div>
              {data.latestAssessment && (
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '2rem' }}>
                    {CATEGORY_INFO[data.latestAssessment.category]?.emoji}
                  </div>
                  <div className="stat-label" style={{ color: CATEGORY_INFO[data.latestAssessment.category]?.color }}>
                    {CATEGORY_INFO[data.latestAssessment.category]?.label}
                  </div>
                </div>
              )}
            </div>

            {/* Latest assessment */}
            {data.latestAssessment && (
              <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  📊 Latest Assessment
                  <span className={`badge badge-${data.latestAssessment.category}`}>
                    {CATEGORY_INFO[data.latestAssessment.category]?.label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text3)', marginLeft: 'auto', fontWeight: 400 }}>
                    {new Date(data.latestAssessment.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[
                    { label: 'Mood', value: data.latestAssessment.moodLevel, color: 'var(--primary-light)' },
                    { label: 'Stress', value: data.latestAssessment.stressLevel, color: 'var(--accent)' },
                    { label: 'Anxiety', value: data.latestAssessment.anxietyLevel, color: 'var(--accent2)' },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'var(--bg2)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{m.label}</span>
                        <span style={{ color: m.color, fontWeight: 600 }}>{m.value}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${m.value}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ color: 'var(--text2)', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6 }}>
                  {data.latestAssessment.feedback}
                </p>
              </div>
            )}

            {/* Trend chart */}
            {data.trendData && data.trendData.length > 0 && (
              <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>📈 Mental Health Trends</h3>
                <ProgressChart data={data.trendData} />
              </div>
            )}

            {/* Assessment history */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 600 }}>📋 Assessment History</h3>
                <Link to="/assessment" className="btn btn-primary btn-sm">+ New Assessment</Link>
              </div>

              {history.length === 0 ? (
                <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '20px' }}>No history yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {history.map(a => (
                    <div key={a._id} style={{
                      background: 'var(--bg2)', borderRadius: '12px', padding: '16px',
                      display: 'flex', alignItems: 'center', gap: '16px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{CATEGORY_INFO[a.category]?.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span className={`badge badge-${a.category}`}>{CATEGORY_INFO[a.category]?.label}</span>
                          <span style={{ fontSize: '13px', color: 'var(--text3)' }}>Score: {a.score}/27</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
                          {new Date(a.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text3)' }}>
                        <span>😊 {a.moodLevel}%</span>
                        <span>😤 {a.stressLevel}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}