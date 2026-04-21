import { useState, useEffect } from 'react';
import { getBikes, createBike, deleteBike, getCustomers } from '../api/api';

const EMPTY = { registrationNo: '', model: '', brand: '', customer: { customerId: '' } };

export default function AddBike() {
  const [form, setForm]       = useState(EMPTY);
  const [bikes, setBikes]     = useState([]);
  const [customers, setCustomers] = useState([]);
  const [alert, setAlert]     = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    getBikes().then(r => setBikes(r.data)).catch(() => {});
    getCustomers().then(r => setCustomers(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCustomer = e =>
    setForm(prev => ({ ...prev, customer: { customerId: parseInt(e.target.value) } }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.registrationNo.trim()) return showAlert('error', 'Registration number is required.');
    if (!form.customer.customerId) return showAlert('error', 'Please select a customer.');
    setLoading(true);
    try {
      await createBike(form);
      showAlert('success', `Bike "${form.registrationNo}" added successfully!`);
      setForm(EMPTY);
      fetchAll();
    } catch (err) {
      const msg = err.response?.status === 500
        ? 'Registration number may already exist.' : 'Failed to add bike.';
      showAlert('error', msg);
    } finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this bike?')) return;
    try { await deleteBike(id); showAlert('success', 'Bike deleted.'); fetchAll(); }
    catch { showAlert('error', 'Delete failed.'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Bike</h1>
        <p className="page-subtitle">Register a bike and link it to a customer</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title">
          <div className="card-title-icon">🏍️</div>
          Bike Details
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="bike-reg">Registration No *</label>
              <input id="bike-reg" name="registrationNo" value={form.registrationNo}
                onChange={handleChange} placeholder="e.g. KA01AB1234" />
            </div>
            <div className="form-group">
              <label htmlFor="bike-brand">Brand</label>
              <input id="bike-brand" name="brand" value={form.brand}
                onChange={handleChange} placeholder="e.g. Bajaj, Honda" />
            </div>
            <div className="form-group">
              <label htmlFor="bike-model">Model</label>
              <input id="bike-model" name="model" value={form.model}
                onChange={handleChange} placeholder="e.g. Pulsar 150" />
            </div>
            <div className="form-group">
              <label htmlFor="bike-customer">Owner (Customer) *</label>
              <select id="bike-customer" value={form.customer.customerId}
                onChange={handleCustomer}>
                <option value="">— Select Customer —</option>
                {customers.map(c => (
                  <option key={c.customerId} value={c.customerId}>
                    #{c.customerId} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY)}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding…</> : '+ Add Bike'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">📋</div>
          All Bikes ({bikes.length})
        </div>
        {bikes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏍️</div>
            <p className="empty-text">No bikes yet. Add one above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Reg No</th><th>Brand</th><th>Model</th><th>Owner</th><th>Action</th></tr>
              </thead>
              <tbody>
                {bikes.map(b => (
                  <tr key={b.bikeId}>
                    <td><span className="badge badge-purple">#{b.bikeId}</span></td>
                    <td className="td-primary">{b.registrationNo}</td>
                    <td>{b.brand || '—'}</td>
                    <td>{b.model || '—'}</td>
                    <td>{b.customer?.name || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(b.bikeId)}>🗑 Delete</button>
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
