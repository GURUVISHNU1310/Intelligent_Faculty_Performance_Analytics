import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFaculty } from '../services/facultyService';

export default function AddFaculty() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    experience: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'experience' ? Number(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await addFaculty(form);
      navigate('/faculty');
    } catch (err) {
      setError(err.message || 'Failed to add faculty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Add Faculty</h1>
      <div className="card" style={{ maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input name="designation" value={form.designation} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Experience (years)</label>
            <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Faculty'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/faculty')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
