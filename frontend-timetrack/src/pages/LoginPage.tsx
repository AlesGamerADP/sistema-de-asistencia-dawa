/**
 * LoginPage - Página de Inicio de Sesión
 * 
 * Diseño limpio y moderno basado en la imagen de referencia
 * 
 * @module pages/LoginPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    document.documentElement.classList.add('login-page-active');
    document.body.classList.add('login-page-active');
    
    return () => {
      document.documentElement.classList.remove('login-page-active');
      document.body.classList.remove('login-page-active');
    };
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
    <div
      className={`login-background-container ${selectedRole === 'administrador' ? 'admin-mode' : ''}`}
    >
      <div className="login-background-content w-full">
        <div className="login-container">
          {showSkeleton || isLoading ? (
            <LoginSkeleton />
          ) : (
            <div className="login-card">
              {/* Logo - Superior izquierda */}
              <div className="login-logo">
                <h1 
                  style={{ 
                    color: selectedRole === 'administrador' ? '#9e9e9e' : '#81c784'
                  }}
                >
                  EISB&M
                </h1>
              </div>

              {/* Título */}
              <h2 className="login-title">
                Registro de Horarios
              </h2>
              
              {/* Subtítulo */}
              <p className="login-subtitle">
                {selectedRole === 'administrador' 
                  ? 'Panel de Administración' 
                  : 'Acceso para Colaboradores'}
              </p>

              {/* Segmented Control */}
              <div className="login-role-switch">
                <RoleSwitch
                  selectedRole={selectedRole}
                  onRoleChange={handleRoleChange}
                />
              </div>

              {/* Formulario */}
              <LoginForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                roleType={selectedRole}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
