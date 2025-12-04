/**
 * Zustand Store - Autenticación
 * 
 * Manejo global del estado de autenticación
 * Incluye información del usuario, rol y sesión activa
 * 
 * @module store/useAuthStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../api/auth';

/**
 * Store de autenticación con Zustand
 * Persiste el estado en localStorage automáticamente
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // ESTADO
      // ============================================
      
      /**
       * Usuario autenticado actual
       * @type {Object|null}
       */
      user: null,
      
      /**
       * Rol del usuario (admin, supervisor, empleado)
       * @type {string|null}
       */
      role: null,
      
      /**
       * Indica si el usuario está autenticado
       * @type {boolean}
       */
      isAuthenticated: false,
      
      /**
       * Indica si se está cargando una operación
       * @type {boolean}
       */
      isLoading: false,
      
      /**
       * Error de autenticación
       * @type {string|null}
       */
      error: null,

      // ============================================
      // ACCIONES
      // ============================================
      
      /**
       * Iniciar sesión
       * 
       * @param {string} username - Nombre de usuario
       * @param {string} password - Contraseña
       * @param {string} roleType - Tipo de rol (colaborador/administrador)
       * @returns {Promise<Object>} - Resultado del login
       */
      login: async (username, password, roleType = 'colaborador') => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiLogin(username, password, roleType);
          
          if (response.success && response.data) {
            const { user } = response.data;
            
            set({
              user,
              role: user.rol || roleType,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            return { success: true, user };
          } else {
            throw new Error(response.message || 'Error al iniciar sesión');
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
          
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false
          });
          
          return { success: false, error: errorMessage };
        }
      },
      
      /**
       * Cerrar sesión
       * Limpia todo el estado y localStorage
       */
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await apiLogout();
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          set({
            user: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },
      
      /**
       * Verificar sesión activa
       * Restaura la sesión desde localStorage si existe
       */
      checkSession: () => {
        const user = getCurrentUser();
        const token = localStorage.getItem('authToken');
        
        if (user && token) {
          set({
            user,
            role: user.rol,
            isAuthenticated: true,
            error: null
          });
          return true;
        } else {
          set({
            user: null,
            role: null,
            isAuthenticated: false
          });
          return false;
        }
      },
      
      /**
       * Limpiar error
       */
      clearError: () => {
        set({ error: null });
      },
      
      /**
       * Actualizar datos del usuario
       * 
       * @param {Object} userData - Nuevos datos del usuario
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
        
        // Actualizar también en localStorage
        const updatedUser = { ...get().user, ...userData };
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
      }
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
