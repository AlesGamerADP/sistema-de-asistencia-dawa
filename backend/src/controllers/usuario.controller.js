/**
 * Controlador de Usuarios
 * 
 * Maneja la lógica de negocio para operaciones CRUD de usuarios.
 * 
 * @module controllers/usuario.controller
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const { Usuario, Empleado } = db;

// Secret para JWT (en producción debe estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiame_en_produccion_12345';

/**
 * @desc    Obtener todos los usuarios
 * @route   GET /api/usuarios
 * @access  Public
 */
export const getAllUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await Usuario.findAll({
    attributes: { exclude: ['contraseña'] }, // No exponer contraseñas
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: [
          'id',
          'nombre',
          'apellido',
          'puesto',
          'departamento_id',
          'hora_entrada',
          'hora_salida',
          'tipo_empleo',
          'estado'
        ],
        include: [
          {
            model: db.Departamento,
            as: 'departamento',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ],
    order: [['id', 'ASC']]
  });

  res.json({
    success: true,
    count: usuarios.length,
    data: usuarios
  });
});

/**
 * @desc    Obtener un usuario por ID
 * @route   GET /api/usuarios/:id
 * @access  Public
 */
export const getUsuarioById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findByPk(id, {
    attributes: { exclude: ['contraseña'] },
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: [
          'id',
          'nombre',
          'apellido',
          'puesto',
          'departamento_id',
          'hora_entrada',
          'hora_salida',
          'tipo_empleo',
          'estado'
        ],
        include: [
          {
            model: db.Departamento,
            as: 'departamento',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ]
  });

  if (!usuario) {
    res.status(404);
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }

  res.json({
    success: true,
    data: usuario
  });
});

/**
 * @desc    Crear un nuevo usuario
 * @route   POST /api/usuarios
 * @access  Private (Admin)
 */
export const createUsuario = asyncHandler(async (req, res) => {
  const { username, contraseña, rol, empleado_id } = req.body;

  // Validaciones básicas
  if (!username || !contraseña) {
    res.status(400);
    throw new Error('Username y contraseña son requeridos');
  }

  // Verificar si el username ya existe
  const usuarioExistente = await Usuario.findOne({ where: { username } });
  if (usuarioExistente) {
    res.status(409);
    throw new Error('El username ya está en uso');
  }

  // TODO: Hash de contraseña con bcrypt (próxima fase)
  // const hashedPassword = await bcrypt.hash(contraseña, 10);

  const nuevoUsuario = await Usuario.create({
    username,
    contraseña, // En producción, usar hashedPassword
    rol: rol || 'empleado',
    empleado_id
  });

  // No devolver la contraseña
  const usuarioResponse = nuevoUsuario.toJSON();
  delete usuarioResponse.contraseña;

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: usuarioResponse
  });
});

/**
 * @desc    Actualizar un usuario
 * @route   PUT /api/usuarios/:id
 * @access  Private (Admin)
 */
export const updateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, contraseña, rol, empleado_id } = req.body;

  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    res.status(404);
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }

  // Actualizar campos
  const datosActualizados = {
    username: username || usuario.username,
    rol: rol || usuario.rol,
    empleado_id: empleado_id !== undefined ? empleado_id : usuario.empleado_id
  };

  // Si se proporciona nueva contraseña
  if (contraseña) {
    // TODO: Hash de contraseña con bcrypt
    datosActualizados.contraseña = contraseña;
  }

  await usuario.update(datosActualizados);

  // No devolver la contraseña
  const usuarioResponse = usuario.toJSON();
  delete usuarioResponse.contraseña;

  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: usuarioResponse
  });
});

/**
 * @desc    Eliminar un usuario
 * @route   DELETE /api/usuarios/:id
 * @access  Private (Admin)
 */
export const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    res.status(404);
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }

  await usuario.destroy();

  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente',
    data: { id }
  });
});

/**
 * @desc    Obtener usuarios por rol
 * @route   GET /api/usuarios/rol/:rol
 * @access  Public
 */
