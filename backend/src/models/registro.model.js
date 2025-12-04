/**
 * Modelo: Registro
 * 
 * Representa los registros diarios de asistencia de los empleados.
 * Almacena las horas de entrada y salida, así como observaciones.
 * 
 * Restricción única: Un empleado solo puede tener un registro por día.
 * 
 * @module models/registro.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Registro
 */
const Registro = sequelize.define('registros', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del registro'
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
    comment: 'ID del empleado que registra asistencia'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha del registro de asistencia'
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Hora de entrada del empleado'
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Hora de salida del empleado'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones o notas sobre el registro'
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de eliminación lógica (soft delete)'
  }
}, {
  tableName: 'registros',
  timestamps: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  comment: 'Tabla de registros diarios de asistencia',
  indexes: [
    {
      unique: true,
      fields: ['empleado_id', 'fecha'],
      name: 'unique_empleado_fecha',
      where: {
        deleted_at: null // Solo aplicar restricción única a registros NO eliminados
      }
    },
    {
      fields: ['fecha']
    },
    {
      fields: ['empleado_id']
    }
  ]
});

export default Registro;
