/**
 * Componentes Card
 * 
 * Sistema de tarjetas para contenedores de contenido
 * Card, CardHeader, CardTitle, CardDescription, CardContent
 * 
 * @module components/ui/card
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card Principal
 */
export function Card({ children, className = '', ...props }) {
  return (
    <motion.div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-lg 
        border border-gray-200 dark:border-gray-700
        overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Card Header
 */
export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`
        px-6 pt-6 pb-4
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Title
 */
export function CardTitle({ children, className = '', ...props }) {
  return (
    <motion.h2
      className={`
        text-2xl font-bold 
        text-gray-900 dark:text-gray-100
        ${className}
      `}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.h2>
  );
}

/**
 * Card Description
 */
export function CardDescription({ children, className = '', ...props }) {
  return (
    <motion.p
      className={`
        text-sm 
        text-gray-600 dark:text-gray-400 
        mt-2
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.p>
  );
}

/**
 * Card Content
 */
export function CardContent({ children, className = '', ...props }) {
  return (
    <div
      className={`
        px-6 pb-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
