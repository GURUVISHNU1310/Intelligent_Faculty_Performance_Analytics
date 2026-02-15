import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllReports } from '../services/performanceService';
import { getAllFeedbackSummaries } from '../services/feedbackService';
import PerformanceChart, { showTeachingChart } from '../charts/PerformanceChart';
import AttendanceChart, { showAttendanceChart } from '../charts/AttendanceChart';
import ResearchChart, { showResearchChart } from '../charts/ResearchChart';
import OverallPerformanceChart, { showOverallPerformanceChart } from '../charts/OverallPerformanceChart';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [feedbackSummaries, setFeedbackSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAllReports(), getAllFeedbackSummaries()])
      .then(([reportsData, feedbackData]) => {
        setReports(Array.isArray(reportsData) ? reportsData : []);
        setFeedbackSummaries(Array.isArray(feedbackData) ? feedbackData : []);
      })
      .catch((err) => setError(err.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  const latestByFaculty = reports.reduce((acc, r) => {
    const id = r.facultyId?._id || r.facultyId;
    if (!acc[id] || new Date(r.createdAt) > new Date(acc[id].createdAt)) acc[id] = r;
    return acc;
  }, {});
  const latestList = Object.values(latestByFaculty);
  const selectedLatest = selectedFacultyId ? latestByFaculty[selectedFacultyId] : null;
  const facultyReports = selectedFacultyId ? reports.filter((r) => (r.facultyId?._id || r.facultyId) === selectedFacultyId) : [];

  const feedbackByFaculty = feedbackSummaries.reduce((acc, s) => {
    acc[String(s.facultyId?._id || s.facultyId)] = s.averageScore;
    return acc;
  }, {});

  // Teaching score = live from student feedback (use feedback summaries when no performance records)
  const teachingLabels = latestList.length
    ? latestList.map((r) => r.facultyId?.name || 'Faculty')
    : feedbackSummaries.map((s) => s.facultyName || 'Faculty');
  const teachingScores = latestList.length
    ? latestList.map((r) => feedbackByFaculty[String(r.facultyId?._id || r.facultyId)] ?? 0)
    : feedbackSummaries.map((s) => s.averageScore ?? 0);
  const teachingData = showTeachingChart(teachingLabels, teachingScores);
  const overallData = showOverallPerformanceChart(
    latestList.map((r) => r.facultyId?.name || 'Faculty'),
    latestList.map((r) => r.totalScore)
  );
  const liveTeaching = selectedFacultyId ? (feedbackByFaculty[String(selectedFacultyId)] ?? 0) : 0;
  const attendanceData = selectedLatest
    ? showAttendanceChart(
        ['Teaching', 'Feedback', 'Attendance', 'Research', 'Admin'],
        [liveTeaching, liveTeaching, selectedLatest.attendance, selectedLatest.researchPapers, selectedLatest.adminWork]
      )
    : { labels: [], datasets: [{ data: [] }] };
  const researchData = showResearchChart(
    latestList.map((r) => r.facultyId?.name || 'Faculty'),
    latestList.map((r) => r.researchPapers)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h1>Reports</h1>
        <button type="button" className="btn btn-secondary" onClick={loadData}>Refresh</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Teaching Score by Faculty (from student feedback)</h3>
          <PerformanceChart data={teachingData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Overall Performance</h3>
          <OverallPerformanceChart data={overallData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Research Score by Faculty</h3>
          <ResearchChart data={researchData} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>View by Faculty</h3>
        <select
          value={selectedFacultyId || ''}
          onChange={(e) => setSelectedFacultyId(e.target.value || null)}
          style={{ padding: '0.5rem', minWidth: '200px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
        >
          <option value="">Select faculty</option>
          {latestList.map((r) => {
            const id = r.facultyId?._id || r.facultyId;
            return (
              <option key={id} value={id}>
                {r.facultyId?.name || 'Faculty'}
              </option>
            );
          })}
        </select>
      </div>

      {selectedFacultyId && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Score Breakdown</h3>
            <AttendanceChart data={attendanceData} />
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>History</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Teaching</th>
                    <th>Feedback</th>
                    <th>Attendance</th>
                    <th>Research</th>
                    <th>Admin</th>
                    <th>Total</th>
                    <th>Level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyReports.map((p) => (
                    <tr key={p._id}>
                      <td>{p.facultyId?.name}</td>
                      <td>{p.teachingScore}</td>
                      <td>{p.studentFeedback}</td>
                      <td>{p.attendance}</td>
                      <td>{p.researchPapers}</td>
                      <td>{p.adminWork}</td>
                      <td>{p.totalScore}</td>
                      <td>{p.performanceLevel}</td>
                      <td>
                        <Link to={`/faculty/performance/${p.facultyId?._id || p.facultyId}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>All Latest Performance</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Total Score</th>
                <th>Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {latestList.map((r) => (
                <tr key={r.facultyId?._id || r.facultyId}>
                  <td>{r.facultyId?.name}</td>
                  <td>{r.facultyId?.department}</td>
                  <td>{r.totalScore}</td>
                  <td>{r.performanceLevel}</td>
                  <td>
                    <Link to={`/faculty/performance/${r.facultyId?._id || r.facultyId}`} className="btn btn-primary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>View</Link>
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
