/**
 * Controlador de Departamentos
 * Maneja operaciones CRUD para departamentos
 */

import db from '../models/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const { Departamento } = db;

/**
 * @desc    Obtener todos los departamentos
 * @route   GET /api/departamentos
 * @access  Private
 */
export const getDepartamentos = asyncHandler(async (req, res) => {
  const departamentos = await Departamento.findAll({
    order: [['nombre', 'ASC']]
  });

  res.json(departamentos);
});

/**
 * @desc    Obtener un departamento por ID
 * @route   GET /api/departamentos/:id
 * @access  Private
 */
export const getDepartamentoById = asyncHandler(async (req, res) => {
  const departamento = await Departamento.findByPk(req.params.id);

  if (!departamento) {
    return res.status(404).json({ message: 'Departamento no encontrado' });
  }

  res.json(departamento);
});

/**
 * @desc    Crear un nuevo departamento
 * @route   POST /api/departamentos
 * @access  Private (Admin)
 */
export const createDepartamento = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  const departamento = await Departamento.create({
    nombre,
    descripcion
  });

  res.status(201).json(departamento);
});

/**
 * @desc    Actualizar un departamento
 * @route   PUT /api/departamentos/:id
 * @access  Private (Admin)
 */
export const updateDepartamento = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;
  
  const departamento = await Departamento.findByPk(req.params.id);

  if (!departamento) {
    return res.status(404).json({ message: 'Departamento no encontrado' });
  }

  await departamento.update({
    nombre: nombre || departamento.nombre,
    descripcion: descripcion !== undefined ? descripcion : departamento.descripcion
  });

  res.json(departamento);
});

/**
 * @desc    Eliminar un departamento
 * @route   DELETE /api/departamentos/:id
 * @access  Private (Admin)
 */
export const deleteDepartamento = asyncHandler(async (req, res) => {
  const departamento = await Departamento.findByPk(req.params.id);

  if (!departamento) {
    return res.status(404).json({ message: 'Departamento no encontrado' });
  }

  await departamento.destroy();
  res.json({ message: 'Departamento eliminado exitosamente' });
});
