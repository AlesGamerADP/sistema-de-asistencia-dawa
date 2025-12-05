/**
 * Index - Punto de entrada de la aplicación React
 * 
 * Renderiza el componente App en el DOM
 * Incluye estilos globales y configuración inicial
 * 
 * @module index
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/globals.css';
import App from './App';

/**
 * Crear y renderizar la aplicación React
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);