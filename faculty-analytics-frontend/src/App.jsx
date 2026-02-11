import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FacultyList from './pages/FacultyList';
import AddFaculty from './pages/AddFaculty';
import EditFaculty from './pages/EditFaculty';
import FacultyPerformance from './pages/FacultyPerformance';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute>
            <Layout><FacultyList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/add"
        element={
          <ProtectedRoute>
            <Layout><AddFaculty /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/edit/:id"
        element={
          <ProtectedRoute>
            <Layout><EditFaculty /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/performance/:id"
        element={
          <ProtectedRoute>
            <Layout><FacultyPerformance /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <ProtectedRoute>
            <Layout><FacultyPerformance /> </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
