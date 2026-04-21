import { useState, useEffect } from 'react';
import { getMechanics, createMechanic, deleteMechanic } from '../api/api';

const EMPTY = { name: '', phone: '', specialisation: '' };

export default function AddMechanic() {
  const [form, setForm]         = useState(EMPTY);
  const [mechanics, setMechanics] = useState([]);
  const [alert, setAlert]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const fetchMechanics = () =>
    getMechanics().then(r => setMechanics(r.data)).catch(() => {});

  useEffect(() => { fetchMechanics(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) return showAlert('error', 'Name is required.');
    setLoading(true);
    try {
      await createMechanic(form);
      showAlert('success', `Mechanic "${form.name}" added successfully!`);
      setForm(EMPTY);
      fetchMechanics();
    } catch { showAlert('error', 'Failed to add mechanic.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this mechanic?')) return;
    try { await deleteMechanic(id); showAlert('success', 'Mechanic deleted.'); fetchMechanics(); }
    catch { showAlert('error', 'Delete failed.'); }
  };

  const specialisations = [
    'Engine Repair', 'Brake Service', 'Electrical & Wiring',
    'Tyre & Wheel', 'Suspension', 'Oil & Fluids', 'General Maintenance',
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Mechanic</h1>
        <p className="page-subtitle">Register a mechanic with their specialisation</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title">
          <div className="card-title-icon">🔧</div>
          Mechanic Details
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="mech-name">Full Name *</label>
              <input id="mech-name" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Arjun Singh" />
            </div>
            <div className="form-group">
              <label htmlFor="mech-phone">Phone Number</label>
              <input id="mech-phone" name="phone" value={form.phone}
                onChange={handleChange} placeholder="e.g. 9876543210" />
            </div>
            <div className="form-group">
              <label htmlFor="mech-spec">Specialisation</label>
              <select id="mech-spec" name="specialisation" value={form.specialisation}
                onChange={handleChange}>
                <option value="">— Select Specialisation —</option>
                {specialisations.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY)}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding…</> : '+ Add Mechanic'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">📋</div>
          All Mechanics ({mechanics.length})
        </div>
        {mechanics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔧</div>
            <p className="empty-text">No mechanics yet. Add one above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Phone</th><th>Specialisation</th><th>Action</th></tr>
              </thead>
              <tbody>
                {mechanics.map(m => (
                  <tr key={m.mechanicId}>
                    <td><span className="badge badge-green">#{m.mechanicId}</span></td>
                    <td className="td-primary">{m.name}</td>
                    <td>{m.phone || '—'}</td>
                    <td>{m.specialisation
                      ? <span className="badge badge-indigo">{m.specialisation}</span>
                      : '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(m.mechanicId)}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
