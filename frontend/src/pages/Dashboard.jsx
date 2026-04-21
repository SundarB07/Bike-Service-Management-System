import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, getBikes, getMechanics, getServices, getPayments } from '../api/api';

const quickActions = [
  { to: '/add-customer', icon: '👤', title: 'Add Customer',  desc: 'Register a new customer into the system.' },
  { to: '/add-bike',     icon: '🏍️', title: 'Add Bike',      desc: 'Add a bike and link it to a customer.' },
  { to: '/add-mechanic', icon: '🔧', title: 'Add Mechanic',  desc: 'Register a mechanic with their specialisation.' },
  { to: '/add-service',  icon: '⚙️', title: 'Add Service',   desc: 'Log a new service job — the core feature.' },
  { to: '/add-payment',  icon: '💳', title: 'Add Payment',   desc: 'Record payment against a service job.' },
  { to: '/view-records', icon: '📋', title: 'View Records',  desc: 'Browse all tables in a unified view.' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({ customers: 0, bikes: 0, mechanics: 0, services: 0, payments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomers(), getBikes(), getMechanics(), getServices(), getPayments()])
      .then(([c, b, m, s, p]) => {
        setCounts({
          customers: c.data.length,
          bikes:     b.data.length,
          mechanics: m.data.length,
          services:  s.data.length,
          payments:  p.data.length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Customers',  value: counts.customers, icon: '👤', cls: 'indigo' },
    { label: 'Bikes',      value: counts.bikes,     icon: '🏍️', cls: 'purple' },
    { label: 'Mechanics',  value: counts.mechanics, icon: '🔧', cls: 'green' },
    { label: 'Services',   value: counts.services,  icon: '⚙️', cls: 'orange' },
    { label: 'Payments',   value: counts.payments,  icon: '💳', cls: 'pink' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to BikeServ — your complete bike service management system</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">🚀</div>
          Quick Actions
        </div>
        <div className="dashboard-grid">
          {quickActions.map(qa => (
            <Link key={qa.to} to={qa.to} className="quick-action-card">
              <div className="qa-header">
                <div className="qa-icon">{qa.icon}</div>
                <div className="qa-title">{qa.title}</div>
              </div>
              <p className="qa-desc">{qa.desc}</p>
              <div className="qa-arrow">Go to {qa.title} →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
