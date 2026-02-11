import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFaculty } from '../services/facultyService';
import { getAllReports } from '../services/performanceService';
import PerformanceChart, { showTeachingChart } from '../charts/PerformanceChart';
import OverallPerformanceChart, { showOverallPerformanceChart } from '../charts/OverallPerformanceChart';

export default function Dashboard() {
  const [faculty, setFaculty] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchFaculty(), getAllReports()])
      .then(([facultyRes, reportsRes]) => {
        setFaculty(facultyRes);
        setReports(Array.isArray(reportsRes) ? reportsRes : []);
      })
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  const latestByFaculty = reports.reduce((acc, r) => {
    const id = r.facultyId?._id || r.facultyId;
    if (!acc[id] || new Date(r.createdAt) > new Date(acc[id].createdAt)) acc[id] = r;
    return acc;
  }, {});
  const latest = Object.values(latestByFaculty).slice(0, 10);

  const teachingData = showTeachingChart(
    latest.map((r) => r.facultyId?.name || 'Faculty'),
    latest.map((r) => r.teachingScore)
  );
  const overallData = showOverallPerformanceChart(
    latest.map((r) => r.facultyId?.name || 'Faculty'),
    latest.map((r) => r.totalScore)
  );

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Faculty</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{faculty.length}</p>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Performance Records</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{reports.length}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Teaching Score Overview</h3>
          <PerformanceChart data={teachingData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Overall Performance</h3>
          <OverallPerformanceChart data={overallData} />
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/faculty/add" className="btn btn-primary">Add Faculty</Link>
          <Link to="/faculty" className="btn btn-secondary">View Faculty</Link>
          <Link to="/reports" className="btn btn-secondary">View Reports</Link>
        </div>
      </div>
    </div>
  );
}
