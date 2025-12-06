/**
 * Controlador de Empleados
 * 
 * Maneja la lógica de negocio relacionada con empleados:
 * - Obtener todos los empleados
 * - Obtener un empleado por ID
 * - Crear nuevo empleado
 * - Actualizar empleado
 * - Eliminar empleado (soft delete)
 * 
 * @module controllers/empleado.controller
 */

import db from '../models/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import bcrypt from 'bcrypt';

const { Empleado, Departamento, Usuario } = db;

/**
 * Obtener todos los empleados
 * Incluye información del departamento asociado
 */
export const getAllEmpleados = asyncHandler(async (req, res) => {
  const { estado, departamento_id } = req.query;

  // Construir filtros dinámicos
  const where = {};
  if (estado) where.estado = estado;
  if (departamento_id) where.departamento_id = departamento_id;

  const empleados = await Empleado.findAll({
    where,
    include: [
      {
        model: Departamento,
        as: 'departamento',
        attributes: ['id', 'nombre']
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'username', 'rol']
      }
    ],
    order: [['id', 'ASC']]
  });

  res.json({
    success: true,
    count: empleados.length,
    data: empleados
  });
});

/**
 * Obtener un empleado por ID
 */
export const getEmpleadoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const empleado = await Empleado.findByPk(id, {
    include: [
      {
        model: Departamento,
        as: 'departamento'
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: { exclude: ['contraseña'] }
      }
    ]
  });

  if (!empleado) {
    res.status(404);
    throw new Error(`Empleado con ID ${id} no encontrado`);
  }

  res.json({
    success: true,
    data: empleado
  });
});

/**
 * Crear un nuevo empleado
 */
export const createEmpleado = asyncHandler(async (req, res) => {
  const { 
    nombre, 
    apellido, 
    puesto, 
    fecha_contratacion, 
    departamento_id, 
    tipo_empleo, 
    hora_entrada, 
    hora_salida,
    username,
    password
  } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido) {
    res.status(400);
    throw new Error('Nombre y apellido son requeridos');
  }

  // Validar credenciales de usuario
  if (!username || !password) {
    res.status(400);
    throw new Error('Usuario y contraseña son requeridos');
  }

  // Validar que el username no esté en uso
  const existingUser = await Usuario.findOne({ where: { username } });
  if (existingUser) {
    res.status(400);
    throw new Error('El nombre de usuario ya está en uso');
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el empleado y el usuario en una transacción
  const transaction = await db.sequelize.transaction();

  try {
    // Crear el empleado
    const nuevoEmpleado = await Empleado.create({
      nombre,
      apellido,
      puesto,
      fecha_contratacion: fecha_contratacion || new Date(),
      departamento_id,
      tipo_empleo: tipo_empleo || 'Full-time',
      hora_entrada: hora_entrada || '09:00',
      hora_salida: hora_salida || '18:00',
      estado: 'activo'
    }, { transaction });

    // Crear el usuario asociado
    await Usuario.create({
      username,
      contraseña: hashedPassword,
      rol: 'empleado',
      empleado_id: nuevoEmpleado.id
    }, { transaction });

    // Confirmar la transacción
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Empleado y usuario creados exitosamente',
      data: nuevoEmpleado
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    throw error;
  }
});

/**
 * Actualizar un empleado existente
 */
export const updateEmpleado = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    apellido, 
    puesto, 
    fecha_contratacion, 
    departamento_id, 
    estado, 
    tipo_empleo, 
    hora_entrada, 
    hora_salida,
    username,
    password
  } = req.body;

  const empleado = await Empleado.findByPk(id, {
    include: [{
      model: Usuario,
      as: 'usuario'
    }]
  });

  if (!empleado) {
    res.status(404);
    throw new Error(`Empleado con ID ${id} no encontrado`);
  }

  // Actualizar empleado
  await empleado.update({
    nombre: nombre || empleado.nombre,
    apellido: apellido || empleado.apellido,
    puesto: puesto !== undefined ? puesto : empleado.puesto,
    fecha_contratacion: fecha_contratacion || empleado.fecha_contratacion,
    departamento_id: departamento_id !== undefined ? departamento_id : empleado.departamento_id,
    estado: estado || empleado.estado,
    tipo_empleo: tipo_empleo || empleado.tipo_empleo,
    hora_entrada: hora_entrada || empleado.hora_entrada,
    hora_salida: hora_salida || empleado.hora_salida
  });

  // Actualizar credenciales del usuario si existen cambios
  if (empleado.usuario) {
    const updateUsuario = {};
    
    // Actualizar username solo si se proporciona y es diferente
    if (username && username !== empleado.usuario.username) {
      // Verificar que el nuevo username no esté en uso
      const existingUser = await Usuario.findOne({ 
        where: { 
          username,
          id: { [db.Sequelize.Op.ne]: empleado.usuario.id } // Excluir el usuario actual
        } 
      });
      
      if (existingUser) {
        res.status(400);
        throw new Error('El nombre de usuario ya está en uso');
      }
      
      updateUsuario.username = username;
    }
    
    // Actualizar contraseña solo si se proporciona
    if (password && password.trim()) {
      updateUsuario.contraseña = await bcrypt.hash(password, 10);
    }
    
    // Aplicar actualizaciones si hay cambios
    if (Object.keys(updateUsuario).length > 0) {
      await empleado.usuario.update(updateUsuario);
    }
  }

  res.json({
    success: true,
    message: 'Empleado actualizado exitosamente',
    data: empleado
  });
});

/**
 * Cambiar estado de empleado a inactivo (soft delete)
 */
export const deleteEmpleado = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const empleado = await Empleado.findByPk(id, {
    include: [
      {
        model: Usuario,
        as: 'usuario'
      }
    ]
  });

  if (!empleado) {
    res.status(404);
    throw new Error(`Empleado con ID ${id} no encontrado`);
  }

  // Soft delete: cambiar estado a inactivo
  await empleado.update({ estado: 'inactivo' });

  res.json({
    success: true,
    message: 'Empleado marcado como inactivo exitosamente',
    data: empleado
  });
});

/**
 * Obtener empleados por departamento
 */
export const getEmpleadosByDepartamento = asyncHandler(async (req, res) => {
  const { departamentoId } = req.params;

  const empleados = await Empleado.findAll({
    where: { departamento_id: departamentoId },
    include: [
      {
        model: Departamento,
        as: 'departamento'
      }
    ]
  });

  res.json({
    success: true,
    count: empleados.length,
    data: empleados
  });
});
