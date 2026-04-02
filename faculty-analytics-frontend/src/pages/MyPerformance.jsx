import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchMyFaculty } from '../services/facultyService';

export default function MyPerformance() {
  const [facultyId, setFacultyId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetchMyFaculty()
      .then((f) => {
        if (!alive) return;
        setFacultyId(f?._id || null);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || 'Faculty not found.');
      });
    return () => {
      alive = false;
    };
  }, []);

  if (facultyId) return <Navigate to={`/faculty/performance/${facultyId}`} replace />;
  if (error) return <p className="error-msg">{error}</p>;
  return <p>Loading performance...</p>;
}

