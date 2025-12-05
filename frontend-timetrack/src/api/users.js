/**
 * API de Usuarios
 * 
 * Funciones para gestión de usuarios (CRUD)
 * Solo accesible para usuarios administradores
 * 
 * @module api/users
 */

import apiClient from './client';

/**
 * Obtener todos los usuarios
 * 
 * @returns {Promise<Array>} - Lista de usuarios
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtener un usuario por ID
 * 
 * @param {number} id - ID del usuario
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

/**
 * Crear un nuevo usuario
 * 
 * @param {Object} userData - Datos del nuevo usuario
 * @returns {Promise<Object>} - Usuario creado
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualizar un usuario existente
 * 
 * @param {number} id - ID del usuario
 * @param {Object} userData - Datos actualizados
 * @returns {Promise<Object>} - Usuario actualizado
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Eliminar un usuario
 * 
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise<Object>} - Confirmación de eliminación
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
