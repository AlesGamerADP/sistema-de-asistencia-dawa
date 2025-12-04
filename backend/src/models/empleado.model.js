/**
 * Modelo: Empleado
 * 
 * Representa a los empleados de la organización.
 * Cada empleado pertenece a un departamento y puede tener
 * múltiples registros de asistencia, justificaciones y turnos.
 * 
 * @module models/empleado.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Empleado
 */
const Empleado = sequelize.define('empleados', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del empleado'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del empleado'
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Apellido del empleado'
  },
  puesto: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Cargo o puesto laboral'
  },
  fecha_contratacion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha de contratación del empleado'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
    allowNull: false,
    comment: 'Estado actual del empleado'
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departamentos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID del departamento al que pertenece'
  },
  tipo_empleo: {
    type: DataTypes.STRING(50),
    defaultValue: 'Full-time',
    allowNull: true,
    comment: 'Tipo de empleo del empleado'
  },
  hora_entrada: {
    type: DataTypes.TIME,
    defaultValue: '09:00',
    allowNull: true,
    comment: 'Hora de entrada del empleado'
  },
  hora_salida: {
    type: DataTypes.TIME,
    defaultValue: '18:00',
    allowNull: true,
    comment: 'Hora de salida del empleado'
  }
}, {
  tableName: 'empleados',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de empleados de la organización',
  indexes: [
    {
      fields: ['departamento_id']
    },
    {
      fields: ['estado']
    }
  ]
});

export default Empleado;
