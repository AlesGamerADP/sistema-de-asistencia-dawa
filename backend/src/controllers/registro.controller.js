/**
 * Controlador de Registros de Asistencia
 * 
 * Maneja la lógica de negocio para registros de entrada/salida.
 * 
 * @module controllers/registro.controller
 */

import db from '../models/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { Op } from 'sequelize';

const { Registro, Empleado, Departamento } = db;

// ==================================================================
// NUEVAS FUNCIONES PARA FICHAJE DE EMPLEADO AUTENTICADO
// ==================================================================

/**
 * @desc    Marcar entrada o salida para el empleado autenticado
 * @route   POST /api/registros/marcar
 * @access  Private (para el empleado logueado)
 */
export const marcarAsistencia = asyncHandler(async (req, res) => {
  const empleadoId = req.empleado.id; // ID del empleado obtenido del middleware 'protect'
  const { observaciones, hora, fecha } = req.body; // Recibir hora y fecha del frontend

  // Usar la fecha enviada por el frontend, o como fallback la del servidor
  const fechaActual = fecha || new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  // Usar la hora enviada por el frontend, o como fallback la del servidor
  const horaActual = hora || new Date().toTimeString().split(' ')[0]; // Formato HH:MM:SS

  // Buscar si ya existe un registro para el empleado en el día actual
  const registroHoy = await Registro.findOne({
    where: {
      empleado_id: empleadoId,
      fecha: fechaActual
    }
  });

  // Caso 1: No existe registro para hoy -> Es una ENTRADA
  if (!registroHoy) {
    const nuevoRegistro = await Registro.create({
      empleado_id: empleadoId,
      fecha: fechaActual,
      hora_entrada: horaActual,
      observaciones
    });

    return res.status(201).json({
      success: true,
      message: 'Entrada registrada exitosamente.',
      type: 'entrada',
      data: nuevoRegistro
    });
  }

  // Caso 2: Existe registro pero no tiene hora de salida -> Es una SALIDA
  if (registroHoy && !registroHoy.hora_salida) {
    const registroActualizado = await registroHoy.update({
      hora_salida: horaActual,
      // Añadir observaciones si se envían, sin sobreescribir las existentes
      observaciones: observaciones || registroHoy.observaciones
    });

    return res.json({
      success: true,
      message: 'Salida registrada exitosamente.',
      type: 'salida',
      data: registroActualizado
    });
  }

  // Caso 3: Existe registro y ya tiene hora de salida -> Jornada completa
  if (registroHoy && registroHoy.hora_salida) {
    res.status(409); // Conflict
    throw new Error('Ya has completado tu jornada por hoy. No puedes volver a marcar.');
  }

  // Fallback por si alguna lógica no se cumple
  res.status(500).json({ message: 'Error en la lógica de marcación.' });
});


/**
 * @desc    Obtener el estado actual de fichaje del empleado autenticado
 * @route   GET /api/registros/mi-estado
 * @access  Private (para el empleado logueado)
 */
export const getEstadoActual = asyncHandler(async (req, res) => {
  const empleadoId = req.empleado.id;
  const { fecha } = req.query; // Recibir fecha del frontend
  const fechaActual = fecha || new Date().toISOString().split('T')[0];

  const registroHoy = await Registro.findOne({
    where: {
      empleado_id: empleadoId,
      fecha: fechaActual
    }
  });

  // No ha fichado hoy
  if (!registroHoy) {
    return res.json({
      success: true,
      status: 'fuera'
    });
  }

  // Ha fichado entrada pero no salida
  if (registroHoy && !registroHoy.hora_salida) {
    return res.json({
      success: true,
      status: 'dentro',
      data: registroHoy
    });
  }

  // Jornada completa
  if (registroHoy && registroHoy.hora_salida) {
    return res.json({
      success: true,
      status: 'completo',
      data: registroHoy
    });
  }
});


/**
 * @desc    Obtener historial de registros del empleado autenticado
 * @route   GET /api/registros/mi-historial
 * @access  Private (para el empleado logueado)
 */
