import axios from 'axios';

// ✅ CORRECTION : Enlever /api de l'URL de base
const API_BASE_URL = 'https://cisco-majunga-2025.onrender.com';

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

// Services API - Les routes incluent déjà /api
export const etablissementService = {
  // Services pour les établissements
  getEtablissements: () => api.get('/api/etablissements'),
  searchEtablissements: (params) => api.get('/api/etablissements/search', { params }),
  login: (credentials) => api.post('/api/etablissements/login', credentials),
  
  // Routes pour l'espace établissement
  getInscriptions: () => api.get('/api/etablissements/inscriptions'),
  createInscription: (data) => api.post('/api/etablissements/inscriptions', data),
  getExamens: () => api.get('/api/etablissements/examens'),
};

export const adminService = {
  login: (credentials) => api.post('/api/admin/login', credentials),
  getInscriptions: (params) => api.get('/api/admin/inscriptions', { params }),
  updateInscription: (id, data) => api.put(`/api/admin/inscriptions/${id}`, data),
  getStats: () => api.get('/api/admin/stats'),
};

// Services dépréciés - À utiliser etablissementService à la place
export const inscriptionService = {
  create: (data) => api.post('/api/etablissements/inscriptions', data),
  getEtablissementInscriptions: () => api.get('/api/etablissements/inscriptions'),
};

export const examenService = {
  getExamens: () => api.get('/api/examens'),
};

export const testService = {
  testDB: () => api.get('/api/test-db'),
};

export default api;