import { useState, useEffect } from 'react';
import { getServices, createService, deleteService, getBikes, getMechanics } from '../api/api';

const today = new Date().toISOString().split('T')[0];
const EMPTY = {
  serviceDate: today,
  serviceType: '',
  cost: '',
  problemDesc: '',
  bike: { bikeId: '' },
  mechanic: { mechanicId: '' },
};

const SERVICE_TYPES = [
  'Oil Change', 'Engine Tune-up', 'Brake Adjustment', 'Tyre Replacement',
  'Chain Lubrication', 'Battery Replacement', 'Full Service', 'Electrical Repair',
  'Suspension Check', 'Custom',
];

export default function AddService() {
  const [form, setForm]       = useState(EMPTY);
  const [services, setServices] = useState([]);
  const [bikes, setBikes]     = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [alert, setAlert]     = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    getServices().then(r => setServices(r.data)).catch(() => {});
    getBikes().then(r => setBikes(r.data)).catch(() => {});
    getMechanics().then(r => setMechanics(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBike = e =>
    setForm(prev => ({ ...prev, bike: { bikeId: parseInt(e.target.value) } }));

  const handleMechanic = e =>
    setForm(prev => ({ ...prev, mechanic: { mechanicId: parseInt(e.target.value) } }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.bike.bikeId)     return showAlert('error', 'Please select a bike.');
    if (!form.mechanic.mechanicId) return showAlert('error', 'Please select a mechanic.');
    if (!form.serviceType)     return showAlert('error', 'Please select a service type.');
    if (!form.cost || isNaN(form.cost)) return showAlert('error', 'Enter a valid cost.');
    setLoading(true);
    try {
      const payload = { ...form, cost: parseFloat(form.cost) };
      await createService(payload);
      showAlert('success', `Service "${form.serviceType}" logged successfully!`);
      setForm(EMPTY);
      fetchAll();
    } catch { showAlert('error', 'Failed to add service. Check backend connection.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this service record?')) return;
    try { await deleteService(id); showAlert('success', 'Service deleted.'); fetchAll(); }
    catch { showAlert('error', 'Delete failed. A payment may be linked to this service.'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Service</h1>
        <p className="page-subtitle">Log a new service job — link a bike and mechanic</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title">
          <div className="card-title-icon">⚙️</div>
          Service Details
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Bike dropdown */}
            <div className="form-group">
              <label htmlFor="svc-bike">Bike (Registration No) *</label>
              <select id="svc-bike" value={form.bike.bikeId} onChange={handleBike}>
                <option value="">— Select Bike —</option>
                {bikes.map(b => (
                  <option key={b.bikeId} value={b.bikeId}>
                    #{b.bikeId} — {b.registrationNo} ({b.brand} {b.model})
                  </option>
                ))}
              </select>
            </div>

            {/* Mechanic dropdown */}
            <div className="form-group">
              <label htmlFor="svc-mech">Mechanic *</label>
              <select id="svc-mech" value={form.mechanic.mechanicId} onChange={handleMechanic}>
                <option value="">— Select Mechanic —</option>
                {mechanics.map(m => (
                  <option key={m.mechanicId} value={m.mechanicId}>
                    #{m.mechanicId} — {m.name} ({m.specialisation || 'General'})
                  </option>
                ))}
              </select>
            </div>

            {/* Service type */}
            <div className="form-group">
              <label htmlFor="svc-type">Service Type *</label>
              <select id="svc-type" name="serviceType" value={form.serviceType} onChange={handleChange}>
                <option value="">— Select Type —</option>
                {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Cost */}
            <div className="form-group">
              <label htmlFor="svc-cost">Cost (₹) *</label>
              <input id="svc-cost" name="cost" type="number" min="0" step="0.01"
                value={form.cost} onChange={handleChange} placeholder="e.g. 850.00" />
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="svc-date">Service Date</label>
              <input id="svc-date" name="serviceDate" type="date"
                value={form.serviceDate} onChange={handleChange} />
            </div>

            {/* Problem desc */}
            <div className="form-group full-width">
              <label htmlFor="svc-prob">Problem Description</label>
              <textarea id="svc-prob" name="problemDesc" value={form.problemDesc}
                onChange={handleChange}
                placeholder="Describe the problem or work requested…" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost"
              onClick={() => setForm(EMPTY)}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Logging…</> : '⚙️ Log Service'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">📋</div>
          All Services ({services.length})
        </div>
        {services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚙️</div>
            <p className="empty-text">No service records yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Date</th><th>Bike</th><th>Mechanic</th>
                  <th>Type</th><th>Cost</th><th>Problem</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.serviceId}>
                    <td><span className="badge badge-orange">#{s.serviceId}</span></td>
                    <td>{s.serviceDate || '—'}</td>
                    <td className="td-primary">{s.bike?.registrationNo || '—'}</td>
                    <td>{s.mechanic?.name || '—'}</td>
                    <td><span className="badge badge-indigo">{s.serviceType || '—'}</span></td>
                    <td>₹{s.cost?.toFixed(2) || '0.00'}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.problemDesc || '—'}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(s.serviceId)}>🗑 Delete</button>
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
