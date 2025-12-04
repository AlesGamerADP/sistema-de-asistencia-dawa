/**
 * Rutas de Empleados
 * 
 * Define todos los endpoints relacionados con empleados.
 * 
 * @module routes/empleado.routes
 */

import express from 'express';
import {
  getAllEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getEmpleadosByDepartamento
} from '../controllers/empleado.controller.js';

const router = express.Router();

/**
 * @route   GET /api/empleados
 * @desc    Obtener todos los empleados (con filtros opcionales)
 * @query   estado, departamento_id
 * @access  Public
 */
router.get('/', getAllEmpleados);

/**
 * @route   GET /api/empleados/departamento/:departamentoId
 * @desc    Obtener empleados de un departamento específico
 * @access  Public
 */
router.get('/departamento/:departamentoId', getEmpleadosByDepartamento);

/**
 * @route   GET /api/empleados/:id
 * @desc    Obtener un empleado por ID
 * @access  Public
 */
router.get('/:id', getEmpleadoById);

/**
 * @route   POST /api/empleados
 * @desc    Crear un nuevo empleado
 * @access  Private (requiere autenticación - próxima fase)
 */
router.post('/', createEmpleado);

/**
 * @route   PUT /api/empleados/:id
 * @desc    Actualizar un empleado existente
 * @access  Private
 */
router.put('/:id', updateEmpleado);

/**
 * @route   DELETE /api/empleados/:id
 * @desc    Desactivar un empleado (soft delete)
 * @access  Private
 */
router.delete('/:id', deleteEmpleado);

export default router;
