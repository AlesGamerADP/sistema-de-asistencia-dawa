
import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorHandler.js';
import db from '../models/index.js';

const { Usuario, Empleado } = db;

/**
 * @desc    Middleware para proteger rutas que requieren autenticación.
 *          Verifica el token JWT y adjunta el usuario y el empleado a la petición.
 * @access  Private
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // El token se envía en el header Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscar el usuario por el ID del token y adjuntar el empleado
      //    Esto nos permitirá usar req.empleado en las rutas protegidas
      const usuario = await Usuario.findByPk(decoded.id, {
        include: {
          model: Empleado,
          as: 'empleado',
          include: {
            model: db.Departamento,
            as: 'departamento',
            attributes: ['id', 'nombre']
          }
        }
      });

      if (!usuario) {
        res.status(401);
        throw new Error('No autorizado, usuario no encontrado');
      }
      
      // Adjuntamos el usuario y el empleado a la petición
      req.user = usuario;
      req.empleado = usuario.empleado; // Asumiendo que la asociación se llama 'empleado'

      // Solo requerir empleado si el rol es 'empleado'
      if (usuario.rol === 'empleado' && !req.empleado) {
        res.status(401);
        throw new Error('No autorizado, el usuario no está asociado a un empleado');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('No autorizado, token fallido');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('No autorizado, no hay token');
  }
});

/**
 * @desc    Middleware para autorizar rutas basadas en roles.
 * @param   {...string} roles - Lista de roles permitidos.
 * @access  Private
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      res.status(403); // 403 Forbidden
      throw new Error(
        `El rol '${req.user.rol}' no tiene permiso para acceder a este recurso`
      );
    }
    next();
  };
};
