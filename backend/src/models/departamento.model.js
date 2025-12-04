/**
 * Modelo: Departamento
 * 
 * Representa los departamentos o áreas de la organización.
 * Un departamento puede tener múltiples empleados asignados.
 * 
 * @module models/departamento.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Departamento
 */
const Departamento = sequelize.define('departamentos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del departamento'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Nombre del departamento'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada del departamento'
  }
}, {
  tableName: 'departamentos',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de departamentos o áreas de la organización'
});

export default Departamento;
