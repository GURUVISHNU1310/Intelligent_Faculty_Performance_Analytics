import { useState, useEffect } from 'react';
import { fetchFaculty } from '../services/facultyService';
import { getMyFeedbacks, submitFeedback } from '../services/feedbackService';

export default function StudentDashboard() {
  const [faculty, setFaculty] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(null); // facultyId being submitted
  const [scores, setScores] = useState({}); // facultyId -> score input

  const load = () => {
    Promise.all([fetchFaculty(), getMyFeedbacks()])
      .then(([facultyRes, feedbacksRes]) => {
        setFaculty(facultyRes);
        setMyFeedbacks(Array.isArray(feedbacksRes) ? feedbacksRes : []);
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleSubmitFeedback = async (facultyId) => {
    const score = scores[facultyId];
    if (score === undefined || score === '' || Number(score) < 0 || Number(score) > 100) {
      setError('Please enter a score between 0 and 100.');
      return;
    }
    setError('');
    setSubmitting(facultyId);
    try {
      await submitFeedback(facultyId, Number(score));
      load();
    } catch (err) {
      setError(err?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <p>Loading your dashboard...</p>;
  if (error && !faculty.length && !myFeedbacks.length) return <p className="error-msg">{error}</p>;

  const feedbackByFaculty = myFeedbacks.reduce((acc, f) => {
    acc[f.facultyId?._id || f.facultyId] = f;
    return acc;
  }, {});

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>My Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Give feedback scores (0–100) for faculty. You can update your score anytime.
      </p>

      {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Give feedback to faculty</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Your score (0–100)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => {
                const existing = feedbackByFaculty[f._id];
                const currentScore = scores[f._id] !== undefined ? scores[f._id] : (existing ? existing.score : '');
                return (
                  <tr key={f._id}>
                    <td>{f.name}</td>
                    <td>{f.department}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentScore}
                        onChange={(e) => setScores((prev) => ({ ...prev, [f._id]: e.target.value }))}
                        placeholder="0–100"
                        style={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={submitting === f._id}
                        onClick={() => handleSubmitFeedback(f._id)}
                      >
                        {submitting === f._id ? 'Submitting...' : existing ? 'Update' : 'Submit'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {faculty.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No faculty listed yet.</p>}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Feedback I've given</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Score</th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              {myFeedbacks.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.facultyId?.name}</td>
                  <td>{fb.facultyId?.department}</td>
                  <td><strong>{fb.score}</strong></td>
                  <td>{fb.updatedAt ? new Date(fb.updatedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myFeedbacks.length === 0 && (
          <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>You haven't submitted any feedback yet. Use the form above to give scores.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: '100px',
    padding: '0.4rem 0.5rem',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text)',
  },
};
