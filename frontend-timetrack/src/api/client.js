// src/api/client.js

import axios from "axios";
import useAuthStore from '../store/useAuthStore';
import { toast } from 'sonner';

// En Next.js, las variables de entorno del cliente deben tener el prefijo NEXT_PUBLIC_
// Detectar si estamos en desarrollo o producción
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (isDevelopment
    ? "http://localhost:4000/api"
    : "https://control-de-asistencias-timetrack.onrender.com/api");

// Log para debugging (solo en desarrollo)
if (isDevelopment && typeof window !== 'undefined') {
  console.log('🔗 API URL configurada:', API_URL);
}

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
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
    // Manejar errores de red (backend no disponible)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️ Timeout: El servidor tardó demasiado en responder');
        toast.error('El servidor tardó demasiado en responder. Verifica tu conexión.');
      } else if (error.message === 'Network Error') {
        console.error('🌐 Error de red: No se pudo conectar al servidor');
        console.error('📍 URL intentada:', API_URL);
        toast.error('No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo en ' + API_URL);
      } else {
        console.error('❌ Error de red:', error.message);
        toast.error('Error de conexión: ' + error.message);
      }
      return Promise.reject(error);
    }

    // Manejar errores HTTP
    if (error.response.status === 401) {
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
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
