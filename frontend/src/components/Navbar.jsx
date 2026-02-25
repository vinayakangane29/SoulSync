// Navbar component
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(13,15,26,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c6ff7, #f0a06b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>🎵</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', fontWeight: 700 }}>
            Soul<span style={{ color: 'var(--primary-light)' }}>Sync</span>
          </span>
        </Link>

        {/* Nav links */}
        {user && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[
              { to: '/dashboard', label: '📊 Dashboard' },
              { to: '/assessment', label: '📋 Assessment' },
              { to: '/music', label: '🎶 Music' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive(to) ? 'var(--primary-light)' : 'var(--text2)',
                background: isActive(to) ? 'rgba(124,111,247,0.15)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>{label}</Link>
            ))}
          </div>
        )}

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
                Hi, <strong style={{ color: 'var(--text)' }}>{user.name.split(' ')[0]}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}