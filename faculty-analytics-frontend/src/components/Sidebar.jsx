import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/faculty', label: 'Faculty List' },
  { to: '/faculty/add', label: 'Add Faculty' },
  { to: '/performance', label: 'Performance' },
  { to: '/reports', label: 'Reports' },
  { to: '/profile', label: 'Profile' },
];

export default function Sidebar() {
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
