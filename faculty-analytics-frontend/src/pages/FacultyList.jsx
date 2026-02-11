import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchFaculty, deleteFaculty } from '../services/facultyService';

export default function FacultyList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'HOD';

  const load = () => {
    fetchFaculty()
      .then(setList)
      .catch((err) => setError(err.message || 'Failed to load faculty'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete faculty "${name}"?`)) return;
    deleteFaculty(id)
      .then(() => load())
      .catch((err) => setError(err.message));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h1>Faculty List</h1>
        {canEdit && (
          <Link to="/faculty/add" className="btn btn-primary">Add Faculty</Link>
        )}
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Experience (yrs)</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f._id}>
                  <td>
                    <Link to={`/faculty/performance/${f._id}`}>{f.name}</Link>
                  </td>
                  <td>{f.email}</td>
                  <td>{f.department}</td>
                  <td>{f.designation}</td>
                  <td>{f.experience}</td>
                  {canEdit && (
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/faculty/edit/${f._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</Link>
                      <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDelete(f._id, f.name)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No faculty found. Add one to get started.</p>}
      </div>
    </div>
  );
}
