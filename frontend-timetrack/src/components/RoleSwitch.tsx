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
    <div className="segmented-controls">
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
    </div>
  );
}

export default RoleSwitch;

