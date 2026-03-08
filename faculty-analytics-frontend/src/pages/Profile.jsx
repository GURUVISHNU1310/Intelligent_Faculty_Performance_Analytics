import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyFaculty } from '../services/facultyService';

function formatDate(val) {
  if (!val) return '—';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export default function Profile() {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isFacultyOrHod = user?.role === 'FACULTY' || user?.role === 'HOD';

  useEffect(() => {
    if (!isFacultyOrHod) {
      setLoading(false);
      return;
    }
    fetchMyFaculty()
      .then(setFaculty)
      .catch((err) => setError(err.message || 'Could not load profile'))
      .finally(() => setLoading(false));
  }, [isFacultyOrHod]);

  if (loading && isFacultyOrHod) return <p>Loading profile...</p>;
  if (error && isFacultyOrHod) return <p className="error-msg">{error}</p>;

  if (isFacultyOrHod && faculty) {
    return (
      <div>
        <h1 style={{ marginBottom: '1rem' }}>Faculty Profile</h1>
        <div className="card" style={{ maxWidth: '560px' }}>
          <div style={styles.section}>
            <div style={styles.photoWrap}>
              {faculty.profilePhoto ? (
                <img src={faculty.profilePhoto} alt="Profile" style={styles.photo} />
              ) : (
                <div style={styles.photoPlaceholder}>Photo</div>
              )}
            </div>
            <div style={styles.grid}>
              <Field label="Full Name" value={faculty.name} />
              <Field label="Faculty ID" value={faculty.facultyId} />
              <Field label="Date of Birth" value={formatDate(faculty.dateOfBirth)} />
              <Field label="Gender" value={faculty.gender} />
              <Field label="Contact Number" value={faculty.contactNumber} />
              <Field label="Email ID" value={faculty.email} />
              <Field label="Address" value={faculty.address} fullWidth />
              <Field label="Designation" value={faculty.designation} />
              <Field label="Department" value={faculty.department} />
              <Field label="Joining Date" value={formatDate(faculty.joiningDate)} />
              <Field label="Experience (Years)" value={faculty.experience != null ? String(faculty.experience) : ''} />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

function Field({ label, value, fullWidth }) {
  const v = value != null && value !== '' ? value : '—';
  return (
    <div style={{ ...styles.field, ...(fullWidth ? styles.fieldFull : {}) }}>
      <label style={styles.label}>{label}</label>
      <p style={styles.value}>{v}</p>
    </div>
  );
}

const styles = {
  section: { padding: '0.25rem 0' },
  photoWrap: { marginBottom: '1.25rem' },
  photo: { width: 120, height: 120, borderRadius: 8, objectFit: 'cover' },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem' },
  field: {},
  fieldFull: { gridColumn: '1 / -1' },
  label: { display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' },
  value: { margin: 0, fontSize: '1rem' },
};
