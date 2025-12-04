/**
 * Componente Button
 * 
 * Botón reutilizable con estilos profesionales
 * Soporta estados: default, loading, disabled
 * Soporta variantes: default, outline, ghost
 * 
 * @module components/ui/button
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.type - Tipo de botón (button, submit, reset)
 * @param {string} props.variant - Variante del botón (default, outline, ghost)
 * @param {string} props.size - Tamaño del botón (default, sm, lg)
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 */
export function Button({ 
  children, 
  className = '', 
  disabled = false, 
  type = 'button',
  variant = 'default',
  size = 'default',
  onClick,
  ...props 
}) {
  // Estilos base
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variantes
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-indigo-500',
    outline: 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-indigo-500'
  };
  
  // Tamaños
  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base'
  };
  
  const variantStyles = variants[variant] || variants.default;
  const sizeStyles = sizes[size] || sizes.default;
  
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
