/**
 * Configuración Profesional de Base de Datos para Producción
 * 
 * Configuración optimizada para PostgreSQL en Neon con SSL
 * Incluye reconexión automática, timeouts y manejo de errores
 * 
 * @module config/database.config
 */

import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Configuración de PostgreSQL para Neon (Producción) o Local (Desarrollo)
 */
export const databaseConfig = {
  // ============================================
  // CONEXIÓN PRINCIPAL
  // ============================================
  
  /**
   * DATABASE_URL: URL completa de conexión (prioritaria en producción)
   * Formato: postgresql://user:password@host:port/database?sslmode=require
   */
  url: process.env.DATABASE_URL,
  
  /**
   * Configuración individual (fallback si no hay DATABASE_URL)
   */
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'timetrack',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  
  // ============================================
  // DIALECTO Y SSL
  // ============================================
  
  dialect: 'postgres',
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false // Necesario para Neon y la mayoría de servicios cloud
    } : false,
    // Timeout de conexión
    connectTimeout: 60000, // 60 segundos
    // Configuración adicional para mejorar estabilidad
    statement_timeout: 30000, // 30 segundos para queries
    idle_in_transaction_session_timeout: 60000
  },
  
  // ============================================
  // POOL DE CONEXIONES (Optimizado para Render/Railway)
  // ============================================
  
  pool: {
    max: 10,              // Máximo de conexiones (ajustar según plan de hosting)
    min: 2,               // Mínimo de conexiones activas
    acquire: 60000,       // Tiempo máximo para obtener conexión (60s)
    idle: 10000,          // Tiempo antes de liberar conexión inactiva (10s)
    evict: 1000,          // Intervalo de chequeo de conexiones (1s)
    maxUses: 10000,       // Máximo de usos antes de reciclar conexión
    handleDisconnects: true // Reconexión automática
  },
  
  // ============================================
  // CONFIGURACIÓN DE MODELOS
  // ============================================
  
  define: {
    timestamps: false,      // Control manual de timestamps
    underscored: true,      // snake_case en nombres de columnas
    freezeTableName: true,  // Evitar pluralización automática
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  
  // ============================================
  // LOGGING Y BENCHMARK
  // ============================================
  
  logging: isProduction ? false : console.log,
  benchmark: !isProduction, // Medir tiempo de queries en desarrollo
  
  // ============================================
  // RETRY Y RESILIENCIA
  // ============================================
  
  retry: {
    max: 5,              // Máximo de reintentos
    match: [             // Errores que permiten reintentos
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
      /EHOSTDOWN/,
      /EPIPE/,
      /EAI_AGAIN/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ]
  },
  
  // ============================================
  // TIMEZONE
  // ============================================
  
  timezone: process.env.TZ || '-06:00' // Ajustar según tu zona horaria
};

/**
 * Obtener configuración de conexión
 * Prioriza DATABASE_URL si existe (Neon, Render, Railway)
 */
export const getConnectionConfig = () => {
  if (databaseConfig.url) {
    // Usar URL completa (Neon, Render, Railway)
    return {
      url: databaseConfig.url,
      dialect: databaseConfig.dialect,
      dialectOptions: databaseConfig.dialectOptions,
      pool: databaseConfig.pool,
      define: databaseConfig.define,
      logging: databaseConfig.logging,
      benchmark: databaseConfig.benchmark,
      retry: databaseConfig.retry,
      timezone: databaseConfig.timezone
    };
  } else {
    // Usar configuración individual (desarrollo local)
    return {
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
      username: databaseConfig.username,
      password: databaseConfig.password,
      dialect: databaseConfig.dialect,
      dialectOptions: databaseConfig.dialectOptions,
      pool: databaseConfig.pool,
      define: databaseConfig.define,
      logging: databaseConfig.logging,
      benchmark: databaseConfig.benchmark,
      retry: databaseConfig.retry,
      timezone: databaseConfig.timezone
    };
  }
};

export default databaseConfig;
