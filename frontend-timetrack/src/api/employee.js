// src/api/employee.js
import client from "./client";

// ========================================
// REGISTROS DE ASISTENCIA - EMPLEADO
// ========================================

/**
 * Marcar entrada o salida automática
 * El backend decide si es entrada o salida según el estado actual
 */
export const marcarAsistencia = async (observaciones = '') => {
  // Enviar hora y fecha local del navegador
  const now = new Date();
  const horaLocal = now.toTimeString().slice(0, 8); // HH:MM:SS
  
  // Obtener fecha local (no UTC)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const fechaLocal = `${year}-${month}-${day}`; // YYYY-MM-DD
  
  const response = await client.post("/registros/marcar", { 
    observaciones,
    hora: horaLocal,
    fecha: fechaLocal
  });
  return response.data;
};

/**
 * Obtener estado actual del empleado (fuera/dentro/completo)
 */
export const getEstadoActual = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const fechaLocal = `${year}-${month}-${day}`;
  
  const response = await client.get(`/registros/mi-estado?fecha=${fechaLocal}&_=${now.getTime()}`);
  return response.data;
};

/**
 * Obtener historial de registros del empleado autenticado
 * @param {number} limit - Cantidad de registros a obtener (default: 30)
 */
export const getMiHistorial = async (limit = 30) => {
  const response = await client.get(`/registros/mi-historial?limit=${limit}&_=${new Date().getTime()}`);
  return response.data;
};

/**
 * Marcar entrada con justificación (llegada tarde)
 * @param {string} justificacion - Motivo de la llegada tarde
 */
export const marcarEntradaJustificada = async (justificacion) => {
  const now = new Date();
  const horaLocal = now.toTimeString().slice(0, 8);
  
  // Obtener fecha local (no UTC)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const fechaLocal = `${year}-${month}-${day}`;
  
  const response = await client.post("/registros/entrada-justificada", { 
    justificacion,
    hora: horaLocal,
    fecha: fechaLocal
  });
  return response.data;
};

/**
 * Marcar salida con justificación (salida temprana)
 * @param {string} justificacion - Motivo de la salida temprana
 */
export const marcarSalidaJustificada = async (justificacion) => {
  const now = new Date();
  const horaLocal = now.toTimeString().slice(0, 8);
  
  // Obtener fecha local (no UTC)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const fechaLocal = `${year}-${month}-${day}`;
  
  const response = await client.post("/registros/salida-justificada", { 
    justificacion,
    hora: horaLocal,
    fecha: fechaLocal
  });
  return response.data;
};

/**
 * Marcar salida sin entrada (incidente)
 * @param {string} motivo - Motivo del incidente
 */
export const marcarSalidaIncidente = async (motivo) => {
  const response = await client.post("/registros/salida-incidente", { motivo });
  return response.data;
};