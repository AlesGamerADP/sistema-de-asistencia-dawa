/**
 * Modelo: EmpleadoTurno
 * 
 * Tabla intermedia que representa la asignación de turnos a empleados.
 * Permite gestionar cambios de turno con fechas de inicio y fin.
 * 
 * @module models/empleado_turno.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo EmpleadoTurno
 */
const EmpleadoTurno = sequelize.define('empleado_turno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la asignación'
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
    comment: 'ID del empleado asignado al turno'
  },
  turno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'turnos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    comment: 'ID del turno asignado'
  },
  desde: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de inicio de la asignación'
  },
  hasta: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha de fin de la asignación (null = indefinido)'
  }
}, {
  tableName: 'empleado_turno',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de asignación de turnos a empleados',
  indexes: [
    {
      fields: ['empleado_id']
    },
    {
      fields: ['turno_id']
    },
    {
      fields: ['desde']
    },
    {
      fields: ['hasta']
    }
  ]
});

export default EmpleadoTurno;
