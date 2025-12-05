// src/api/admin.js
import client from "./client";

/**
 * LISTADO: usamos /usuarios (tu backend lo tiene y puede incluir la relación empleado)
 */
export const getUsuarios = () => client.get("/usuarios");

/**
 * CREACIÓN/EDICIÓN/ELIMINACIÓN DE EMPLEADOS
 * Estas rutas dependen de tu backend. Si /empleados aún falla, dime y lo ajustamos.
 */
export const createEmpleado = (data) => client.post("/empleados", data);
export const updateEmpleado = (id, data) => client.put(`/empleados/${id}`, data);
export const deleteEmpleado = (id) => client.delete(`/empleados/${id}`);

/**
 * CREAR USUARIO (credenciales) ligado a un empleado existente
 * Espera { username, contraseña, rol, empleado_id }
 */
export const createUsuario = (data) => client.post("/usuarios", data);

/**
 * DEPARTAMENTOS (si tu backend no expone esta ruta, el componente hace fallback)
 */
export const getDepartamentos = () => client.get("/departamentos");

/**
 * REGISTROS
 */
export const getRegistros = (params) => client.get("/registros", { params });
export const getRegistrosRango = (params) =>
  client.get("/registros/rango", { params });

/**
 * REGISTROS ELIMINADOS
 */
export const getRegistrosEliminados = () => client.get("/registros/eliminados");
export const restaurarRegistro = (id) => client.post(`/registros/${id}/restaurar`);
export const eliminarRegistroPermanente = (id) => 
  client.delete(`/registros/${id}/permanente`);

/**
 * ELIMINAR REGISTRO (soft delete)
 */
export const deleteRegistro = (id) => client.delete(`/registros/${id}`);
