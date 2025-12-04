/**
 * Middlewares de Seguridad para Producción
 * 
 * Implementa protecciones esenciales:
 * - Helmet: Headers de seguridad
 * - Rate Limiting: Límite de peticiones
 * - Input Sanitization: Limpieza de datos
 * - CORS: Control de acceso
 * 
 * @module middlewares/security
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, query, param, validationResult } from 'express-validator';
import cors from 'cors';
import logger from '../utils/logger.config.js';

// ============================================
// HELMET - SEGURIDAD DE HEADERS HTTP
// ============================================

/**
 * Configuración de Helmet para headers seguros
 * Protege contra XSS, clickjacking, MIME sniffing, etc.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny' // Prevenir clickjacking
  },
  noSniff: true,
  xssFilter: true
});

// ============================================
// RATE LIMITING - LÍMITE DE PETICIONES
// ============================================

/**
 * Rate limiter general (1000 peticiones por 15 minutos en producción, 10000 en desarrollo)
 * Esto permite ~66 peticiones por minuto, suficiente para uso normal
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 1000 : 10000, // límite razonable en producción
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
    });
  }
});

/**
 * Rate limiter estricto para login (5 intentos por 15 minutos)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  skipSuccessfulRequests: true, // no contar peticiones exitosas
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor intenta en 15 minutos.'
  },
  handler: (req, res) => {
    logger.warn(`Intentos de login excedidos para IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Demasiados intentos de inicio de sesión. Por favor intenta en 15 minutos.'
    });
  }
});

/**
 * Rate limiter para creación de recursos (10 por hora)
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: {
    success: false,
    message: 'Has alcanzado el límite de creación de recursos por hora.'
  }
});

// ============================================
// CORS - CONTROL DE ACCESO
// ============================================

/**
 * Configuración CORS segura
 */
export const corsOptions = {
  origin: (origin, callback) => {
    // Lista blanca de dominios permitidos
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://tu-dominio-frontend.com'
    ].filter(Boolean); // Eliminar undefined

    // Permitir dominios de Vercel (*.vercel.app)
    const isVercelDomain = origin && origin.match(/https:\/\/.*\.vercel\.app$/);

    // Permitir peticiones sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || isVercelDomain) {
      callback(null, true);
    } else {
      logger.warn(`Origen bloqueado por CORS: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 horas
};

/**
 * CORS permisivo para desarrollo
 */
export const corsDevOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * Middleware CORS adaptativo (producción/desarrollo)
 */
export const corsMiddleware = cors(
  process.env.NODE_ENV === 'production' ? corsOptions : corsDevOptions
);

// ============================================
// INPUT SANITIZATION - LIMPIEZA DE DATOS
// ============================================

/**
 * Sanitizadores comunes para express-validator
 */
export const sanitizers = {
  /**
   * Sanitizar strings: trim, escape HTML
   */
  string: [
    body('*').trim(),
    body('*').escape()
  ],
  
  /**
   * Sanitizar email
   */
  email: [
    body('email').normalizeEmail(),
    body('email').trim().toLowerCase()
  ]
};

/**
 * Middleware para validar resultados de express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Error de validación:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

// ============================================
// VALIDADORES COMUNES
// ============================================

/**
 * Validadores reutilizables
 */
export const validators = {
  /**
   * Validar ID numérico
   */
  id: param('id')
    .isInt({ min: 1 })
    .withMessage('ID debe ser un número entero positivo'),
  
  /**
   * Validar email
   */
  email: body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  /**
   * Validar contraseña fuerte
   */
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener mayúsculas, minúsculas y números'),
  
  /**
   * Validar paginación
   */
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Página debe ser un número entero positivo'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Límite debe estar entre 1 y 100')
  ]
};

// ============================================
// PROTECCIÓN CONTRA INYECCIÓN SQL
// ============================================

/**
 * Middleware para detectar posibles intentos de SQL injection
 */
export const sqlInjectionProtection = (req, res, next) => {
  const suspicious = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/i;
  
  // Verificar en body, query y params
  const checkObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && suspicious.test(obj[key])) {
        logger.warn(`Posible SQL injection detectado de IP ${req.ip}:`, {
          field: key,
          value: obj[key]
        });
        return true;
      }
    }
    return false;
  };
  
  if (
    checkObject(req.body) ||
    checkObject(req.query) ||
    checkObject(req.params)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Solicitud inválida'
    });
  }
  
  next();
};

// ============================================
// EXPORTAR TODO
// ============================================

export default {
  helmetMiddleware,
  generalLimiter,
  authLimiter,
  createLimiter,
  corsMiddleware,
  validate,
  validators,
  sanitizers,
  sqlInjectionProtection
};
