/**
 * LoginPage - Página de Inicio de Sesión
 * 
 * Diseño limpio y moderno basado en la imagen de referencia
 * 
 * @module pages/LoginPage
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LoginForm } from '../components/LoginForm';
import { RoleSwitch } from '../components/RoleSwitch';
import { LoginSkeleton } from '../components/Loader';
import useAuthStore from '../store/useAuthStore';
import '../styles/login.css';
import '../styles/background-transition.css';
import '../styles/login-page-fixes.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, role } = useAuthStore();
  
  const [selectedRole, setSelectedRole] = useState<'colaborador' | 'administrador'>('colaborador');
  const [showSkeleton, setShowSkeleton] = useState(false);

  /**
   * Prevenir scroll en la página de login
   */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('login-page-active');
      document.body.classList.add('login-page-active');
      
      return () => {
        document.documentElement.classList.remove('login-page-active');
        document.body.classList.remove('login-page-active');
      };
    }
  }, []);

  /**
   * Redirigir si ya está autenticado
   */
  useEffect(() => {
    if (isAuthenticated && role) {
      const dashboardPath = role === 'admin' 
        ? '/dashboard/admin' 
        : '/dashboard/colaborador';
      
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 800);
    }
  }, [isAuthenticated, role, navigate]);

  /**
   * Manejar cambio de rol
   */
  const handleRoleChange = (newRole: 'colaborador' | 'administrador') => {
    setSelectedRole(newRole);
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async ({ username, password }: { username: string; password: string }) => {
    try {
      setShowSkeleton(true);
      const result = await login(username, password, selectedRole);
      setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);

      if (result.success) {
        toast.success('¡Bienvenido!', {
          description: `Sesión iniciada como ${selectedRole}`,
        });

        setTimeout(() => {
          const dashboardPath = result.user?.rol === 'admin'
            ? '/dashboard/admin'
            : '/dashboard/colaborador';
          navigate(dashboardPath, { replace: true });
        }, 1500);
      } else {
        toast.error('Error al iniciar sesión', {
          description: result.error || 'Credenciales incorrectas',
        });
        setShowSkeleton(false);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      toast.error('Error de conexión', {
        description: 'No se pudo conectar al servidor. Verifica tu conexión.',
      });
      setShowSkeleton(false);
    }
  };

  return (
    <motion.div
      className={`login-background-container ${selectedRole === 'administrador' ? 'admin-mode' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-background-content w-full">
        <motion.div 
          className="login-container"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {showSkeleton || isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoginSkeleton />
              </motion.div>
            ) : (
              <motion.div 
                key="login-card"
                className="login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Logo - Superior izquierda */}
                <motion.div 
                  className="login-logo"
                  animate={{
                    color: selectedRole === 'administrador' ? '#9e9e9e' : '#81c784'
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <h1>EISB&M</h1>
                </motion.div>

                {/* Título */}
                <motion.h2 
                  className="login-title"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Registro de Horarios
                </motion.h2>
                
                {/* Subtítulo con animación al cambiar */}
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={selectedRole}
                    className="login-subtitle"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedRole === 'administrador' 
                      ? 'Panel de Administración' 
                      : 'Acceso para Colaboradores'}
                  </motion.p>
                </AnimatePresence>

                {/* Segmented Control */}
                <motion.div 
                  className="login-role-switch"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <RoleSwitch
                    selectedRole={selectedRole}
                    onRoleChange={handleRoleChange}
                  />
                </motion.div>

                {/* Formulario con transición */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`form-${selectedRole}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      roleType={selectedRole}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Export default para React Router (no para Next.js)
export default LoginPage;