export const getMiHistorial = asyncHandler(async (req, res) => {
  const empleadoId = req.empleado.id;
  const { limit = 30 } = req.query;

  const registros = await Registro.findAll({
    where: {
      empleado_id: empleadoId
    },
    order: [['fecha', 'DESC'], ['hora_entrada', 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    count: registros.length,
    data: registros
  });
});


/**
 * @desc    Marcar entrada con justificación (llegada tarde)
 * @route   POST /api/registros/entrada-justificada
 * @access  Private (para el empleado logueado)
 */
export const marcarEntradaJustificada = asyncHandler(async (req, res) => {
  const empleadoId = req.empleado.id;
  const { justificacion, hora, fecha } = req.body;

  if (!justificacion || justificacion.trim() === '') {
    res.status(400);
    throw new Error('La justificación es obligatoria para llegadas tarde');
  }

  const fechaActual = fecha || new Date().toISOString().split('T')[0];
  const horaActual = hora || new Date().toTimeString().split(' ')[0];

  // Verificar que no exista registro hoy
  const registroExistente = await Registro.findOne({
    where: {
      empleado_id: empleadoId,
      fecha: fechaActual
    }
  });

  if (registroExistente) {
    res.status(409);
    throw new Error('Ya existe un registro para hoy');
  }

  const nuevoRegistro = await Registro.create({
    empleado_id: empleadoId,
    fecha: fechaActual,
    hora_entrada: horaActual,
    observaciones: `Llegada tarde - Justificación: ${justificacion}`
  });

  res.status(201).json({
    success: true,
    message: 'Entrada tardía registrada con justificación',
    type: 'entrada_justificada',
    data: nuevoRegistro
  });
});


/**
 * @desc    Marcar salida con justificación (salida temprana)
 * @route   POST /api/registros/salida-justificada
 * @access  Private (para el empleado logueado)
 */
export const marcarSalidaJustificada = asyncHandler(async (req, res) => {
  const empleadoId = req.empleado.id;
  const { justificacion, hora, fecha } = req.body;

  if (!justificacion || justificacion.trim() === '') {
    res.status(400);
    throw new Error('La justificación es obligatoria para salidas tempranas');
  }

  const fechaActual = fecha || new Date().toISOString().split('T')[0];
  const horaActual = hora || new Date().toTimeString().split(' ')[0];

  const registroHoy = await Registro.findOne({
    where: {
      empleado_id: empleadoId,
      fecha: fechaActual
    }
  });

  if (!registroHoy) {
    res.status(404);
    throw new Error('No se encontró registro de entrada para hoy');
  }

  if (registroHoy.hora_salida) {
    res.status(409);
    throw new Error('Ya has registrado tu salida para hoy');
  }

  const registroActualizado = await registroHoy.update({
    hora_salida: horaActual,
    observaciones: registroHoy.observaciones 
      ? `${registroHoy.observaciones} | Salida temprana - Justificación: ${justificacion}`
      : `Salida temprana - Justificación: ${justificacion}`
  });

  res.json({
    success: true,
    message: 'Salida temprana registrada con justificación',
    type: 'salida_justificada',
    data: registroActualizado
  });
});


/**
 * @desc    Marcar salida sin entrada (incidente)
 * @route   POST /api/registros/salida-incidente
 * @access  Private (para el empleado logueado)
 */
export const marcarSalidaIncidente = asyncHandler(async (req, res) => {
  const empleadoId = req.empleado.id;
  const { motivo } = req.body;

  if (!motivo || motivo.trim() === '') {
    res.status(400);
    throw new Error('El motivo de la incidencia es obligatorio');
  }

  const fechaActual = new Date().toISOString().split('T')[0];
  const horaActual = new Date().toTimeString().split(' ')[0];

  // Verificar que no exista registro hoy
  const registroExistente = await Registro.findOne({
    where: {
      empleado_id: empleadoId,
      fecha: fechaActual
    }
  });

  if (registroExistente) {
    res.status(409);
    throw new Error('Ya existe un registro para hoy. No se puede registrar incidencia.');
  }

  // Crear registro solo con salida (sin entrada)
  const nuevoRegistro = await Registro.create({
    empleado_id: empleadoId,
    fecha: fechaActual,
    hora_salida: horaActual,
    observaciones: `INCIDENTE - Sin registro de entrada. Motivo: ${motivo}`
  });

  res.status(201).json({
    success: true,
    message: 'Salida con incidente registrada',
    type: 'salida_incidente',
    data: nuevoRegistro
  });
});


// ==================================================================
// FUNCIONES ORIGINALES (ADMIN/SUPERVISOR)
// ==================================================================

/**
 * @desc    Obtener todos los registros
 * @route   GET /api/registros
 * @access  Public
 */
export const getAllRegistros = asyncHandler(async (req, res) => {
  const { fecha, empleado_id, limit = 100 } = req.query;

  // Construir filtros dinámicos
  const where = {};
  if (fecha) where.fecha = fecha;
  if (empleado_id) where.empleado_id = empleado_id;

  const registros = await Registro.findAll({
    where,
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: ['id', 'nombre', 'apellido', 'puesto'],
        include: [
          {
            model: Departamento,
            as: 'departamento',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ],
    order: [['fecha', 'DESC'], ['hora_entrada', 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    count: registros.length,
    data: registros
  });
});

/**
 * @desc    Obtener un registro por ID
 * @route   GET /api/registros/:id
 * @access  Public
 */
export const getRegistroById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const registro = await Registro.findByPk(id, {
    include: [
      {
        model: Empleado,
        as: 'empleado',
        include: [
          {
            model: Departamento,
            as: 'departamento'
          }
        ]
      }
    ]
  });

  if (!registro) {
    res.status(404);
    throw new Error(`Registro con ID ${id} no encontrado`);
  }

  res.json({
    success: true,
    data: registro
  });
});

/**
 * @desc    Registrar entrada de un empleado
 * @route   POST /api/registros/entrada
 * @access  Public
 */
export const registrarEntrada = asyncHandler(async (req, res) => {
  const { empleado_id, observaciones } = req.body;

  if (!empleado_id) {
    res.status(400);
    throw new Error('El ID del empleado es requerido');
  }

  // Verificar que el empleado existe
  const empleado = await Empleado.findByPk(empleado_id);
  if (!empleado) {
    res.status(404);
    throw new Error(`Empleado con ID ${empleado_id} no encontrado`);
  }

  // Fecha y hora actual
  const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const horaActual = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

  // Verificar si ya existe un registro para hoy
  const registroExistente = await Registro.findOne({
    where: {
      empleado_id,
      fecha: fechaActual
    }
  });

  if (registroExistente) {
    res.status(409);
    throw new Error('Ya existe un registro de entrada para hoy');
  }

  // Crear registro de entrada
  const nuevoRegistro = await Registro.create({
    empleado_id,
    fecha: fechaActual,
    hora_entrada: horaActual,
    observaciones
  });

  // Obtener el registro con información del empleado
  const registroCompleto = await Registro.findByPk(nuevoRegistro.id, {
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: ['id', 'nombre', 'apellido', 'puesto']
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Entrada registrada exitosamente',
    data: registroCompleto
  });
});

/**
 * @desc    Registrar salida de un empleado
 * @route   PUT /api/registros/salida
 * @access  Public
 */
export const registrarSalida = asyncHandler(async (req, res) => {
  const { empleado_id, observaciones } = req.body;

  if (!empleado_id) {
    res.status(400);
    throw new Error('El ID del empleado es requerido');
  }

  const fechaActual = new Date().toISOString().split('T')[0];
  const horaActual = new Date().toTimeString().split(' ')[0];

  // Buscar el registro de entrada de hoy
  const registro = await Registro.findOne({
    where: {
      empleado_id,
      fecha: fechaActual
    }
  });

  if (!registro) {
    res.status(404);
    throw new Error('No se encontró un registro de entrada para hoy');
  }

  if (registro.hora_salida) {
    res.status(409);
    throw new Error('Ya se registró la salida para hoy');
  }

  // Actualizar con hora de salida
  await registro.update({
    hora_salida: horaActual,
    observaciones: observaciones || registro.observaciones
  });

  // Obtener el registro actualizado con información del empleado
  const registroCompleto = await Registro.findByPk(registro.id, {
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: ['id', 'nombre', 'apellido', 'puesto']
      }
    ]
  });

  res.json({
    success: true,
    message: 'Salida registrada exitosamente',
    data: registroCompleto
  });
});

/**
 * @desc    Crear un registro completo (entrada y salida)
 * @route   POST /api/registros
 * @access  Private (Admin/Supervisor)
 */
export const createRegistro = asyncHandler(async (req, res) => {
  const { empleado_id, fecha, hora_entrada, hora_salida, observaciones } = req.body;

  if (!empleado_id || !fecha) {
    res.status(400);
    throw new Error('Empleado ID y fecha son requeridos');
  }

  const nuevoRegistro = await Registro.create({
    empleado_id,
    fecha,
    hora_entrada,
    hora_salida,
    observaciones
  });

  const registroCompleto = await Registro.findByPk(nuevoRegistro.id, {
    include: [
      {
        model: Empleado,
        as: 'empleado'
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Registro creado exitosamente',
    data: registroCompleto
  });
});

/**
 * @desc    Actualizar un registro existente
 * @route   PUT /api/registros/:id
 * @access  Private (Admin/Supervisor)
 */
export const updateRegistro = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fecha, hora_entrada, hora_salida, observaciones } = req.body;

  const registro = await Registro.findByPk(id);

  if (!registro) {
    res.status(404);
    throw new Error(`Registro con ID ${id} no encontrado`);
  }

  await registro.update({
    fecha: fecha || registro.fecha,
    hora_entrada: hora_entrada !== undefined ? hora_entrada : registro.hora_entrada,
    hora_salida: hora_salida !== undefined ? hora_salida : registro.hora_salida,
    observaciones: observaciones !== undefined ? observaciones : registro.observaciones
  });

  const registroActualizado = await Registro.findByPk(id, {
    include: [
      {
        model: Empleado,
        as: 'empleado'
      }
    ]
  });

  res.json({
    success: true,
    message: 'Registro actualizado exitosamente',
    data: registroActualizado
  });
});

