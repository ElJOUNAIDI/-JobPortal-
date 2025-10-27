// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Instance axios pour les requêtes API
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // IMPORTANT: pour les cookies de session
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Instance séparée pour Sanctum (CSRF)
const sanctum = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Fonction pour récupérer le token CSRF
const getCsrfToken = async () => {
  try {
    await sanctum.get('/sanctum/csrf-cookie');
    console.log('CSRF token obtained successfully');
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
};

// Intercepteur pour les requêtes API
api.interceptors.request.use(
  async (config) => {
    // Pour les requêtes non-GET, s'assurer d'avoir un token CSRF
    if (config.method !== 'get') {
      await getCsrfToken();
    }
    
    // Ajouter le token d'authentification
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

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      console.log('Authentication error, redirecting to login...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Récupérer d'abord le CSRF token, puis faire la requête
  login: async (credentials) => {
    await getCsrfToken();
    return api.post('/login', credentials);
  },
  register: async (userData) => {
    await getCsrfToken();
    return api.post('/register', userData);
  },
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
};

export default api;