// frontend/src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/admin_123';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Portfolio API
export const portfolioAPI = {
  getSections: async () => {
    const response = await api.get('/admin/portfolio/sections');
    return response.data;
  },
  updateSectionImage: async (sectionId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.put(`/admin/portfolio/sections/${sectionId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Gallery API
export const galleryAPI = {
  getAll: async () => {
    const response = await api.get('/galleries');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/admin/galleries', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/galleries/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/galleries/${id}`);
    return response.data;
  },
  uploadImage: async (galleryId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/admin/galleries/${galleryId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteImage: async (imageId: number) => {
    const response = await api.delete(`/admin/images/${imageId}`);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  getAll: async () => {
    const response = await api.get('/admin/contacts');
    return response.data;
  },
  markAsRead: async (id: number) => {
    const response = await api.patch(`/admin/contacts/${id}/read`);
    return response.data;
  },
  submit: async (data: any) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
};
