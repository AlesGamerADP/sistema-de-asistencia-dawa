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
 * Usuarios de prueba para desarrollo local
 * Solo funcionan cuando el backend no está disponible o en modo desarrollo
 */
const MOCK_USERS = {
  colaborador: {
    username: 'colaborador',
    password: 'colab123',
    user: {
      id: 1,
      username: 'colaborador',
      email: 'colaborador@timetrack.com',
      rol: 'empleado',
      empleado_id: 1,
      empleado: {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        puesto: 'Desarrollador',
        hora_entrada: '09:00',
        hora_salida: '18:00',
        tipo_empleo: 'Tiempo Completo',
        departamento: {
          id: 1,
          nombre: 'Desarrollo'
        }
      }
    }
  },
  administrador: {
    username: 'admin',
    password: 'admin123',
    user: {
      id: 2,
      username: 'admin',
      email: 'admin@timetrack.com',
      rol: 'admin',
      empleado_id: null,
      empleado: null
    }
  }
};

/**
 * Verificar si estamos en modo desarrollo local
 */
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Generar un token JWT mock simple para desarrollo
 */
const generateMockToken = (userId, username, rol) => {
  // Token simple para desarrollo (no es un JWT real)
  const payload = {
    id: userId,
    username,
    rol,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  return `mock_token_${btoa(JSON.stringify(payload))}`;
};

/**
 * Autenticación mock para usuarios de prueba
 */
const mockLogin = (username, password, role) => {
  // Buscar usuario en los usuarios mock
  const roleKey = role === 'administrador' ? 'administrador' : 'colaborador';
  const mockUser = MOCK_USERS[roleKey];

  if (!mockUser) {
    throw new Error('Rol no válido para usuarios de prueba');
  }

  // Verificar credenciales
  if (username !== mockUser.username || password !== mockUser.password) {
    throw new Error('Credenciales incorrectas');
  }

  // Verificar que el rol coincida
  if (role === 'administrador' && mockUser.user.rol !== 'admin') {
    throw new Error('No tienes permisos para acceder como administrador');
  }

  if (role === 'colaborador' && mockUser.user.rol !== 'empleado') {
    throw new Error('No tienes permisos para acceder como colaborador');
  }

  // Generar token mock
  const token = generateMockToken(
    mockUser.user.id,
    mockUser.user.username,
    mockUser.user.rol
  );

  return {
    success: true,
    message: 'Login exitoso (modo desarrollo)',
    data: {
      user: mockUser.user,
      token
    }
  };
};

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

    // Intentar login con el backend primero
    try {
      console.log('🔐 Intentando login:', { username, role: backendRole });
      
      const response = await apiClient.post('/usuarios/login', {
        username,
        contraseña,
        role: backendRole  // Enviar el rol mapeado
      });

      console.log('✅ Login exitoso:', response.data);

      const { data } = response;

      // Guardar token y datos del usuario en localStorage
      if (data.success && data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('authUser', JSON.stringify(data.data.user));
      }

      return data;
    } catch (backendError) {
      console.error('❌ Error en login:', {
        status: backendError.response?.status,
        statusText: backendError.response?.statusText,
        message: backendError.message,
        data: backendError.response?.data
      });

      // Si es error 403, mostrar mensaje específico
      if (backendError.response?.status === 403) {
        throw new Error('Acceso denegado. Verifica tus credenciales o contacta al administrador.');
      }

      // Si el backend no está disponible o hay error de red, usar usuarios mock (solo en desarrollo)
      if (isDevelopment && (backendError.code === 'ECONNABORTED' || backendError.message === 'Network Error')) {
        console.warn('⚠️ Backend no disponible. Usando usuarios de prueba locales...');
        
        const mockResponse = mockLogin(username, contraseña, role);
        
        // Guardar token y datos del usuario en localStorage
        if (mockResponse.success && mockResponse.data.token) {
          localStorage.setItem('authToken', mockResponse.data.token);
          localStorage.setItem('authUser', JSON.stringify(mockResponse.data.user));
          localStorage.setItem('isMockUser', 'true'); // Marcar como usuario mock
        }
        
        return mockResponse;
      }
      
      // Si no es un error de red o no estamos en desarrollo, lanzar el error
      throw backendError;
    }
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
    // Solo intentar logout en el backend si no es un usuario mock
    const isMockUser = localStorage.getItem('isMockUser');
    if (!isMockUser) {
      await apiClient.post('/usuarios/logout');
    }
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar datos locales siempre
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('isMockUser');
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
  // Verificar que estamos en el cliente
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userStr = localStorage.getItem('authUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    return null;
  }
};
