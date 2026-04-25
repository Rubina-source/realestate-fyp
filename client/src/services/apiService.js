import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};
export const adminService = {
  getPendingListings: (filters) => api.get('/admin/listings/pending', {
    params: filters
  }),
  getAllListings: (filters) => api.get('/admin/listings/all', {
    params: filters
  }),
  updatePropertyStatus: (id, data) => api.patch(`/admin/listings/${id}/status`, data),
  getAllUsers: (filters) => api.get('/admin/users', {
    params: filters
  }),
  updateUserRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
  getStats: () => api.get('/admin/stats'),
  getPendingBrokers: (filters) => api.get('/admin/brokers/pending', {
    params: filters
  }),
  getVerifiedBrokers: (filters) => api.get('/admin/brokers/verified', {
    params: filters
  }),
  getAllBrokers: (filters) => api.get('/admin/brokers/all', {
    params: filters
  }),
  verifyBroker: (id) => api.patch(`/admin/brokers/${id}/verify`),
  rejectBroker: (id) => api.patch(`/admin/brokers/${id}/reject`),
  getPropertyStats: () => api.get('/admin/property-stats'),
};

export const propertyService = {
  getAll: (filters) => api.get('/properties', {
    params: filters
  }),
  getById: (id) => api.get(`/properties/${id}`),
  generateDescription: (data) => api.post('/properties/generate-description', data),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getBrokerProperties: (filters) => api.get('/properties/broker/all', {
    params: filters
  }),
  getPublicBrokers: (filters) => api.get('/properties/brokers/public/all', {
    params: filters
  }),
  getPublicBrokerProfile: (brokerId, filters) => api.get(`/properties/brokers/public/${brokerId}`, {
    params: filters
  }),
};

export const cityService = {
  getAll: () => api.get('/cities'),
  create: (data) => api.post('/cities', data),
  update: (id, data) => api.put(`/cities/${id}`, data),
  delete: (id) => api.delete(`/cities/${id}`),
};

export const inquiryService = {
  create: (data) => api.post('/inquiries', data),
  getBrokerInquiries: (filters) => api.get('/inquiries', { params: filters }),
};

export const favoriteService = {
  getAll: (filters) => api.get('/favorites', {
    params: filters
  }),
  add: (propertyId) => api.post(`/favorites/${propertyId}`),
  remove: (propertyId) => api.delete(`/favorites/${propertyId}`),
  isFavorite: (propertyId) => api.get(`/favorites/${propertyId}/check`),
};

export const userService = {
  getHistory: (filters) => api.get('/users/history', {
    params: filters
  }),
};

export const notificationService = {
  getMyNotifications: (filters) => api.get('/notifications', {
    params: filters,
  }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};