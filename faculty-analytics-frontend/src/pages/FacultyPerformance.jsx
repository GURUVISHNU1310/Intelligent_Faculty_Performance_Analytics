import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchFaculty, fetchFacultyById } from '../services/facultyService';
import { fetchPerformance, addPerformance } from '../services/performanceService';
import PerformanceChart, { showTeachingChart } from '../charts/PerformanceChart';
import AttendanceChart, { showAttendanceChart } from '../charts/AttendanceChart';
import ResearchChart, { showResearchChart } from '../charts/ResearchChart';
import OverallPerformanceChart, { showOverallPerformanceChart } from '../charts/OverallPerformanceChart';

function FacultyPerformanceWithId() {
  const { id } = useParams();
  const { user } = useAuth();
  const canAdd = user?.role === 'ADMIN' || user?.role === 'HOD';
  const [faculty, setFaculty] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    teachingScore: 0,
    studentFeedback: 0,
    attendance: 0,
    researchPapers: 0,
    adminWork: 0,
  });

  useEffect(() => {
    Promise.all([fetchFacultyById(id), fetchPerformance(id)])
      .then(([facultyRes, perfRes]) => {
        setFaculty(facultyRes);
        setPerformances(Array.isArray(perfRes) ? perfRes : []);
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPerformance({ facultyId: id, ...form });
      setForm({ teachingScore: 0, studentFeedback: 0, attendance: 0, researchPapers: 0, adminWork: 0 });
      setShowForm(false);
      const perfRes = await fetchPerformance(id);
      setPerformances(Array.isArray(perfRes) ? perfRes : []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !faculty) return <p className="error-msg">{error}</p>;
  if (!faculty) return null;

  const latest = performances[0];
  const labels = performances.slice(0, 10).map((_, i) => `Record ${performances.length - i}`);
  const teachingData = showTeachingChart(labels, performances.slice(0, 10).map((p) => p.teachingScore).reverse());
  const attendanceData = showAttendanceChart(
    ['Teaching', 'Feedback', 'Attendance', 'Research', 'Admin'],
    latest ? [latest.teachingScore, latest.studentFeedback, latest.attendance, latest.researchPapers, latest.adminWork] : []
  );
  const researchData = showResearchChart(labels, performances.slice(0, 10).map((p) => p.researchPapers).reverse());
  const overallData = showOverallPerformanceChart(labels, performances.slice(0, 10).map((p) => p.totalScore).reverse());

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/faculty" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Faculty List</Link>
      </div>
      <h1 style={{ marginBottom: '0.5rem' }}>{faculty.name}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{faculty.department} · {faculty.designation}</p>

      {latest && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '0.75rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Score</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{latest.totalScore}</p>
          </div>
          <div className="card" style={{ padding: '0.75rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{latest.performanceLevel}</p>
          </div>
        </div>
      )}

      {canAdd && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Performance Record'}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {['teachingScore', 'studentFeedback', 'attendance', 'researchPapers', 'adminWork'].map((key) => (
                <div className="form-group" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input type="number" min="0" max="100" name={key} value={form[key]} onChange={handleChange} />
                </div>
              ))}
              <div style={{ alignSelf: 'end' }}>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Teaching Score</h3>
          <PerformanceChart data={teachingData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Attendance & Components</h3>
          <AttendanceChart data={attendanceData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Research Score</h3>
          <ResearchChart data={researchData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Overall Performance</h3>
          <OverallPerformanceChart data={overallData} />
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Performance History</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teaching</th>
                <th>Feedback</th>
                <th>Attendance</th>
                <th>Research</th>
                <th>Admin</th>
                <th>Total</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((p) => (
                <tr key={p._id}>
                  <td>{p.teachingScore}</td>
                  <td>{p.studentFeedback}</td>
                  <td>{p.attendance}</td>
                  <td>{p.researchPapers}</td>
                  <td>{p.adminWork}</td>
                  <td>{p.totalScore}</td>
                  <td>{p.performanceLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {performances.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No performance records yet.</p>}
      </div>
    </div>
  );
}

function PerformanceEntryList() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaculty()
      .then(setFaculty)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Performance</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Select a faculty member to view or add performance.</p>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.department}</td>
                  <td>{f.designation}</td>
                  <td>
                    <Link to={`/faculty/performance/${f._id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>View / Add</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function FacultyPerformance() {
  const { id } = useParams();
  if (id) return <FacultyPerformanceWithId />;
  return <PerformanceEntryList />;
}