/**
 * @desc    Eliminar un registro (soft delete)
 * @route   DELETE /api/registros/:id
 * @access  Private (Admin)
 */
export const deleteRegistro = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const registro = await Registro.findByPk(id);

  if (!registro) {
    res.status(404);
    throw new Error(`Registro con ID ${id} no encontrado`);
  }

  // Soft delete (paranoid mode)
  await registro.destroy();

  res.json({
    success: true,
    message: 'Registro eliminado exitosamente',
    data: { id }
  });
});

/**
 * @desc    Obtener registros eliminados (soft deleted)
 * @route   GET /api/registros/eliminados
 * @access  Private (Admin)
 */
export const getRegistrosEliminados = asyncHandler(async (req, res) => {
  try {
    const registros = await Registro.findAll({
      paranoid: false,
      where: {
        deleted_at: {
          [Op.not]: null
        }
      },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id', 'nombre', 'apellido'],
          required: false,
          include: [
            {
              model: Departamento,
              as: 'departamento',
              attributes: ['id', 'nombre'],
              required: false
            }
          ]
        }
      ],
      order: [['deleted_at', 'DESC']]
    });

    res.json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    console.error('Error en getRegistrosEliminados:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener registros eliminados',
      error: error.toString()
    });
  }
});

/**
 * @desc    Restaurar un registro eliminado
 * @route   POST /api/registros/:id/restaurar
 * @access  Private (Admin)
 */
