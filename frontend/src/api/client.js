// src/api/client.js

import axios from "axios";
import useAuthStore from '../store/useAuthStore';
import { toast } from 'sonner';

const API_URL =
  process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://control-de-asistencias-timetrack.onrender.com/api"
    : "http://localhost:4000/api");


const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


client.interceptors.request.use((config) => {
  // soporta token en sessionStorage o localStorage
  const token = sessionStorage.getItem("token") || localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuesta para logout automático si el token expira
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpiar tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('token');
      // Logout global Zustand
      try {
        const logout = useAuthStore.getState().logout;
        if (typeof logout === 'function') logout();
      } catch (e) {}
      toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      // Redirigir al login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default client;
