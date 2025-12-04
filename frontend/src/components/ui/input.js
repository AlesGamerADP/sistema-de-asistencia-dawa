/**
 * Componente Input
 * 
 * Campo de entrada reutilizable con animaciones
 * Soporta diferentes tipos: text, password, email, etc.
 * 
 * @module components/ui/input
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * @param {Object} props
 * @param {string} props.type - Tipo de input
 * @param {string} props.placeholder - Texto placeholder
 * @param {string} props.value - Valor del input
 * @param {Function} props.onChange - Función onChange
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.required - Si el campo es requerido
 */
export function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  required = false,
  id,
  ...props
}) {
  return (
    <motion.input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-full px-4 py-3 rounded-lg 
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-700
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        dark:focus:ring-indigo-400
        transition-all duration-200
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        ${className}
      `}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  );
}
