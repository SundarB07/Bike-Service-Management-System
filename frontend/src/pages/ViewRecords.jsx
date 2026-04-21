import { useState, useEffect } from 'react';
import { getCustomers, getBikes, getMechanics, getServices, getPayments } from '../api/api';

const TABS = [
  { key: 'customers', label: '👤 Customers' },
  { key: 'bikes',     label: '🏍️ Bikes' },
  { key: 'mechanics', label: '🔧 Mechanics' },
  { key: 'services',  label: '⚙️ Services' },
  { key: 'payments',  label: '💳 Payments' },
];

export default function ViewRecords() {
  const [active, setActive] = useState('customers');
  const [data, setData]     = useState({
    customers: [], bikes: [], mechanics: [], services: [], payments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomers(), getBikes(), getMechanics(), getServices(), getPayments()])
      .then(([c, b, m, s, p]) => {
        setData({
          customers: c.data, bikes: b.data,
          mechanics: m.data, services: s.data, payments: p.data,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    Promise.all([getCustomers(), getBikes(), getMechanics(), getServices(), getPayments()])
      .then(([c, b, m, s, p]) => {
        setData({
          customers: c.data, bikes: b.data,
          mechanics: m.data, services: s.data, payments: p.data,
        });
      }).catch(() => {}).finally(() => setLoading(false));
  };

  const renderTable = () => {
    const rows = data[active];
    if (loading) return <div className="empty-state"><div className="spinner" /></div>;
    if (!rows.length) return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p className="empty-text">No records found in this table.</p>
      </div>
    );

    if (active === 'customers') return (
      <table><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Address</th></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.customerId}>
            <td><span className="badge badge-indigo">#{r.customerId}</span></td>
            <td className="td-primary">{r.name}</td>
            <td>{r.phone || '—'}</td><td>{r.address || '—'}</td>
          </tr>
        ))}</tbody>
      </table>
    );

    if (active === 'bikes') return (
      <table><thead><tr><th>ID</th><th>Reg No</th><th>Brand</th><th>Model</th><th>Owner</th></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.bikeId}>
            <td><span className="badge badge-purple">#{r.bikeId}</span></td>
            <td className="td-primary">{r.registrationNo}</td>
            <td>{r.brand || '—'}</td><td>{r.model || '—'}</td>
            <td>{r.customer?.name || '—'}</td>
          </tr>
        ))}</tbody>
      </table>
    );

    if (active === 'mechanics') return (
      <table><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Specialisation</th></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.mechanicId}>
            <td><span className="badge badge-green">#{r.mechanicId}</span></td>
            <td className="td-primary">{r.name}</td>
            <td>{r.phone || '—'}</td>
            <td>{r.specialisation
              ? <span className="badge badge-indigo">{r.specialisation}</span> : '—'}</td>
          </tr>
        ))}</tbody>
      </table>
    );

    if (active === 'services') return (
      <table><thead><tr>
        <th>ID</th><th>Date</th><th>Bike</th><th>Mechanic</th>
        <th>Type</th><th>Cost</th><th>Problem Desc</th>
      </tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.serviceId}>
            <td><span className="badge badge-orange">#{r.serviceId}</span></td>
            <td>{r.serviceDate || '—'}</td>
            <td className="td-primary">{r.bike?.registrationNo || '—'}</td>
            <td>{r.mechanic?.name || '—'}</td>
            <td><span className="badge badge-indigo">{r.serviceType || '—'}</span></td>
            <td>₹{r.cost?.toFixed(2) || '0.00'}</td>
            <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {r.problemDesc || '—'}
            </td>
          </tr>
        ))}</tbody>
      </table>
    );

    if (active === 'payments') return (
      <table><thead><tr>
        <th>ID</th><th>Date</th><th>Service ID</th><th>Service Type</th><th>Amount</th><th>Mode</th>
      </tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.paymentId}>
            <td><span className="badge badge-purple">#{r.paymentId}</span></td>
            <td>{r.paymentDate || '—'}</td>
            <td>#{r.service?.serviceId || '—'}</td>
            <td>{r.service?.serviceType || '—'}</td>
            <td className="td-primary">₹{r.amount?.toFixed(2) || '0.00'}</td>
            <td><span className="badge badge-green">{r.paymentMode || '—'}</span></td>
          </tr>
        ))}</tbody>
      </table>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">View Records</h1>
            <p className="page-subtitle">Browse all data across every table</p>
          </div>
          <button className="btn btn-ghost" onClick={refresh} disabled={loading}>
            {loading ? <span className="spinner" /> : '🔄'} Refresh
          </button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.key}
            className={`tab-btn ${active === t.key ? 'active' : ''}`}
            onClick={() => setActive(t.key)}>
            {t.label} ({data[t.key].length})
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">📋</div>
          {TABS.find(t => t.key === active)?.label} — {data[active].length} record(s)
        </div>
        <div className="table-wrapper">
          {renderTable()}
        </div>
      </div>
    </div>
  );
}
