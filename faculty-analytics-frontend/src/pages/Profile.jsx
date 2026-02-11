import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Profile</h1>
      <div className="card" style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Username</label>
          <p style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}>{user?.username ?? '—'}</p>
        </div>
        <div className="form-group">
          <label>Role</label>
          <p style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}>{user?.role ?? '—'}</p>
        </div>
      </div>
    </div>
  );
}
