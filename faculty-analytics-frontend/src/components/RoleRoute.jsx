import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Renders children only if user has one of the allowed roles. Otherwise redirects to dashboard.
 */
export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const hasAccess = user && allowedRoles && allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}
