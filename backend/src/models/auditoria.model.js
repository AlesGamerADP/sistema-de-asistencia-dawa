/**
 * Modelo: Auditoría
 * 
 * Registra todas las operaciones importantes realizadas en el sistema
 * para trazabilidad y seguridad (quién hizo qué y cuándo).
 * 
 * @module models/auditoria.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Auditoria
 */
const Auditoria = sequelize.define('auditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del registro de auditoría'
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID del usuario que realizó la operación'
  },
  tabla_afectada: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Nombre de la tabla afectada'
  },
  operacion: {
    type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
    allowNull: false,
    comment: 'Tipo de operación realizada'
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha y hora de la operación'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada del cambio realizado'
  }
}, {
  tableName: 'auditoria',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de auditoría para trazabilidad de cambios',
  indexes: [
    {
      fields: ['usuario_id']
    },
    {
      fields: ['fecha']
    },
    {
      fields: ['tabla_afectada']
    },
    {
      fields: ['operacion']
    }
  ]
});

export default Auditoria;
