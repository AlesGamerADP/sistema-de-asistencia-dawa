/**
 * Componente RoleSwitch
 * 
 * Segmented Control estilo iOS para cambiar entre
 * formulario de Colaborador y Administrador
 * 
 * Incluye animación suave del "paddle" (fondo deslizante)
 * 
 * @module components/RoleSwitch
 */

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, ShieldCheck } from 'lucide-react';
import '../styles/role-switch.css';

/**
 * @param {Object} props
 * @param {string} props.selectedRole - Rol seleccionado actual ('colaborador' | 'administrador')
 * @param {Function} props.onRoleChange - Función callback al cambiar de rol
 */
export function RoleSwitch({ selectedRole, onRoleChange }) {
  const isColaborador = selectedRole === 'colaborador';

  return (
    <motion.div
      className="segmented-controls"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Opción: Colaborador */}
      <input
        id="role-colaborador"
        name="role"
        type="radio"
        checked={isColaborador}
        onChange={() => onRoleChange('colaborador')}
        className="sr-only"
      />
      <label
        htmlFor="role-colaborador"
        className={`role-label ${isColaborador ? 'active' : ''}`}
      >
        <UserCircle size={18} className="role-icon" />
        <span>Colaborador</span>
      </label>

      {/* Opción: Administrador */}
      <input
        id="role-administrador"
        name="role"
        type="radio"
        checked={!isColaborador}
        onChange={() => onRoleChange('administrador')}
        className="sr-only"
      />
      <label
        htmlFor="role-administrador"
        className={`role-label ${!isColaborador ? 'active' : ''}`}
      >
        <ShieldCheck size={18} className="role-icon" />
        <span>Administrador</span>
      </label>

      {/* Paddle animado (fondo deslizante) */}
      <div
        className="paddle"
        style={{
          transform: isColaborador ? 'translateX(0)' : 'translateX(100%)'
        }}
      />
    </motion.div>
  );
}

export default RoleSwitch;
