/**
 * Componente Label
 * 
 * Etiqueta para inputs con estilos consistentes
 * 
 * @module components/ui/label
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la etiqueta
 * @param {string} props.htmlFor - ID del input asociado
 * @param {string} props.className - Clases CSS adicionales
 */
export function Label({ children, htmlFor, className = '', ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        block text-sm font-medium 
        text-gray-700 dark:text-gray-300 
        mb-1
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
}
