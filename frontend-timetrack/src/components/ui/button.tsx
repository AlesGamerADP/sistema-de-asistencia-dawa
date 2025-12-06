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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
}

/**
 * Componente de botón
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
}: ButtonProps) {
  // Estilos base
  const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variantes
  const variants = {
    default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:outline-none'
  };
  
  // Tamaños
  const sizes = {
    default: 'px-5 py-2.5 text-sm',
    sm: 'px-3.5 py-2 text-xs',
    lg: 'px-6 py-3 text-base'
  };
  
  const variantStyles = variants[variant] || variants.default;
  const sizeStyles = sizes[size] || sizes.default;
  
  // Excluir onDrag de las props para evitar conflicto con Framer Motion
  const { onDrag, ...restProps } = props as any;
  
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.02, y: -1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      {...restProps}
    >
      {children}
    </motion.button>
  );
}

