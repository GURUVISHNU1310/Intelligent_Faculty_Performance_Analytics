import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFacultyById, updateFaculty } from '../services/facultyService';

const DESIGNATIONS = ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer'];

const toDateInputValue = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const initialForm = {
  name: '',
  profilePhoto: '',
  facultyId: '',
  dateOfBirth: '',
  gender: '',
  contactNumber: '',
  email: '',
  address: '',
  designation: 'Assistant Professor',
  department: '',
  joiningDate: '',
  experience: 0,
};

export default function EditFaculty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFacultyById(id)
      .then((data) => {
        setForm({
          name: data.name || '',
          profilePhoto: data.profilePhoto || '',
          facultyId: data.facultyId || '',
          dateOfBirth: toDateInputValue(data.dateOfBirth),
          gender: data.gender || '',
          contactNumber: data.contactNumber || '',
          email: data.email || '',
          address: data.address || '',
          designation: data.designation || 'Assistant Professor',
          department: data.department || '',
          joiningDate: toDateInputValue(data.joiningDate),
          experience: data.experience ?? 0,
        });
      })
      .catch((err) => setError(err.message || 'Faculty not found'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'experience' ? (Number(value) || 0) : value,
    }));
  };

  const formatDateForApi = (dateStr) => (dateStr ? new Date(dateStr).toISOString() : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        dateOfBirth: formatDateForApi(form.dateOfBirth),
        joiningDate: formatDateForApi(form.joiningDate),
      };
      await updateFaculty(id, payload);
      navigate('/faculty');
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (error && !form.name) return <p className="error-msg">{error}</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Edit Faculty</h1>
      <div className="card" style={{ maxWidth: '560px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" />
          </div>
          <div className="form-group">
            <label>Profile Photo (URL)</label>
            <input name="profilePhoto" type="url" value={form.profilePhoto} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Faculty ID</label>
            <input name="facultyId" value={form.facultyId} onChange={handleChange} placeholder="Faculty ID" />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input name="contactNumber" type="tel" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" />
          </div>
          <div className="form-group">
            <label>Email ID</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email ID" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="Address" />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <select name="designation" value={form.designation} onChange={handleChange} required>
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} required placeholder="Department" />
          </div>
          <div className="form-group">
            <label>Joining Date</label>
            <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Experience (Years)</label>
            <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/faculty')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
