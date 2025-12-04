/**
 * Rutas de Usuarios
 * 
 * Define todos los endpoints relacionados con usuarios.
 * 
 * @module routes/usuario.routes
 */

import express from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosByRol,
  login,
  logout,
  verifySession
} from '../controllers/usuario.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

/**
 * @route   POST /api/usuarios/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/usuarios/logout
 * @desc    Logout de usuario
 * @access  Private
 */
router.post('/logout', logout);

/**
 * @route   GET /api/usuarios/verify
 * @desc    Verificar sesión activa
 * @access  Private
 */
router.get('/verify', verifySession);

// ============================================
// RUTAS DE CRUD
// ============================================

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios
 * @access  Public
 */
router.get('/', getAllUsuarios);

/**
 * @route   GET /api/usuarios/rol/:rol
 * @desc    Obtener usuarios por rol (admin, supervisor, empleado)
 * @access  Public
 */
router.get('/rol/:rol', getUsuariosByRol);

/**
 * @route   GET /api/usuarios/:id
 * @desc    Obtener un usuario por ID
 * @access  Public
 */
router.get('/:id', getUsuarioById);

/**
 * @route   POST /api/usuarios
 * @desc    Crear un nuevo usuario
 * @access  Private (requiere autenticación - próxima fase)
 */
router.post('/', createUsuario);

/**
 * @route   PUT /api/usuarios/:id
 * @desc    Actualizar un usuario existente
 * @access  Private
 */
router.put('/:id', updateUsuario);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Eliminar un usuario
 * @access  Private (Admin)
 */
router.delete('/:id', deleteUsuario);

export default router;
