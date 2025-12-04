/**
 * Modelo: Turno
 * 
 * Representa los diferentes turnos u horarios laborales de la organización.
 * Ejemplo: Turno matutino (8:00-16:00), Turno vespertino (16:00-00:00), etc.
 * 
 * @module models/turno.model
 */

import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

/**
 * Definición del modelo Turno
 */
const Turno = sequelize.define('turnos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del turno'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Nombre descriptivo del turno'
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de entrada del turno'
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de salida del turno'
  }
}, {
  tableName: 'turnos',
  timestamps: false,
  underscored: true,
  comment: 'Tabla de turnos u horarios laborales',
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    }
  ]
});

export default Turno;
