/**
 * Servidor Principal - TimeTrack Backend
 * 
 * Sistema de control de asistencia y gestión de empleados
 * Construido con Express.js, Sequelize ORM y PostgreSQL
 * 
 * @author TimeTrack Team
 * @version 1.0.0
 * @date Octubre 2025
 */

import dotenv from 'dotenv';
import app from './app.js';
import { testConnection, syncDatabase } from './database/index.js';
import db from './models/index.js';
import logger from './utils/logger.config.js';

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validar variables de entorno críticas
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error(`❌ Variables de entorno faltantes: ${missingEnvVars.join(', ')}`);
  logger.error('💡 Revisa tu archivo .env');
  process.exit(1);
}

// ============================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================

/**
 * Función principal para iniciar el servidor
 */
const startServer = async () => {
  try {
    logger.info('🚀 Iniciando TimeTrack Backend...');
    logger.info(`📂 Entorno: ${NODE_ENV}`);

    // 1. Probar conexión a la base de datos
    logger.info('📊 Verificando conexión con PostgreSQL...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // 2. Sincronizar modelos (solo en desarrollo)
    if (NODE_ENV === 'development') {
      logger.info('🔄 Sincronizando modelos con la base de datos...');
      await syncDatabase({ alter: false });
    } else {
      logger.info('⚠️  Producción: Sync deshabilitado. Usar migraciones.');
    }

    // 3. Iniciar servidor Express
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.serverStart(PORT, NODE_ENV);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info(`🌐 URL:              http://localhost:${PORT}`);
      logger.info(`🗄️  Base de datos:    ${process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'PostgreSQL Local'}`);
      logger.info(`📊 Modelos cargados: ${Object.keys(db).filter(k => k !== 'sequelize').length}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info('📍 Endpoints principales:');
      logger.info('   GET    /health              - Health check');
      logger.info('   GET    /api                 - Info de la API');
      logger.info('   GET    /api/empleados       - Listar empleados');
      logger.info('   GET    /api/registros       - Listar registros');
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info(`💡 Servidor listo en ${NODE_ENV}`);
    });

    // Manejo de errores del servidor
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Puerto ${PORT} ya está en uso`);
        logger.error(`Cambia el puerto en .env o detén el proceso que lo usa`);
      } else {
        logger.error('Error del servidor:', error);
      }
      process.exit(1);
    });

    // Keep-alive para evitar que el proceso se detenga
    server.keepAliveTimeout = 61000; // Render timeout es 60s
    server.headersTimeout = 65000;

  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    logger.error('Verifica:');
    logger.error('  ✓ PostgreSQL está accesible');
    logger.error('  ✓ Variables de entorno configuradas');
    logger.error('  ✓ DATABASE_URL es correcta (Neon)');
    logger.error('  ✓ Dependencias instaladas (npm install)');
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();

// ============================================
// MANEJO DE SEÑALES DE CIERRE
// ============================================

/**
 * Manejo de cierre graceful (Ctrl+C)
 */
process.on('SIGINT', async () => {
  logger.info('\n⏳ Cerrando servidor...');
  await db.sequelize.close();
  logger.info('✅ Conexiones cerradas correctamente');
  process.exit(0);
});

/**
 * Manejo de terminación (kill) - Importante para Render
 */
process.on('SIGTERM', async () => {
  logger.info('\n⏳ Señal SIGTERM recibida, cerrando servidor...');
  await db.sequelize.close();
  logger.info('✅ Conexiones cerradas correctamente');
  process.exit(0);
});

/**
 * Manejo de excepciones no capturadas
 */
process.on('uncaughtException', (error) => {
  logger.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

/**
 * Manejo de promesas rechazadas no manejadas
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});


