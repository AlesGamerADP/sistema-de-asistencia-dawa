/**
 * Configuración de la Aplicación Express
 * 
 * Este archivo configura todos los middlewares, rutas y
 * manejo de errores de la aplicación con seguridad de producción.
 * 
 * @module app
 */

import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import logger from './utils/logger.config.js';
import {
  helmetMiddleware,
  corsMiddleware,
  generalLimiter,
  sqlInjectionProtection
} from './middlewares/security.middleware.js';
import { 
  notFound, 
  errorHandler, 
  sequelizeErrorHandler 
} from './middlewares/errorHandler.js';

// Crear aplicación Express
const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

/**
 * Helmet - Protección de headers HTTP
 * Protege contra XSS, clickjacking, MIME sniffing, etc.
 */
app.use(helmetMiddleware);

/**
 * Compression - Compresión gzip de respuestas
 * Reduce el tamaño de las respuestas HTTP
 */
app.use(compression());

/**
 * CORS - Control de acceso seguro
 * Configuración adaptativa según entorno
 */
app.use(corsMiddleware);

/**
 * Rate Limiting - Protección contra abuso
 * Limita peticiones por IP
 */
app.use('/api/', generalLimiter);

/**
 * SQL Injection Protection
 * Detecta y bloquea intentos de inyección SQL
 */
app.use(sqlInjectionProtection);

/**
 * Morgan - Logger de peticiones HTTP
 * Integrado con Winston
 */
app.use(morgan('combined', { stream: logger.stream }));

/**
 * Body Parsers
 * Parsea el body de las peticiones en formato JSON y URL-encoded
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Trust proxy - Necesario para Render, Railway, etc.
 * Permite obtener la IP real del cliente detrás de proxies
 */
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

/**
 * Middleware para añadir timestamp a cada petición
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ============================================
// RUTAS
// ============================================

/**
 * Ruta raíz - Health Check del servidor
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ TimeTrack Backend API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api',
    health: '/health',
    timestamp: req.requestTime
  });
});

/**
 * Rutas de Health Check
 * Usadas por Render, Railway y otros servicios de hosting
 */
app.use('/health', healthRoutes);

/**
 * Montar todas las rutas de la API bajo el prefijo /api
 */
app.use('/api', apiRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

/**
 * Middleware para manejar rutas no encontradas (404)
 * Debe estar después de todas las rutas válidas
 */
app.use(notFound);

/**
 * Middleware para capturar errores de Sequelize
 * Transforma errores de base de datos en respuestas legibles
 */
app.use(sequelizeErrorHandler);

/**
 * Middleware global de manejo de errores
 * Captura cualquier error no manejado y devuelve una respuesta consistente
 */
app.use(errorHandler);

export default app;