export const getUsuariosByRol = asyncHandler(async (req, res) => {
  const { rol } = req.params;

  const rolesValidos = ['admin', 'supervisor', 'empleado'];
  if (!rolesValidos.includes(rol)) {
    res.status(400);
    throw new Error(`Rol inválido. Roles válidos: ${rolesValidos.join(', ')}`);
  }

  const usuarios = await Usuario.findAll({
    where: { rol },
    attributes: { exclude: ['contraseña'] },
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: [
          'id',
          'nombre',
          'apellido',
          'departamento_id',
          'puesto'
        ],
        include: [
          {
            model: db.Departamento,
            as: 'departamento',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ]
  });

  res.json({
    success: true,
    count: usuarios.length,
    data: usuarios
  });
});

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

/**
 * @desc    Login de usuario
 * @route   POST /api/usuarios/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { username, contraseña, role } = req.body;

  // Validar que se proporcionen username y contraseña
  if (!username || !contraseña) {
    res.status(400);
    throw new Error('Por favor proporciona usuario y contraseña');
  }

  // Buscar usuario por username
  const usuario = await Usuario.findOne({
    where: { username },
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: ['id', 'nombre', 'apellido', 'puesto', 'estado', 'hora_entrada', 'hora_salida', 'tipo_empleo', 'departamento_id'],
        include: [
          {
            model: db.Departamento,
            as: 'departamento',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ]
  });

  // Verificar si el usuario existe
  if (!usuario) {
    res.status(401);
    throw new Error('Credenciales incorrectas');
  }

  // Verificar contraseña con bcrypt
  const isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Credenciales incorrectas');
  }

  // Verificar que el rol coincida con el solicitado
  if (role && usuario.rol !== role) {
    res.status(403);
    throw new Error('No tienes permisos para acceder como este rol');
  }

  // Verificar que el empleado esté activo (si aplica)
  if (usuario.empleado && usuario.empleado.estado === 'inactivo') {
    res.status(403);
    throw new Error('Usuario inactivo. Contacta al administrador');
  }

  // Generar token JWT real con expiración de 24 horas
  const token = jwt.sign(
    { 
      id: usuario.id, 
      username: usuario.username,
      rol: usuario.rol 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Preparar datos del usuario (sin contraseña)
  const userData = {
    id: usuario.id,
    username: usuario.username,
    rol: usuario.rol,
    empleado_id: usuario.empleado_id,
    empleado: usuario.empleado ? {
      id: usuario.empleado.id,
      nombre: usuario.empleado.nombre,
      apellido: usuario.empleado.apellido,
      puesto: usuario.empleado.puesto,
      hora_entrada: usuario.empleado.hora_entrada,
      hora_salida: usuario.empleado.hora_salida,
      tipo_empleo: usuario.empleado.tipo_empleo,
      departamento: usuario.empleado.departamento ? {
        id: usuario.empleado.departamento.id,
        nombre: usuario.empleado.departamento.nombre
      } : null
    } : null
  };

  res.json({
    success: true,
    message: 'Login exitoso',
    data: {
      user: userData,
      token
    }
  });
});

/**
 * @desc    Logout de usuario
 * @route   POST /api/usuarios/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // En una implementación real con JWT, aquí invalidarías el token
  // Por ejemplo, agregándolo a una lista negra en Redis
  
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

/**
 * @desc    Verificar sesión activa
 * @route   GET /api/usuarios/verify
 * @access  Private
 */
export const verifySession = asyncHandler(async (req, res) => {
  // Obtener token del header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('No se proporcionó token de autenticación');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['contraseña'] },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id', 'nombre', 'apellido', 'puesto', 'estado']
        }
      ]
    });

    if (!usuario) {
      res.status(401);
      throw new Error('Usuario no encontrado');
    }

    // Verificar que el empleado esté activo
    if (usuario.empleado && usuario.empleado.estado === 'inactivo') {
      res.status(403);
      throw new Error('Usuario inactivo');
    }

    res.json({
      success: true,
      message: 'Sesión válida',
      data: {
        isValid: true,
        user: {
          id: usuario.id,
          username: usuario.username,
          rol: usuario.rol,
          empleado_id: usuario.empleado_id,
          empleado: usuario.empleado
        }
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      throw new Error('Token inválido');
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401);
      throw new Error('Token expirado');
    }
    throw error;
  }
});
