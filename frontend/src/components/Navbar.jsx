import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',             icon: '🏠', label: 'Dashboard' },
  { to: '/add-customer', icon: '👤', label: 'Add Customer' },
  { to: '/add-bike',     icon: '🏍️', label: 'Add Bike' },
  { to: '/add-mechanic', icon: '🔧', label: 'Add Mechanic' },
  { to: '/add-service',  icon: '⚙️', label: 'Add Service' },
  { to: '/add-payment',  icon: '💳', label: 'Add Payment' },
  { to: '/view-records', icon: '📋', label: 'View Records' },
];

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/" className="brand-logo">
          <div className="brand-icon">🏍️</div>
          <div className="brand-text">
            <span className="brand-name">BikeServ</span>
            <span className="brand-tagline">Service Management</span>
          </div>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">Navigation</p>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>BikeServ v1.0</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>API: localhost:8080</p>
      </div>
    </aside>
  );
}
