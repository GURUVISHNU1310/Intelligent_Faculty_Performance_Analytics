import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin & HOD: full. Faculty: view faculty/performance. Student: own dashboard + profile only (give feedback on dashboard).
const baseLinks = [
  { to: '/', label: 'Dashboard', roles: ['ADMIN', 'HOD', 'STUDENT'], end: true },
  { to: '/faculty', label: 'Faculty List', roles: ['ADMIN', 'HOD'], end: true },
  { to: '/faculty/add', label: 'Add Faculty', roles: ['HOD'] },
  { to: '/performance', label: 'Performance', roles: ['ADMIN', 'HOD'] },
  { to: '/reports', label: 'Reports', roles: ['ADMIN', 'HOD', 'FACULTY'] },
  { to: '/profile', label: 'Profile', roles: ['ADMIN', 'HOD', 'FACULTY', 'STUDENT'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || '';
  const isMyPerformanceActive =
    role === 'FACULTY' && (location.pathname === '/my-performance' || location.pathname.startsWith('/faculty/performance/'));

  const dynamicLinks =
    role === 'FACULTY'
      ? [{ to: '/my-performance', label: 'Dashboard', roles: ['FACULTY'], forceActive: isMyPerformanceActive }]
      : [];

  const links = [...baseLinks, ...dynamicLinks].filter((link) => link.roles.includes(role));
  
  return (
    <aside style={styles.aside}>
      <ul style={styles.ul}>
        {links.map(({ to, label, end, forceActive }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              style={({ isActive }) => ({
                ...styles.link,
                ...((forceActive ?? false) || isActive ? styles.linkActive : {}),
              })}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const styles = {
  aside: {
    width: '220px',
    minHeight: 'calc(100vh - 56px)',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    padding: '1rem 0',
  },
  ul: { listStyle: 'none' },
  link: {
    display: 'block',
    padding: '0.6rem 1.25rem',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'color 0.2s, background 0.2s',
  },
  linkActive: {
    color: 'var(--accent)',
    background: 'rgba(56, 189, 248, 0.1)',
    borderRight: '3px solid var(--accent)',
  },
};
