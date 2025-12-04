/**
 * Index de Rutas - Router Principal
 * 
 * Centraliza y organiza todas las rutas de la API.
 * Cada módulo de rutas se monta en su prefijo correspondiente.
 * 
 * @module routes/index
 */

import express from 'express';
import empleadoRoutes from './empleado.routes.js';
import usuarioRoutes from './usuario.routes.js';
import registroRoutes from './registro.routes.js';
import departamentoRoutes from './departamento.routes.js';

const router = express.Router();

/**
 * Health Check de la API
 * @route GET /api
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ API TimeTrack funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      empleados: '/api/empleados',
      usuarios: '/api/usuarios',
      registros: '/api/registros',
      departamentos: '/api/departamentos'
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Montar las rutas de cada módulo
 */
router.use('/empleados', empleadoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/registros', registroRoutes);
router.use('/departamentos', departamentoRoutes);

export default router;
