/**
 * Configuración de Modelos y Relaciones
 * 
 * Este archivo centraliza la importación de todos los modelos
 * y define todas las relaciones entre ellos.
 * 
 * @module models/index
 */

import sequelize from '../database/index.js';

// Importar todos los modelos
import Departamento from './departamento.model.js';
import Empleado from './empleado.model.js';
import Registro from './registro.model.js';
import Usuario from './usuario.model.js';
import Auditoria from './auditoria.model.js';
import Justificacion from './justificacion.model.js';
import Turno from './turno.model.js';
import EmpleadoTurno from './empleado_turno.model.js';

// ============================================
// DEFINICIÓN DE RELACIONES ENTRE MODELOS
// ============================================

/**
 * Relaciones: Departamento <-> Empleado
 * Un departamento tiene muchos empleados
 * Un empleado pertenece a un departamento
 */
Departamento.hasMany(Empleado, {
  foreignKey: 'departamento_id',
  as: 'empleados',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Empleado.belongsTo(Departamento, {
  foreignKey: 'departamento_id',
  as: 'departamento'
});

/**
 * Relaciones: Empleado <-> Registro
 * Un empleado tiene muchos registros de asistencia
 * Un registro pertenece a un empleado
 */
Empleado.hasMany(Registro, {
  foreignKey: 'empleado_id',
  as: 'registros',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Registro.belongsTo(Empleado, {
  foreignKey: 'empleado_id',
  as: 'empleado'
});

/**
 * Relaciones: Empleado <-> Usuario (1:1)
 * Un empleado puede tener un usuario
 * Un usuario pertenece a un empleado
 */
Empleado.hasOne(Usuario, {
  foreignKey: 'empleado_id',
  as: 'usuario',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Usuario.belongsTo(Empleado, {
  foreignKey: 'empleado_id',
  as: 'empleado'
});

/**
 * Relaciones: Usuario <-> Auditoría
 * Un usuario puede generar muchos registros de auditoría
 * Un registro de auditoría pertenece a un usuario
 */
Usuario.hasMany(Auditoria, {
  foreignKey: 'usuario_id',
  as: 'auditorias',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Auditoria.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

/**
 * Relaciones: Empleado <-> Justificación
 * Un empleado puede tener muchas justificaciones
 * Una justificación pertenece a un empleado
 */
Empleado.hasMany(Justificacion, {
  foreignKey: 'empleado_id',
  as: 'justificaciones',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Justificacion.belongsTo(Empleado, {
  foreignKey: 'empleado_id',
  as: 'empleado'
});

/**
 * Relaciones: Usuario <-> Justificación (aprobador)
 * Un usuario puede aprobar/rechazar muchas justificaciones
 * Una justificación puede ser aprobada por un usuario
 */
Usuario.hasMany(Justificacion, {
  foreignKey: 'aprobado_por',
  as: 'justificaciones_aprobadas',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Justificacion.belongsTo(Usuario, {
  foreignKey: 'aprobado_por',
  as: 'aprobador'
});

/**
 * Relaciones: Empleado <-> EmpleadoTurno <-> Turno
 * Un empleado puede tener muchas asignaciones de turno
 * Un turno puede ser asignado a muchos empleados
 */
Empleado.hasMany(EmpleadoTurno, {
  foreignKey: 'empleado_id',
  as: 'asignaciones_turno',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

EmpleadoTurno.belongsTo(Empleado, {
  foreignKey: 'empleado_id',
  as: 'empleado'
});

Turno.hasMany(EmpleadoTurno, {
  foreignKey: 'turno_id',
  as: 'asignaciones',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

EmpleadoTurno.belongsTo(Turno, {
  foreignKey: 'turno_id',
  as: 'turno'
});

// ============================================
// EXPORTAR TODOS LOS MODELOS Y SEQUELIZE
// ============================================

const db = {
  sequelize,
  Departamento,
  Empleado,
  Registro,
  Usuario,
  Auditoria,
  Justificacion,
  Turno,
  EmpleadoTurno
};

export default db;
