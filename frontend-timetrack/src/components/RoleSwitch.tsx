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

interface RoleSwitchProps {
  selectedRole: 'colaborador' | 'administrador';
  onRoleChange: (role: 'colaborador' | 'administrador') => void;
}

/**
 * Componente de cambio de rol
 */
export function RoleSwitch({ selectedRole, onRoleChange }: RoleSwitchProps) {
  const isColaborador = selectedRole === 'colaborador';

  return (
    <div className="segmented-controls relative">
      {/* Fondo animado deslizante */}
      <motion.div
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-lg"
        initial={false}
        animate={{
          x: isColaborador ? '0%' : '100%',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
          mass: 0.8,
        }}
      />

      {/* Opción: Colaborador */}
      <motion.button
        type="button"
        onClick={() => onRoleChange('colaborador')}
        className={`role-label relative z-10 ${isColaborador ? 'active' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{
            scale: isColaborador ? 1.1 : 1,
            color: isColaborador ? '#ffffff' : '#64748b',
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <UserCircle size={18} className="role-icon" />
          <span className="font-medium">Colaborador</span>
        </motion.div>
      </motion.button>

      {/* Opción: Administrador */}
      <motion.button
        type="button"
        onClick={() => onRoleChange('administrador')}
        className={`role-label relative z-10 ${!isColaborador ? 'active' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{
            scale: !isColaborador ? 1.1 : 1,
            color: !isColaborador ? '#ffffff' : '#64748b',
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <ShieldCheck size={18} className="role-icon" />
          <span className="font-medium">Administrador</span>
        </motion.div>
      </motion.button>
    </div>
  );
}

export default RoleSwitch;

