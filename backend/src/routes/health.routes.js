/**
 * Ruta de Health Check y Monitoreo
 * 
 * Endpoint para verificar el estado del sistema y la base de datos
 * Útil para Render, Railway y otros servicios que requieren health checks
 * 
 * @module routes/health
 */

import express from 'express';
import sequelize from '../database/index.js';
import logger from '../utils/logger.config.js';

const router = express.Router();

/**
 * GET /health
 * Endpoint de health check completo
 * 
 * Verifica:
 * - Estado del servidor
 * - Conexión a base de datos
 * - Tiempo de respuesta
 * - Uso de memoria
 */
router.get('/', async (req, res) => {
  const healthCheck = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    server: 'online',
    database: 'checking...',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };

  try {
    // Test de conexión a la base de datos
    const startTime = Date.now();
    await sequelize.authenticate();
    const dbResponseTime = Date.now() - startTime;

    healthCheck.database = 'connected';
    healthCheck.dbResponseTime = `${dbResponseTime}ms`;
    healthCheck.dbDialect = sequelize.getDialect();
    healthCheck.dbName = sequelize.config.database || 'N/A';

    logger.info('Health check exitoso');

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.success = false;
    healthCheck.database = 'disconnected';
    healthCheck.error = error.message;

    logger.error('Health check falló:', error);

    res.status(503).json(healthCheck);
  }
});

/**
 * GET /health/ping
 * Endpoint simple para verificación rápida
 */
router.get('/ping', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /health/db
 * Endpoint específico para verificar solo la base de datos
 */
router.get('/db', async (req, res) => {
  try {
    const startTime = Date.now();
    await sequelize.authenticate();
    const responseTime = Date.now() - startTime;

    // Obtener información de la conexión
    const [results] = await sequelize.query('SELECT version()');
    
    res.status(200).json({
      success: true,
      status: 'connected',
      responseTime: `${responseTime}ms`,
      dialect: sequelize.getDialect(),
      database: sequelize.config.database,
      version: results[0]?.version || 'N/A',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database health check falló:', error);
    
    res.status(503).json({
      success: false,
      status: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
