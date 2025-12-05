// src/components/employee/HistoryTable.js
import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export function HistoryTable({ registros }) {
  if (!registros || registros.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hay registros disponibles</p>
      </div>
    );
  }

  const formatTime = (time) => {
    if (!time) return '--:--';
    
    // Si viene un timestamp completo (ISO string)
    if (time.includes('T') || time.includes('Z')) {
      const date = new Date(time);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // Si ya es solo hora (HH:MM:SS)
    return time.slice(0, 5);
  };

  const formatDate = (date) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calcularHorasTrabajadas = (entrada, salida) => {
    if (!entrada || !salida) return '--';
    
    const [hE, mE, sE] = entrada.split(':').map(Number);
    const [hS, mS, sS] = salida.split(':').map(Number);
    
    const minutosEntrada = hE * 60 + mE;
    const minutosSalida = hS * 60 + mS;
    
    const minutosTrabajados = minutosSalida - minutosEntrada;
    const horas = Math.floor(minutosTrabajados / 60);
    const minutos = minutosTrabajados % 60;
    
    return `${horas}h ${minutos}m`;
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entrada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Salida
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Horas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {registros.map((registro) => (
              <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(registro.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {formatTime(registro.hora_entrada)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registro.hora_salida ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {formatTime(registro.hora_salida)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">En curso...</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {calcularHorasTrabajadas(registro.hora_entrada, registro.hora_salida)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {registro.observaciones ? (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{registro.observaciones}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {registros.map((registro) => (
          <div key={registro.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <Calendar className="h-4 w-4 text-indigo-600" />
                {formatDate(registro.fecha)}
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {calcularHorasTrabajadas(registro.hora_entrada, registro.hora_salida)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Entrada</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {formatTime(registro.hora_entrada)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Salida</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {registro.hora_salida ? formatTime(registro.hora_salida) : 'En curso...'}
                  </span>
                </div>
              </div>
            </div>

            {registro.observaciones && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">{registro.observaciones}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}