import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin & HOD: full. Faculty: view faculty/performance. Student: own dashboard + profile only (give feedback on dashboard).
const allLinks = [
  { to: '/', label: 'Dashboard', roles: ['ADMIN', 'HOD', 'FACULTY', 'STUDENT'] },
  { to: '/faculty', label: 'Faculty List', roles: ['ADMIN', 'HOD', 'FACULTY'] },
  { to: '/faculty/add', label: 'Add Faculty', roles: ['ADMIN', 'HOD'] },
  { to: '/performance', label: 'Performance', roles: ['ADMIN', 'HOD', 'FACULTY'] },
  { to: '/reports', label: 'Reports', roles: ['ADMIN', 'HOD', 'FACULTY'] },
  { to: '/profile', label: 'Profile', roles: ['ADMIN', 'HOD', 'FACULTY', 'STUDENT'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || '';
  const links = allLinks.filter((link) => link.roles.includes(role));

  return (
    <aside style={styles.aside}>
      <ul style={styles.ul}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
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
