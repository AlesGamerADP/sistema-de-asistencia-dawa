/**
 * Configuración de la Base de Datos PostgreSQL
 * 
 * Este archivo centraliza la configuración de conexión a PostgreSQL
 * utilizando variables de entorno para mayor seguridad y flexibilidad.
 * 
 * @module config/db.config
 */

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Objeto de configuración para Sequelize
 * Define los parámetros de conexión y el pool de conexiones
 */
export const dbConfig = {
  // Credenciales de conexión
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB_NAME || 'timetrack',
  PORT: process.env.DB_PORT || 5432,
  
  // Dialecto de base de datos
  dialect: process.env.DB_DIALECT || 'postgres',
  
  /**
   * Configuración del pool de conexiones
   * Optimiza el uso de recursos y mejora el rendimiento
   */
  pool: {
    max: 10,        // Máximo de conexiones simultáneas
    min: 0,         // Mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo (ms) para intentar obtener una conexión
    idle: 10000     // Tiempo máximo (ms) que una conexión puede estar inactiva
  },
  
  /**
   * Configuraciones adicionales para PostgreSQL
   */
  define: {
    timestamps: false,      // Desactivar createdAt/updatedAt por defecto
    underscored: true,      // Usar snake_case en nombres de columnas
    freezeTableName: true   // Evitar pluralización automática de nombres de tablas
  },
  
  // Logging: desactivar en producción
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};

export default dbConfig;
