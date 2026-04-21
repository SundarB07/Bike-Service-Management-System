import { useState, useEffect } from 'react';
import { getPayments, createPayment, deletePayment, getServices } from '../api/api';

const today = new Date().toISOString().split('T')[0];
const EMPTY = { paymentDate: today, amount: '', paymentMode: '', service: { serviceId: '' } };

const PAYMENT_MODES = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cheque'];

export default function AddPayment() {
  const [form, setForm]       = useState(EMPTY);
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [alert, setAlert]     = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    getPayments().then(r => setPayments(r.data)).catch(() => {});
    getServices().then(r => setServices(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleService = e =>
    setForm(prev => ({ ...prev, service: { serviceId: parseInt(e.target.value) } }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.service.serviceId) return showAlert('error', 'Please select a service.');
    if (!form.amount || isNaN(form.amount)) return showAlert('error', 'Enter a valid amount.');
    if (!form.paymentMode) return showAlert('error', 'Please select a payment mode.');
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      await createPayment(payload);
      showAlert('success', `Payment of ₹${form.amount} recorded successfully!`);
      setForm(EMPTY);
      fetchAll();
    } catch { showAlert('error', 'Failed to record payment.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this payment?')) return;
    try { await deletePayment(id); showAlert('success', 'Payment deleted.'); fetchAll(); }
    catch { showAlert('error', 'Delete failed.'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Payment</h1>
        <p className="page-subtitle">Record a payment against a completed service</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title">
          <div className="card-title-icon">💳</div>
          Payment Details
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="pay-service">Service *</label>
              <select id="pay-service" value={form.service.serviceId} onChange={handleService}>
                <option value="">— Select Service —</option>
                {services.map(s => (
                  <option key={s.serviceId} value={s.serviceId}>
                    #{s.serviceId} — {s.serviceType} | {s.bike?.registrationNo || 'N/A'} | ₹{s.cost?.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pay-amount">Amount (₹) *</label>
              <input id="pay-amount" name="amount" type="number" min="0" step="0.01"
                value={form.amount} onChange={handleChange} placeholder="e.g. 850.00" />
            </div>
            <div className="form-group">
              <label htmlFor="pay-mode">Payment Mode *</label>
              <select id="pay-mode" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                <option value="">— Select Mode —</option>
                {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pay-date">Payment Date</label>
              <input id="pay-date" name="paymentDate" type="date"
                value={form.paymentDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY)}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Recording…</> : '💳 Record Payment'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">📋</div>
          All Payments ({payments.length})
        </div>
        {payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <p className="empty-text">No payments yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Date</th><th>Service</th><th>Amount</th><th>Mode</th><th>Action</th></tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.paymentId}>
                    <td><span className="badge badge-purple">#{p.paymentId}</span></td>
                    <td>{p.paymentDate || '—'}</td>
                    <td>#{p.service?.serviceId} — {p.service?.serviceType || '—'}</td>
                    <td className="td-primary">₹{p.amount?.toFixed(2) || '0.00'}</td>
                    <td><span className="badge badge-green">{p.paymentMode || '—'}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.paymentId)}>🗑 Delete</button>
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
