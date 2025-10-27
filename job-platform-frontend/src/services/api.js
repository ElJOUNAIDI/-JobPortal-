import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const jobsAPI = {
  getAll: (params = {}) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: () => api.get('/employer/jobs'),
};

export const applicationsAPI = {
  getCandidateApplications: () => api.get('/candidate/applications'),
  apply: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  getEmployerApplications: () => api.get('/employer/applications'),
  updateStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
};

export const favoritesAPI = {
  getFavorites: () => api.get('/favorites'),
  toggleFavorite: (jobId) => api.post(`/jobs/${jobId}/favorite`),
  checkFavorite: (jobId) => api.get(`/jobs/${jobId}/favorite/check`),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, roleData) => api.put(`/admin/users/${id}/role`, roleData),
  getAllJobs: () => api.get('/admin/jobs'),
  getAllApplications: () => api.get('/admin/applications'),
  getStatistics: () => api.get('/admin/statistics'),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;