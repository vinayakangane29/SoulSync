// Music page
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MusicPlayer from '../components/MusicPlayer';

const GENRES = ['all', 'meditation', 'classical', 'ambient', 'nature', 'jazz', 'acoustic', 'lofi'];

export default function Music() {
  const [recommended, setRecommended] = useState([]);
  const [allMusic, setAllMusic] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [genre, setGenre] = useState('all');
  const [tab, setTab] = useState('recommended'); // recommended | browse
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const [recRes, allRes] = await Promise.all([
          axios.get('/api/music/recommended'),
          axios.get('/api/music'),
        ]);
        setRecommended(recRes.data);
        setAllMusic(allRes.data);
        setFiltered(allRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  useEffect(() => {
    if (genre === 'all') {
      setFiltered(allMusic);
    } else {
      setFiltered(allMusic.filter(m => m.genre === genre));
    }
  }, [genre, allMusic]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">🎵 Music Therapy Library</h1>
          <p style={{ color: 'var(--text2)', marginTop: '8px' }}>
            Curated tracks to support your mental well-being
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {[
            { id: 'recommended', label: '✨ Recommended for You' },
            { id: 'browse', label: '🎧 Browse All' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${tab === t.id ? 'var(--primary)' : 'transparent'}`,
                color: tab === t.id ? 'var(--primary-light)' : 'var(--text2)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontSize: '14px', fontWeight: tab === t.id ? 600 : 400,
                transition: 'all 0.2s', paddingBottom: '12px',
                marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'recommended' && (
          <div>
            {recommended.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎵</div>
                <h3 style={{ marginBottom: '12px' }}>No recommendations yet</h3>
                <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
                  Complete an assessment to receive personalized music recommendations based on your mental state.
                </p>
                <Link to="/assessment" className="btn btn-primary">Take Assessment</Link>
              </div>
            ) : (
              <MusicPlayer tracks={recommended} />
            )}
          </div>
        )}

        {tab === 'browse' && (
          <div>
            {/* Genre filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`btn btn-sm ${genre === g ? 'btn-primary' : 'btn-outline'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {g}
                </button>
              ))}
            </div>

            <MusicPlayer tracks={filtered} />
          </div>
        )}
      </div>
    </div>
  );
}