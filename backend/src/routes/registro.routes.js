/**
 * Rutas de Registros de Asistencia
 * 
 * Define todos los endpoints relacionados con registros de entrada/salida.
 * 
 * @module routes/registro.routes
 */

import express from 'express';
import {
  // Nuevas funciones para empleados
  marcarAsistencia,
  getEstadoActual,
  getMiHistorial,
  marcarEntradaJustificada,
  marcarSalidaJustificada,
  marcarSalidaIncidente,

  // Funciones existentes
  getAllRegistros,
  getRegistroById,
  createRegistro,
  updateRegistro,
  deleteRegistro,
  getRegistrosByRangoFechas,
  getRegistrosEliminados,
  restaurarRegistro,
  eliminarRegistroPermanente,
  registrarEntrada, // Se mantiene por si se usa en otro lado, pero es legacy
  registrarSalida   // Se mantiene por si se usa en otro lado, pero es legacy
} from '../controllers/registro.controller.js';

import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ============================================
// RUTAS PARA EMPLEADOS (NUEVA FUNCIONALIDAD)
// ============================================

/**
 * @route   POST /api/registros/marcar
 * @desc    Permite a un empleado autenticado marcar su entrada o salida.
 * @access  Private (Empleado)
 */
router.post('/marcar', protect, marcarAsistencia);

/**
 * @route   GET /api/registros/mi-estado
 * @desc    Obtiene el estado actual de fichaje del empleado autenticado.
 * @access  Private (Empleado)
 */
router.get('/mi-estado', protect, getEstadoActual);

/**
 * @route   GET /api/registros/mi-historial
 * @desc    Obtiene el historial de registros del empleado autenticado.
 * @access  Private (Empleado)
 */
router.get('/mi-historial', protect, getMiHistorial);

/**
 * @route   POST /api/registros/entrada-justificada
 * @desc    Marca entrada con justificación para llegada tarde.
 * @access  Private (Empleado)
 */
router.post('/entrada-justificada', protect, marcarEntradaJustificada);

/**
 * @route   POST /api/registros/salida-justificada
 * @desc    Marca salida con justificación para salida temprana.
 * @access  Private (Empleado)
 */
router.post('/salida-justificada', protect, marcarSalidaJustificada);

/**
 * @route   POST /api/registros/salida-incidente
 * @desc    Marca salida sin entrada (incidente).
 * @access  Private (Empleado)
 */
router.post('/salida-incidente', protect, marcarSalidaIncidente);


// ============================================
// RUTAS PARA ADMINS Y SUPERVISORES
// ============================================

/**
 * @route   GET /api/registros
 * @desc    Obtener todos los registros (con filtros opcionales)
 * @access  Private (Admin, Supervisor)
 */
router.get('/', protect, authorize('admin', 'supervisor'), getAllRegistros);

/**
 * @route   POST /api/registros
 * @desc    Crear un registro completo (entrada y salida)
 * @access  Private (Admin, Supervisor)
 */
router.post('/', protect, authorize('admin', 'supervisor'), createRegistro);

/**
 * @route   GET /api/registros/rango
 * @desc    Obtener registros por rango de fechas
 * @access  Private (Admin, Supervisor)
 */
router.get('/rango', protect, authorize('admin', 'supervisor'), getRegistrosByRangoFechas);

/**
 * @route   GET /api/registros/eliminados
 * @desc    Obtener registros eliminados (soft deleted)
 * @access  Private (Admin, Supervisor)
 */
router.get('/eliminados', protect, authorize('admin', 'supervisor'), getRegistrosEliminados);

/**
 * @route   GET /api/registros/:id
 * @desc    Obtener un registro por ID
 * @access  Private (Admin, Supervisor)
 */
router.get('/:id', protect, authorize('admin', 'supervisor'), getRegistroById);

/**
 * @route   PUT /api/registros/:id
 * @desc    Actualizar un registro existente
 * @access  Private (Admin, Supervisor)
 */
router.put('/:id', protect, authorize('admin', 'supervisor'), updateRegistro);

/**
 * @route   POST /api/registros/:id/restaurar
 * @desc    Restaurar un registro eliminado
 * @access  Private (Admin)
 */
router.post('/:id/restaurar', protect, authorize('admin'), restaurarRegistro);

/**
 * @route   DELETE /api/registros/:id
 * @desc    Eliminar un registro (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, authorize('admin'), deleteRegistro);

/**
 * @route   DELETE /api/registros/:id/permanente
 * @desc    Eliminar permanentemente un registro
 * @access  Private (Admin)
 */
router.delete('/:id/permanente', protect, authorize('admin'), eliminarRegistroPermanente);


// ============================================
// RUTAS LEGACY (SE MANTIENEN POR COMPATIBILIDAD)
// ============================================

/**
 * @route   POST /api/registros/entrada
 * @desc    Registrar entrada de un empleado (Legacy)
 * @access  Public
 */
router.post('/entrada', registrarEntrada);

/**
 * @route   PUT /api/registros/salida
 * @desc    Registrar salida de un empleado (Legacy)
 * @access  Public
 */
router.put('/salida', registrarSalida);


export default router;