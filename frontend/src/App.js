/**
 * App - Componente Principal
 * 
 * Configura las rutas y la navegación de la aplicación
 * Incluye transiciones animadas entre páginas
 * 
 * @module App
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CollaboratorDashboard } from './pages/CollaboratorDashboard';
import useAuthStore from './store/useAuthStore';

/**
 * Componente de ruta protegida
 * Redirige al login si no está autenticado
 */
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return <Navigate to="/dashboard/colaborador" replace />;
  }

  return children;
}

/**
 * Componente principal de la aplicación
 */
function App() {
  const { checkSession } = useAuthStore();

  /**
   * Verificar sesión al montar el componente
   */
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
      {/* Toaster de Sonner para notificaciones */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand={false}
      />

      {/* Rutas de la aplicación */}
      <AnimatePresence mode="wait">
        <Routes>
          {/* Ruta: Login */}
          <Route path="/" element={<LoginPage />} />

          {/* Ruta: Dashboard de Colaborador (Protegida) */}
          <Route
            path="/dashboard/colaborador"
            element={
              <ProtectedRoute>
                <CollaboratorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta: Dashboard de Admin (Protegida) */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta: 404 - Redireccionar al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
