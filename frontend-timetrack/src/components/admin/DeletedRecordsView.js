/**
 * DeletedRecordsView - Vista de Registros Eliminados
 * 
 * Muestra todos los registros eliminados con opciones de restauración
 * y eliminación permanente.
 * 
 * @module components/admin/DeletedRecordsView
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  RotateCcw,
  Clock,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { restaurarRegistro, eliminarRegistroPermanente } from '../../api/admin';

export function DeletedRecordsView({ loading, records, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('deleted_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Filtrar y ordenar registros
  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    // Búsqueda por nombre
    if (searchTerm) {
      filtered = filtered.filter(r => {
        const nombre = `${r.empleado?.nombre || ''} ${r.empleado?.apellido || ''}`.toLowerCase();
        return nombre.includes(searchTerm.toLowerCase());
      });
    }

    // Filtro por fecha
    if (filterDate) {
      filtered = filtered.filter(r => r.fecha === filterDate);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deleted_desc':
          return new Date(b.deleted_at) - new Date(a.deleted_at);
        case 'deleted_asc':
          return new Date(a.deleted_at) - new Date(b.deleted_at);
        case 'fecha_desc':
          return new Date(b.fecha) - new Date(a.fecha);
        case 'fecha_asc':
          return new Date(a.fecha) - new Date(b.fecha);
        case 'nombre_asc':
          const nombreA = `${a.empleado?.nombre || ''} ${a.empleado?.apellido || ''}`;
          const nombreB = `${b.empleado?.nombre || ''} ${b.empleado?.apellido || ''}`;
          return nombreA.localeCompare(nombreB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [records, searchTerm, filterDate, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate, sortBy]);

  const handleRestore = async (id) => {
    if (!window.confirm('¿Deseas restaurar este registro?')) return;

    try {
      await restaurarRegistro(id);
      toast.success('Registro restaurado correctamente');
      onRefresh();
    } catch (error) {
      toast.error('Error al restaurar el registro');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('⚠️ ADVERTENCIA: Esta acción eliminará el registro PERMANENTEMENTE y no se podrá recuperar. ¿Estás seguro?')) return;

    try {
      await eliminarRegistroPermanente(id);
      toast.success('Registro eliminado permanentemente');
      onRefresh();
    } catch (error) {
      toast.error('Error al eliminar el registro');
    }
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.slice(0, 5);
  };

  const formatDate = (date) => {
    if (!date) return '--';
    // Agregar T00:00:00 para evitar conversión UTC
    return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '--';
    return new Date(datetime).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (entrada, salida) => {
    if (!entrada || !salida) return '--';
    const start = new Date(`2000-01-01T${entrada}`);
    const end = new Date(`2000-01-01T${salida}`);
    const diff = (end - start) / 1000 / 60 / 60;
    return `${diff.toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Alerta de advertencia */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
              Zona de Registros Eliminados
            </h4>
            <p className="text-sm text-red-700 dark:text-red-400">
              Estos registros han sido eliminados. Puedes restaurarlos o eliminarlos permanentemente.
            </p>
          </div>
        </div>
      </div>

      {/* Header con búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-4">
        {/* Barra superior con estado de actualización */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Indicador de auto-refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={autoRefresh ? 'Desactivar actualizaciones automáticas' : 'Activar actualizaciones automáticas'}
            >
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{autoRefresh ? 'Auto-actualización activa' : 'Auto-actualización pausada'}</span>
            </button>

            {/* Última actualización */}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
            </span>
          </div>

          {/* Botón de refresh manual */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filtros</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Panel de filtros expandible */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Original
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="deleted_desc">Eliminación (más reciente)</option>
                  <option value="deleted_asc">Eliminación (más antigua)</option>
                  <option value="fecha_desc">Fecha registro (más reciente)</option>
                  <option value="fecha_asc">Fecha registro (más antigua)</option>
                  <option value="nombre_asc">Nombre (A-Z)</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between px-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold text-gray-900 dark:text-white">{filteredRecords.length}</span> de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{records.length}</span> registros eliminados
        </p>
      </div>

      {/* Lista de registros */}
      <div className="space-y-3">
        <AnimatePresence>
          {paginatedRecords.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No hay registros eliminados
              </p>
            </motion.div>
          ) : (
            paginatedRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 border-red-500"
              >
                {/* Header del registro */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Nombre y departamento */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {record.empleado?.nombre} {record.empleado?.apellido}
                          </h3>
                          {record.empleado?.departamento && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Building2 className="w-4 h-4" />
                              <span>{record.empleado.departamento.nombre}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fecha de eliminación */}
                      <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-400">
                          <span className="font-medium">Eliminado el:</span> {formatDateTime(record.deleted_at)}
                        </p>
                      </div>

                      {/* Grid de información */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Fecha */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formatDate(record.fecha)}
                          </span>
                        </div>

                        {/* Entrada */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Entrada:</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formatTime(record.hora_entrada)}
                          </span>
                        </div>

                        {/* Salida */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${record.hora_salida ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                          <span className="text-gray-600 dark:text-gray-400">Salida:</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formatTime(record.hora_salida)}
                          </span>
                        </div>
                      </div>

                      {/* Duración */}
                      {record.hora_salida && (
                        <div className="flex items-center gap-2 text-sm mt-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">Duración:</span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {calculateDuration(record.hora_entrada, record.hora_salida)}
                          </span>
                        </div>
                      )}

                      {/* Observaciones */}
                      {record.observaciones && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Observaciones:</span> {record.observaciones}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRestore(record.id)}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Restaurar registro"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(record.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default DeletedRecordsView;