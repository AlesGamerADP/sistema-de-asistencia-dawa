/**
 * API de Autenticación
 * 
 * Funciones para manejar login, logout y verificación de sesión
 * Conecta con el backend TimeTrack (Express + PostgreSQL)
 * 
 * @module api/auth
 */

import apiClient from './client';

/**
 * Iniciar sesión
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} contraseña - Contraseña del usuario
 * @param {string} role - Rol del usuario (colaborador/administrador)
 * @returns {Promise<Object>} - Datos del usuario autenticado
 */
export const login = async (username, contraseña, role = 'colaborador') => {
  try {
    // Mapear roles del frontend a roles del backend
    const roleMap = {
      'colaborador': 'empleado',
      'administrador': 'admin'
    };
    
    const backendRole = roleMap[role] || role;

    const response = await apiClient.post('/usuarios/login', {
      username,
      contraseña,
      role: backendRole  // Enviar el rol mapeado
    });

    const { data } = response;

    // Guardar token y datos del usuario en localStorage
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('authUser', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Cerrar sesión
 * 
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiClient.post('/usuarios/logout');
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar datos locales siempre
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
};

/**
 * Verificar sesión actual
 * Comprueba si el token es válido
 * 
 * @returns {Promise<Object>} - Datos del usuario si la sesión es válida
 */
export const verifySession = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    const response = await apiClient.get('/usuarios/verify');
    return response.data;
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    throw error;
  }
};

/**
 * Obtener usuario desde localStorage
 * 
 * @returns {Object|null} - Datos del usuario o null si no existe
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('authUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    return null;
  }
};
