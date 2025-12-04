/**
 * Inicialización de Sequelize y Conexión a la Base de Datos
 * 
 * Este archivo configura la instancia de Sequelize con soporte para:
 * - PostgreSQL en Neon (producción)
 * - PostgreSQL local (desarrollo)
 * - SSL automático en producción
 * - Reconexión automática
 * - Retry logic
 * 
 * @module database/index
 */

import { Sequelize } from 'sequelize';
import { getConnectionConfig } from '../config/database.config.js';
import logger from '../utils/logger.config.js';

/**
 * Obtener configuración según entorno (DATABASE_URL o config individual)
 */
const config = getConnectionConfig();

/**
 * Instancia de Sequelize configurada con PostgreSQL
 * Soporta tanto DATABASE_URL (Neon) como configuración individual (local)
 */
const sequelize = config.url
  ? new Sequelize(config.url, {
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      pool: config.pool,
      define: config.define,
      logging: config.logging,
      benchmark: config.benchmark,
      retry: config.retry,
      timezone: config.timezone
    })
  : new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions,
        pool: config.pool,
        define: config.define,
        logging: config.logging,
        benchmark: config.benchmark,
        retry: config.retry,
        timezone: config.timezone
      }
    );

/**
 * Función para probar la conexión a la base de datos
 * Incluye reintentos y logging profesional
 * @returns {Promise<boolean>} - true si la conexión es exitosa
 */
export const testConnection = async (retries = 3) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      
      const dbName = sequelize.config.database || 'Neon PostgreSQL';
      logger.dbConnected(dbName);
      
      // Log de información de conexión
      logger.info(`📊 Dialecto: ${sequelize.getDialect()}`);
      logger.info(`🔌 Pool: max=${config.pool.max}, min=${config.pool.min}`);
      
      return true;
    } catch (error) {
      logger.error(`❌ Intento ${i}/${retries} - Error de conexión: ${error.message}`);
      
      if (i < retries) {
        const waitTime = i * 2000; // Espera progresiva: 2s, 4s, 6s
        logger.info(`⏳ Reintentando en ${waitTime/1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        logger.dbError(error);
        return false;
      }
    }
  }
  return false;
};

/**
 * Función para sincronizar los modelos con la base de datos
 * PRECAUCIÓN: En producción, usar migraciones en lugar de sync()
 * 
 * @param {Object} options - Opciones de sincronización
 * @returns {Promise<void>}
 */
export const syncDatabase = async (options = {}) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('⚠️  En producción NO se ejecuta sync(). Usar migraciones.');
      return;
    }
    
    await sequelize.sync(options);
    logger.info('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    logger.error('❌ Error al sincronizar modelos:', error.message);
    throw error;
  }
};

/**
 * Cerrar conexión a la base de datos de forma segura
 */
export const closeDatabase = async () => {
  try {
    await sequelize.close();
    logger.info('🔌 Conexión a base de datos cerrada correctamente');
  } catch (error) {
    logger.error('Error al cerrar conexión:', error);
  }
};

// Manejar señales de terminación para cerrar conexiones
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido. Cerrando conexiones...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recibido. Cerrando conexiones...');
  await closeDatabase();
  process.exit(0);
});

export default sequelize;
