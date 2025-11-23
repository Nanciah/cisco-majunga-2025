import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration axios avec intercepteur pour le token
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Services API
export const etablissementService = {
  getEtablissements: () => api.get('/etablissements'),
  searchEtablissements: (params) => api.get('/etablissements/search', { params }),
  login: (credentials) => api.post('/etablissements/login', credentials),
};

export const adminService = {
  login: (credentials) => api.post('/admin/login', credentials),
  getInscriptions: (params) => api.get('/admin/inscriptions', { params }),
  updateInscription: (id, data) => api.put(`/admin/inscriptions/${id}`, data),
  getStats: () => api.get('/admin/stats'),
};

export const inscriptionService = {
  create: (data) => api.post('/inscriptions', data),
  getEtablissementInscriptions: () => api.get('/etablissement/inscriptions'),
};

export const examenService = {
  getExamens: () => api.get('/examens'),
};

export const testService = {
  testDB: () => api.get('/test-db'),
};

export default api;