export const restaurarRegistro = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const registro = await Registro.findByPk(id, { paranoid: false });

  if (!registro) {
    res.status(404);
    throw new Error(`Registro con ID ${id} no encontrado`);
  }

  if (!registro.deleted_at) {
    res.status(400);
    throw new Error('El registro no está eliminado');
  }

  await registro.restore();

  const registroRestaurado = await Registro.findByPk(id, {
    include: [
      {
        model: Empleado,
        as: 'empleado'
      }
    ]
  });

  res.json({
    success: true,
    message: 'Registro restaurado exitosamente',
    data: registroRestaurado
  });
});

/**
 * @desc    Eliminar permanentemente un registro
 * @route   DELETE /api/registros/:id/permanente
 * @access  Private (Admin)
 */
export const eliminarRegistroPermanente = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const registro = await Registro.findByPk(id, { paranoid: false });

  if (!registro) {
    res.status(404);
    throw new Error(`Registro con ID ${id} no encontrado`);
  }

  // Hard delete (eliminación permanente)
  await registro.destroy({ force: true });

  res.json({
    success: true,
    message: 'Registro eliminado permanentemente',
    data: { id }
  });
});

/**
 * @desc    Obtener registros por rango de fechas
 * @route   GET /api/registros/rango
 * @access  Public
 */
export const getRegistrosByRangoFechas = asyncHandler(async (req, res) => {
  const { fecha_inicio, fecha_fin, empleado_id } = req.query;

  if (!fecha_inicio || !fecha_fin) {
    res.status(400);
    throw new Error('fecha_inicio y fecha_fin son requeridas');
  }

  const where = {
    fecha: {
      [Op.between]: [fecha_inicio, fecha_fin]
    }
  };

  if (empleado_id) {
    where.empleado_id = empleado_id;
  }

  const registros = await Registro.findAll({
    where,
    include: [
      {
        model: Empleado,
        as: 'empleado',
        attributes: ['id', 'nombre', 'apellido']
      }
    ],
    order: [['fecha', 'DESC']]
  });

  res.json({
    success: true,
    count: registros.length,
    data: registros
  });
});