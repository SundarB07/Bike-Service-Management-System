import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from '../api/api';

const EMPTY = { name: '', phone: '', address: '' };

export default function AddCustomer() {
  const [form, setForm]       = useState(EMPTY);
  const [customers, setCustomers] = useState([]);
  const [alert, setAlert]     = useState(null); // { type, msg }
  const [loading, setLoading] = useState(false);

  const fetchCustomers = () =>
    getCustomers().then(r => setCustomers(r.data)).catch(() => {});

  useEffect(() => { fetchCustomers(); }, []);

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
      await createCustomer(form);
      showAlert('success', `Customer "${form.name}" added successfully!`);
      setForm(EMPTY);
      fetchCustomers();
    } catch {
      showAlert('error', 'Failed to add customer. Is the backend running?');
    } finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      showAlert('success', 'Customer deleted.');
      fetchCustomers();
    } catch { showAlert('error', 'Delete failed.'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Customer</h1>
        <p className="page-subtitle">Register a new customer into the system</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title">
          <div className="card-title-icon">👤</div>
          Customer Details
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cust-name">Full Name *</label>
              <input id="cust-name" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Ravi Kumar" />
            </div>
            <div className="form-group">
              <label htmlFor="cust-phone">Phone Number</label>
              <input id="cust-phone" name="phone" value={form.phone}
                onChange={handleChange} placeholder="e.g. 9876543210" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="cust-address">Address</label>
              <input id="cust-address" name="address" value={form.address}
                onChange={handleChange} placeholder="e.g. 12 MG Road, Bengaluru" />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost"
              onClick={() => setForm(EMPTY)}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding…</> : '+ Add Customer'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">📋</div>
          All Customers ({customers.length})
        </div>
        {customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p className="empty-text">No customers yet. Add one above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Phone</th><th>Address</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.customerId}>
                    <td><span className="badge badge-indigo">#{c.customerId}</span></td>
                    <td className="td-primary">{c.name}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.address || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.customerId)}>🗑 Delete</button>
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
