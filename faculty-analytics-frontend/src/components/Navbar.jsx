import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

export default function Navbar() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Faculty Analytics</Link>
      <div style={styles.right}>
        {user && (
          <>
            <span style={styles.user}>{user.username} ({user.role})</span>
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    color: 'var(--accent)',
    fontWeight: 700,
    fontSize: '1.25rem',
    textDecoration: 'none',
  },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  user: { color: 'var(--text-muted)', fontSize: '0.9rem' },
};
