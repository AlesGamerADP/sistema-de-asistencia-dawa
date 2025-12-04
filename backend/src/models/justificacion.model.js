/**
 * Modelo: Justificación
 * 
 * Representa las justificaciones de faltas, retardos o salidas tempranas.
 * Incluye el motivo, el estado de aprobación y quién lo aprobó.
 * 
 * @module models/justificacion.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Justificacion
 */
const Justificacion = sequelize.define('justificaciones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la justificación'
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    comment: 'ID del empleado que presenta la justificación'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de la falta, retardo o salida temprana'
  },
  tipo: {
    type: DataTypes.ENUM('falta', 'retardo', 'salida_temprano'),
    allowNull: false,
    comment: 'Tipo de justificación'
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Motivo o razón de la justificación'
  },
  aprobado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID del usuario que aprobó/rechazó la justificación'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    defaultValue: 'pendiente',
    allowNull: false,
    comment: 'Estado de la justificación'
  }
}, {
  tableName: 'justificaciones',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de justificaciones de faltas, retardos o salidas',
  indexes: [
    {
      fields: ['empleado_id']
    },
    {
      fields: ['fecha']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['aprobado_por']
    }
  ]
});

export default Justificacion;
