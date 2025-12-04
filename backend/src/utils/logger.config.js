/**
 * Configuración Profesional de Logging con Winston
 * 
 * Sistema de logs estructurado con niveles, rotación y formato profesional
 * Logs separados por tipo: error, combined, http
 * 
 * @module utils/logger.config
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

// ============================================
// NIVELES DE LOG
// ============================================
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// ============================================
// COLORES PARA CONSOLA
// ============================================
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

// ============================================
// FORMATO DE LOGS
// ============================================

/**
 * Formato para desarrollo: colorizado y legible
 */
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

/**
 * Formato para producción: JSON estructurado
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// ============================================
// TRANSPORTS (DESTINOS DE LOGS)
// ============================================

const transports = [];

// Consola (siempre activo)
transports.push(
  new winston.transports.Console({
    format: isProduction ? productionFormat : developmentFormat,
    level: isProduction ? 'info' : 'debug'
  })
);

// Archivos solo en producción (o si LOG_TO_FILE=true)
if (isProduction || process.env.LOG_TO_FILE === 'true') {
  const logsDir = path.join(__dirname, '../../logs');
  
  // Todos los logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
  
  // Solo errores
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// ============================================
// CREAR LOGGER
// ============================================

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  levels,
  format: isProduction ? productionFormat : developmentFormat,
  transports,
  exitOnError: false
});

// ============================================
// MÉTODOS HELPER
// ============================================

/**
 * Log de petición HTTP
 */
logger.http = (message, meta = {}) => {
  logger.log('http', message, meta);
};

/**
 * Log de inicio de servidor
 */
logger.serverStart = (port, env) => {
  logger.info(`🚀 Servidor iniciado en puerto ${port} - Entorno: ${env}`);
};

/**
 * Log de conexión a BD
 */
logger.dbConnected = (database) => {
  logger.info(`✅ Conectado a base de datos: ${database}`);
};

/**
 * Log de error de BD
 */
logger.dbError = (error) => {
  logger.error(`❌ Error de base de datos: ${error.message}`, {
    stack: error.stack
  });
};

/**
 * Log de request con metadata
 */
logger.request = (req, statusCode, responseTime) => {
  logger.http(
    `${req.method} ${req.originalUrl} ${statusCode} - ${responseTime}ms`,
    {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      responseTime,
      ip: req.ip,
      userAgent: req.get('user-agent')
    }
  );
};

// ============================================
// STREAM PARA MORGAN
// ============================================

/**
 * Stream para integración con Morgan
 */
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

export default logger;
