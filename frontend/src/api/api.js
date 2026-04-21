import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Customers ──────────────────────────────────────────
export const getCustomers    = ()          => API.get('/customers');
export const getCustomerById = (id)        => API.get(`/customers/${id}`);
export const createCustomer  = (data)      => API.post('/customers', data);
export const updateCustomer  = (id, data)  => API.put(`/customers/${id}`, data);
export const deleteCustomer  = (id)        => API.delete(`/customers/${id}`);

// ── Bikes ───────────────────────────────────────────────
export const getBikes    = ()         => API.get('/bikes');
export const getBikeById = (id)       => API.get(`/bikes/${id}`);
export const createBike  = (data)     => API.post('/bikes', data);
export const updateBike  = (id, data) => API.put(`/bikes/${id}`, data);
export const deleteBike  = (id)       => API.delete(`/bikes/${id}`);

// ── Mechanics ───────────────────────────────────────────
export const getMechanics    = ()          => API.get('/mechanics');
export const getMechanicById = (id)        => API.get(`/mechanics/${id}`);
export const createMechanic  = (data)      => API.post('/mechanics', data);
export const updateMechanic  = (id, data)  => API.put(`/mechanics/${id}`, data);
export const deleteMechanic  = (id)        => API.delete(`/mechanics/${id}`);

// ── Services ────────────────────────────────────────────
export const getServices    = ()          => API.get('/services');
export const getServiceById = (id)        => API.get(`/services/${id}`);
export const createService  = (data)      => API.post('/services', data);
export const updateService  = (id, data)  => API.put(`/services/${id}`, data);
export const deleteService  = (id)        => API.delete(`/services/${id}`);

// ── Payments ────────────────────────────────────────────
export const getPayments    = ()          => API.get('/payments');
export const getPaymentById = (id)        => API.get(`/payments/${id}`);
export const createPayment  = (data)      => API.post('/payments', data);
export const updatePayment  = (id, data)  => API.put(`/payments/${id}`, data);
export const deletePayment  = (id)        => API.delete(`/payments/${id}`);
