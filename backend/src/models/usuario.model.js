/**
 * Modelo: Usuario
 * 
 * Representa los usuarios del sistema con acceso a la aplicación.
 * Cada usuario está vinculado a un empleado y tiene un rol específico.
 * 
 * Relación 1:1 con Empleado (un empleado puede tener un usuario).
 * 
 * @module models/usuario.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Usuario
 */
const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del usuario'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Nombre de usuario para login (único)'
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Contraseña hasheada del usuario'
  },
  rol: {
    type: DataTypes.ENUM('admin', 'supervisor', 'empleado'),
    defaultValue: 'empleado',
    allowNull: false,
    comment: 'Rol del usuario en el sistema'
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    references: {
      model: 'empleados',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    comment: 'ID del empleado asociado a este usuario'
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de usuarios del sistema (autenticación)',
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['empleado_id']
    },
    {
      fields: ['rol']
    }
  ]
});

export default Usuario;
