/**
 * Componente Loader
 * 
 * Animación de carga profesional con skeleton y spinner
 * Se muestra durante la autenticación y transiciones
 * 
 * @module components/Loader
 */

import React from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Loader principal con animación
 */
export function Loader({ message = 'Cargando...', fullScreen = false }) {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClass}>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Spinner animado */}
        <motion.div
          className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Mensaje */}
        <motion.p
          className="text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}

/**
 * Login Skeleton
 * Skeleton específico para la pantalla de login
 */
export function LoginSkeleton() {
  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Logo skeleton */}
        <div className="flex justify-center mb-6">
          <Skeleton width={120} height={48} borderRadius={8} />
        </div>
        
        {/* Título */}
        <div className="text-center mb-4">
          <Skeleton width={200} height={28} className="mx-auto mb-2" />
          <Skeleton width={280} height={16} className="mx-auto" />
        </div>
        
        {/* Segmented Control */}
        <Skeleton height={40} borderRadius={8} className="mb-4" />
        
        {/* Formulario */}
        <div className="space-y-4">
          {/* Input 1 */}
          <div>
            <Skeleton width={80} height={16} className="mb-2" />
            <Skeleton height={48} borderRadius={8} />
          </div>
          
          {/* Input 2 */}
          <div>
            <Skeleton width={100} height={16} className="mb-2" />
            <Skeleton height={48} borderRadius={8} />
          </div>
          
          {/* Botón */}
          <Skeleton height={48} borderRadius={8} className="mt-6" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Button Spinner
 * Spinner pequeño para botones
 */
export function ButtonSpinner({ size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  
  return (
    <motion.div
      className={`${sizeClass} border-2 border-white border-t-transparent rounded-full inline-block`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export default Loader;
