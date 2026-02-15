import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/authService';

const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'FACULTY', label: 'Faculty' },
  { value: 'STUDENT', label: 'Student' },
];

export default function Register() {
  const [username, setUsername] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('FACULTY');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (role === 'FACULTY' && !facultyEmail.trim()) {
      setError('Enter the faculty email your admin added for you.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRegister(
        role === 'FACULTY' ? facultyEmail.trim() : username,
        password,
        role,
        role === 'FACULTY' ? facultyEmail.trim() : null
      );
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <h1 style={styles.title}>Faculty Performance Analytics</h1>
        <p style={styles.subtitle}>Create an account</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          {role !== 'FACULTY' && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={role !== 'FACULTY'}
                autoFocus={role !== 'FACULTY'}
                placeholder="Choose a username"
              />
            </div>
          )}
          {role === 'FACULTY' && (
            <div className="form-group">
              <label>Faculty email</label>
              <input
                type="email"
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
                required
                autoFocus={role === 'FACULTY'}
                placeholder="Email your admin added for you"
              />
              <p style={styles.roleHint}>
                You can only register if admin has already added you as faculty with this email.
              </p>
            </div>
          )}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
            />
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <p style={styles.roleHint}>
              {role === 'ADMIN' && 'Full access: manage faculty, performance, and reports.'}
              {role === 'FACULTY' && 'Only if admin has added you as faculty first. You cannot add faculty.'}
              {role === 'STUDENT' && 'View dashboard and give feedback only.'}
            </p>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: { width: '100%', maxWidth: '420px' },
  title: { marginBottom: '0.25rem', fontSize: '1.5rem' },
  subtitle: { color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' },
  form: { marginTop: '0.5rem' },
  select: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '1rem',
  },
  roleHint: {
    marginTop: '0.35rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  btn: { width: '100%', marginTop: '0.5rem' },
  footer: { marginTop: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' },
};
