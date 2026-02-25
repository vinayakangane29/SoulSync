// Home page
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(124,111,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(240,160,107,0.08) 0%, transparent 50%)',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(124,111,247,0.12)', border: '1px solid rgba(124,111,247,0.25)',
              borderRadius: '50px', padding: '6px 16px', marginBottom: '32px',
              fontSize: '13px', color: 'var(--primary-light)',
            }}>
              🎵 Mental Health × Music Therapy
            </div>

            <h1 className="display-title fade-up" style={{ marginBottom: '24px' }}>
              Understand your mind,<br />
              <em style={{ color: 'var(--primary-light)' }}>heal with music</em>
            </h1>

            <p className="fade-up" style={{
              fontSize: '18px', color: 'var(--text2)', lineHeight: 1.7,
              maxWidth: '560px', marginBottom: '40px', animationDelay: '0.1s'
            }}>
              SoulSync combines scientifically-informed self-assessment with personalized 
              music therapy to support your emotional well-being — privately and freely.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="fade-up">
              {user ? (
                <>
                  <Link to="/assessment" className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
                    📋 Take Assessment
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline" style={{ fontSize: '16px', padding: '14px 32px' }}>
                    📊 My Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-outline" style={{ fontSize: '16px', padding: '14px 32px' }}>
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative floating orbs */}
        <div style={{
          position: 'absolute', right: '10%', top: '25%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,111,247,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '25%', bottom: '20%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,160,107,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title">How SoulSync Works</h2>
            <p style={{ color: 'var(--text2)', maxWidth: '480px', margin: '0 auto' }}>
              Three simple steps to better mental well-being
            </p>
          </div>

          <div className="grid-3">
            {[
              { icon: '📋', title: 'Self-Assessment', desc: 'Answer a scientifically designed questionnaire about your emotional and psychological state. Takes only 5 minutes.', color: '#7c6ff7' },
              { icon: '🎵', title: 'Music Therapy', desc: 'Receive personalized music recommendations based on your mood and mental health results. Backed by research.', color: '#f0a06b' },
              { icon: '📈', title: 'Track Progress', desc: 'Monitor your mental health trends over time with beautiful charts. See how music improves your well-being.', color: '#6bd4f0' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                  background: `rgba(${f.color === '#7c6ff7' ? '124,111,247' : f.color === '#f0a06b' ? '240,160,107' : '107,212,240'},0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '14px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { value: '15+', label: 'Curated Music Tracks', color: 'var(--primary-light)' },
              { value: '9', label: 'PHQ-9 Assessment Questions', color: 'var(--accent)' },
              { value: '5', label: 'Mental Health Categories', color: 'var(--accent2)' },
              { value: '100%', label: 'Private & Secure', color: 'var(--green)' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Ready to begin your journey?</h2>
            <p style={{ color: 'var(--text2)', marginBottom: '32px' }}>
              Join SoulSync and take the first step toward better mental well-being.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 40px' }}>
              Start for Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}