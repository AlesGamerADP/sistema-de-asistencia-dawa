/**
 * Rutas de Departamentos
 */

import express from 'express';
import {
  getDepartamentos,
  getDepartamentoById,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento
} from '../controllers/departamento.controller.js';

const router = express.Router();

/**
 * @route   GET /api/departamentos
 * @desc    Obtener todos los departamentos
 * @access  Private
 */
router.get('/', getDepartamentos);

/**
 * @route   GET /api/departamentos/:id
 * @desc    Obtener un departamento por ID
 * @access  Private
 */
router.get('/:id', getDepartamentoById);

/**
 * @route   POST /api/departamentos
 * @desc    Crear un nuevo departamento
 * @access  Private (Admin)
 */
router.post('/', createDepartamento);

/**
 * @route   PUT /api/departamentos/:id
 * @desc    Actualizar un departamento
 * @access  Private (Admin)
 */
router.put('/:id', updateDepartamento);

/**
 * @route   DELETE /api/departamentos/:id
 * @desc    Eliminar un departamento
 * @access  Private (Admin)
 */
router.delete('/:id', deleteDepartamento);

export default router;
