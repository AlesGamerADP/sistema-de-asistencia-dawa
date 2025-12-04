/**
 * LoginPage - Página de Inicio de Sesión
 * 
 * Pantalla principal con:
 * - Fondo animado con transición entre gradientes
 * - Segmented control para cambiar entre Colaborador/Administrador
 * - Formulario con animaciones suaves
 * - Login skeleton durante la carga
 * - Redirección animada al dashboard correspondiente
 * 
 * @module pages/LoginPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LoginForm } from '../components/LoginForm';
import { RoleSwitch } from '../components/RoleSwitch';
import { LoginSkeleton } from '../components/Loader';
import useAuthStore from '../store/useAuthStore';
import '../styles/login.css';
import '../styles/background-transition.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, role } = useAuthStore();
  
  const [selectedRole, setSelectedRole] = useState('colaborador');
  const [showSkeleton, setShowSkeleton] = useState(false);

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
  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async ({ username, password }) => {
    try {
      // Mostrar skeleton de carga
      setShowSkeleton(true);

      // Intentar login
      const result = await login(username, password, selectedRole);

      // Ocultar skeleton después de 1 segundo
      setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);

      if (result.success) {
        // Login exitoso
        toast.success('¡Bienvenido!', {
          description: `Sesión iniciada como ${selectedRole}`,
        });

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          const dashboardPath = result.user.rol === 'admin'
            ? '/dashboard/admin'
            : '/dashboard/colaborador';
          
          navigate(dashboardPath, { replace: true });
        }, 1500);
      } else {
        // Error en login
        toast.error('Credenciales incorrectas', {
          description: result.error || 'Por favor, verifica tu usuario y contraseña',
        });
      }
    } catch (error) {
      setShowSkeleton(false);
      toast.error('Error al iniciar sesión', {
        description: error.message || 'Ocurrió un error inesperado',
      });
    }
  };

  return (
    <motion.div
      className={`login-background-container ${selectedRole === 'administrador' ? 'admin-mode' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-background-content w-full">
        <div className="login-container">
        <AnimatePresence mode="wait">
          {showSkeleton || isLoading ? (
            <LoginSkeleton key="skeleton" />
          ) : (
            <motion.div
              key="form"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="space-y-1">
                  {/* Logo */}
                  <div className="flex items-center justify-center mb-4">
                    <motion.div 
                      className="text-white px-6 py-3 rounded-lg shadow-lg"
                      animate={{
                        backgroundColor: selectedRole === 'administrador' ? '#6B7280' : '#4ade80',
                        boxShadow: selectedRole === 'administrador' 
                          ? '0 10px 25px -5px rgba(107, 114, 128, 0.3)' 
                          : '0 10px 25px -5px rgba(74, 222, 128, 0.3)',
                      }}
                      transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <h1 className="text-2xl font-bold tracking-wide">EISB&M</h1>
                    </motion.div>
                  </div>

                  {/* Título */}
                  <CardTitle className="text-center bounce-title">
                    Registro de Horarios
                  </CardTitle>
                  
                  <motion.div
                    animate={{
                      opacity: [0.7, 1],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardDescription className="text-center">
                      {selectedRole === 'administrador' 
                        ? 'Panel de Administración' 
                        : 'Acceso para Colaboradores'}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent>
                  {/* Segmented Control - Cambio de Rol */}
                  <RoleSwitch
                    selectedRole={selectedRole}
                    onRoleChange={handleRoleChange}
                  />

                  {/* Formulario de Login */}
                  <LoginForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    roleType={selectedRole}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  );
}

export default LoginPage;
