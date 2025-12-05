'use client';

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CollaboratorDashboard } from './pages/CollaboratorDashboard';
import useAuthStore from './store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return <Navigate to="/dashboard/colaborador" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { checkSession } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkSession();
  }, [checkSession]);

  if (!isMounted) {
    return null; // Render nothing on the server or until mounted on the client
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand={false}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard/colaborador"
            element={
              <ProtectedRoute>
                <CollaboratorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
