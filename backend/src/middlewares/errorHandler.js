/**
 * Middleware de Manejo de Errores
 * 
 * Centraliza el manejo de errores de la aplicación.
 * Captura errores de Sequelize, validación y errores generales.
 * 
 * @module middlewares/errorHandler
 */

/**
 * Middleware para manejar errores 404 (ruta no encontrada)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware principal de manejo de errores
 * Captura todos los errores y devuelve una respuesta consistente
 */
export const errorHandler = (err, req, res, next) => {
  // Determinar el código de estado
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log del error (en producción, usar un logger como Winston)
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : '🔒',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

/**
 * Middleware para capturar errores de Sequelize
 */
export const sequelizeErrorHandler = (err, req, res, next) => {
  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  // Error de constraint único
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      success: false,
      message: `El ${field} ya existe en la base de datos`
    });
  }

  // Error de clave foránea
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Error de integridad referencial. Verifica las relaciones.'
    });
  }

  // Error de conexión a la base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión con la base de datos'
    });
  }

  // Si no es un error de Sequelize, pasar al siguiente handler
  next(err);
};

/**
 * Wrapper para funciones async
 * Captura errores en controladores asíncronos
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  notFound,
  errorHandler,
  sequelizeErrorHandler,
  asyncHandler
};
