/**
 * Utilidad de Logging
 * 
 * Funciones helper para logging consistente en toda la aplicación.
 * 
 * @module utils/logger
 */

/**
 * Códigos de color ANSI para la terminal
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colores de texto
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Colores de fondo
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

/**
 * Obtener timestamp formateado
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Logger para mensajes de información
 */
export const info = (message, data = null) => {
  console.log(
    `${colors.blue}[INFO]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`
  );
  if (data) {
    console.log(data);
  }
};

/**
 * Logger para mensajes de éxito
 */
export const success = (message, data = null) => {
  console.log(
    `${colors.green}[SUCCESS]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`
  );
  if (data) {
    console.log(data);
  }
};

/**
 * Logger para mensajes de advertencia
 */
export const warn = (message, data = null) => {
  console.warn(
    `${colors.yellow}[WARN]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`
  );
  if (data) {
    console.warn(data);
  }
};

/**
 * Logger para mensajes de error
 */
export const error = (message, err = null) => {
  console.error(
    `${colors.red}[ERROR]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`
  );
  if (err) {
    console.error(err);
  }
};

/**
 * Logger para mensajes de debug (solo en desarrollo)
 */
export const debug = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`
    );
    if (data) {
      console.log(data);
    }
  }
};

/**
 * Exportar objeto con todos los loggers
 */
export default {
  info,
  success,
  warn,
  error,
  debug
};
