import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token for admin endpoints
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productApi = {
  getProducts: (lang = 'en', currency = 'USD') =>
    api.get(`/products?lang=${lang}&currency=${currency}`),

  getProductDetail: (idOrSlug, lang = 'en', currency = 'USD') =>
    api.get(`/products/${idOrSlug}?lang=${lang}&currency=${currency}`),
};

export const paymentApi = {
  createPayOSPayment: (payload) =>
    api.post('/payments/payos/create-payment', payload),

  createStripeSession: (payload) =>
    api.post('/payments/stripe/create-session', payload),

  getOrderStatus: (orderId) =>
    api.get(`/orders/${orderId}/status`),

  simulatePayOSWebhook: (payload) =>
    api.post('/webhooks/payos', payload, {
      headers: { 'x-mock-test': 'true' },
    }),
};

export const adminApi = {
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getMetrics: () => api.get('/admin/metrics'),

  getOrders: () => api.get('/admin/orders'),

  createProduct: (payload) => api.post('/admin/products', payload),

  getProduct: (id) => api.get(`/admin/products/${id}`),

  updateProduct: (id, payload) => api.put(`/admin/products/${id}`, payload),

  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
