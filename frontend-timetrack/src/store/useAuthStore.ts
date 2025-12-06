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

interface User {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string, roleType?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => boolean;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

/**
 * Store de autenticación con Zustand
 * Persiste el estado en localStorage automáticamente
 */
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ============================================
      // ESTADO
      // ============================================
      
      /**
       * Usuario autenticado actual
       */
      user: null,
      
      /**
       * Rol del usuario (admin, supervisor, empleado)
       */
      role: null,
      
      /**
       * Indica si el usuario está autenticado
       */
      isAuthenticated: false,
      
      /**
       * Indica si se está cargando una operación
       */
      isLoading: false,
      
      /**
       * Error de autenticación
       */
      error: null,

      // ============================================
      // ACCIONES
      // ============================================
      
      /**
       * Iniciar sesión
       * 
       * @param username - Nombre de usuario
       * @param password - Contraseña
       * @param roleType - Tipo de rol (colaborador/administrador)
       * @returns Resultado del login
       */
      login: async (username: string, password: string, roleType: string = 'colaborador') => {
        set({ isLoading: true, error: null });
        
        try {
          const response: any = await apiLogin(username, password, roleType);
          
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
        } catch (error: any) {
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
        const user = getCurrentUser() as User | null;
        const token = localStorage.getItem('authToken');
        
        if (user && token) {
          set({
            user,
            role: user.rol || null,
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
       * @param userData - Nuevos datos del usuario
       */
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: { ...state.user, ...userData } as User
        }));
        
        // Actualizar también en localStorage
        const updatedUser = { ...get().user, ...userData } as User;
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

