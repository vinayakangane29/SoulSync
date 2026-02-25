// MusicPlayer component
import { useState } from 'react';
import axios from 'axios';

export default function MusicPlayer({ tracks }) {
  const [activeTrack, setActiveTrack] = useState(null);

  const playTrack = async (track) => {
    setActiveTrack(track);
    try {
      await axios.post(`/api/music/played/${track._id}`);
    } catch (e) { /* non-critical */ }
  };

  const genreEmojis = {
    meditation: '🧘', classical: '🎻', ambient: '🌌',
    uplifting: '✨', nature: '🌿', jazz: '🎷', acoustic: '🎸', lofi: '🎧',
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎵</div>
        <p>No music recommendations yet.<br/>Complete an assessment to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {activeTrack && (
        <div className="card" style={{ marginBottom: '24px', background: 'var(--bg2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              flexShrink: 0
            }}>
              {genreEmojis[activeTrack.genre] || '🎵'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>{activeTrack.title}</div>
              <div style={{ color: 'var(--text2)', fontSize: '13px' }}>{activeTrack.artist}</div>
            </div>
            <button onClick={() => setActiveTrack(null)} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'var(--text3)', cursor: 'pointer', fontSize: '18px'
            }}>✕</button>
          </div>
          {/* YouTube embed */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?autoplay=1`}
              title={activeTrack.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          </div>
          {activeTrack.description && (
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '12px', fontStyle: 'italic' }}>
              {activeTrack.description}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {tracks.map((track) => (
          <div
            key={track._id}
            className={`music-card ${activeTrack?._id === track._id ? 'active' : ''}`}
            onClick={() => playTrack(track)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: activeTrack?._id === track._id
                  ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                  : 'var(--bg3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                transition: 'all 0.2s',
              }}>
                {activeTrack?._id === track._id ? '▶' : genreEmojis[track.genre] || '🎵'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: '12px' }}>{track.artist}</div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {track.mood?.slice(0, 2).map(m => (
                    <span key={m} style={{
                      fontSize: '10px', padding: '2px 8px', borderRadius: '50px',
                      background: 'rgba(124,111,247,0.12)', color: 'var(--primary-light)'
                    }}>{m}</span>
                  ))}
                </div>
              </div>
              {track.duration && (
                <span style={{ fontSize: '11px', color: 'var(--text3)', flexShrink: 0 }}>{track.duration}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}