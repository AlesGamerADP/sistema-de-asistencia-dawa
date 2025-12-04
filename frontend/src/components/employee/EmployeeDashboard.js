// src/components/employee/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { LogOut, LogIn, LogOutIcon, Briefcase, Clock, Calendar, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  marcarAsistencia,
  getEstadoActual,
  getMiHistorial,
  marcarEntradaJustificada,
  marcarSalidaJustificada,
  marcarSalidaIncidente
} from '../../api/employee';
import { ClockOutDialog } from './ClockOutDialog';
import { LateArrivalDialog } from './LateArrivalDialog';
import { EarlyExitDialog } from './EarlyExitDialog';
import { HistoryTable } from './HistoryTable';

export default function EmployeeDashboard({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [estado, setEstado] = useState(null); // 'fuera', 'dentro', 'completo'
  const [registroHoy, setRegistroHoy] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [markingAttendance, setMarkingAttendance] = useState(false);

  // Estados de diálogos
  const [showClockOutDialog, setShowClockOutDialog] = useState(false);
  const [showLateArrivalDialog, setShowLateArrivalDialog] = useState(false);
  const [showEarlyExitDialog, setShowEarlyExitDialog] = useState(false);
  const [lateArrivalInfo, setLateArrivalInfo] = useState(null);
  const [earlyExitInfo, setEarlyExitInfo] = useState(null);

  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (silent = false) => {
    try {
      console.log('🔄 Cargando datos del dashboard...');
      
      // Cargar estado actual
      const estadoResponse = await getEstadoActual();
      const estadoData = estadoResponse.data;
      
      console.log('📊 Estado recibido del backend:', estadoData);
      console.log('📅 Registro de hoy:', estadoData.data);
      
      setEstado(estadoData.status);
      if (estadoData.data) {
        setRegistroHoy(estadoData.data);
      } else {
        setRegistroHoy(null);
      }

      // Cargar historial
      const historialResponse = await getMiHistorial(30);
      setHistorial(historialResponse.data.data || []);
      
      console.log('✅ Datos cargados. Estado:', estadoData.status);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      if (!silent) toast.error('Error al cargar información del dashboard');
    }
  };

  const calcularMinutosTarde = (horaEsperada, horaActual) => {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const [hA, mA] = horaActual.split(':').map(Number);
    const minutosEsperados = hE * 60 + mE;
    const minutosActuales = hA * 60 + mA;
    return minutosActuales - minutosEsperados;
  };

  const calcularMinutosAnticipados = (horaEsperada, horaActual) => {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const [hA, mA] = horaActual.split(':').map(Number);
    const minutosEsperados = hE * 60 + mE;
    const minutosActuales = hA * 60 + mA;
    return minutosEsperados - minutosActuales;
  };

  const handleClockIn = async () => {
    if (estado !== 'fuera') {
      toast.error('Ya has registrado tu entrada hoy');
      return;
    }

    const horaActual = currentTime.toTimeString().slice(0, 5);
    const horaEntrada = user.hora_entrada || '09:00';

    // Verificar si llega tarde (más de 15 minutos)
    const minutosTarde = calcularMinutosTarde(horaEntrada, horaActual);
    
    if (minutosTarde > 15) {
      setLateArrivalInfo({
        scheduledTime: horaEntrada,
        actualTime: horaActual,
        minutesLate: minutosTarde
      });
      setShowLateArrivalDialog(true);
      return;
    }

    // Marcar entrada normal
    try {
      setMarkingAttendance(true);
      console.log('📝 Marcando entrada...');
      const response = await marcarAsistencia();
      
      console.log('✅ Respuesta de marcar entrada:', response);
      
      // Actualizar estado inmediatamente
      if (response.success) {
        console.log('🔄 Actualizando estado a "dentro"');
        setEstado('dentro');
        setRegistroHoy(response.data);
      }
      
      toast.success('✅ Entrada registrada exitosamente');
      // Recargar datos en segundo plano
      await loadDashboardData(true);
    } catch (error) {
      console.error('❌ Error al marcar entrada:', error);
      toast.error(error.response?.data?.message || 'Error al registrar entrada');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const handleClockOut = async () => {
    if (estado === 'completo') {
      toast.error('Ya has registrado tu salida hoy');
      return;
    }

    // Si no hay entrada, mostrar diálogo de incidencia
    if (estado === 'fuera') {
      setShowClockOutDialog(true);
      return;
    }

    const horaActual = currentTime.toTimeString().slice(0, 5);
    const horaSalida = user.hora_salida || '18:00';

    // Verificar si sale temprano
    const minutosAnticipados = calcularMinutosAnticipados(horaSalida, horaActual);
    
    if (minutosAnticipados > 0) {
      setEarlyExitInfo({
        scheduledTime: horaSalida,
        actualTime: horaActual,
        minutesEarly: minutosAnticipados
      });
      setShowEarlyExitDialog(true);
      return;
    }

    // Marcar salida normal
    try {
      setMarkingAttendance(true);
      console.log('📝 Marcando salida...');
      const response = await marcarAsistencia();
      
      console.log('✅ Respuesta de marcar salida:', response);
      
      // Actualizar estado inmediatamente
      if (response.success) {
        console.log('🔄 Actualizando estado a "completo"');
        setEstado('completo');
        setRegistroHoy(response.data);
      }
      
      toast.success('✅ Salida registrada exitosamente');
      // Recargar datos en segundo plano
      await loadDashboardData(true);
    } catch (error) {
      console.error('❌ Error al marcar salida:', error);
      toast.error(error.response?.data?.message || 'Error al registrar salida');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const handleLateArrivalConfirm = async (justificacion) => {
    try {
      setMarkingAttendance(true);
      const response = await marcarEntradaJustificada(justificacion);
      
      // Actualizar estado inmediatamente
      if (response.success) {
        setEstado('dentro');
        setRegistroHoy(response.data);
      }
      
      toast.success('✅ Entrada tardía registrada con justificación');
      setShowLateArrivalDialog(false);
      setLateArrivalInfo(null);
      loadDashboardData(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar entrada');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const handleEarlyExitConfirm = async (justificacion) => {
    try {
      setMarkingAttendance(true);
      const response = await marcarSalidaJustificada(justificacion);
      
      // Actualizar estado inmediatamente
      if (response.success) {
        setEstado('completo');
        setRegistroHoy(response.data);
      }
      
      toast.success('✅ Salida temprana registrada con justificación');
      setShowEarlyExitDialog(false);
      setEarlyExitInfo(null);
      loadDashboardData(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar salida');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const handleClockOutWithIncident = async (motivo) => {
    try {
      setMarkingAttendance(true);
      const response = await marcarSalidaIncidente(motivo);
      
      // Actualizar estado inmediatamente
      if (response.success) {
        setEstado('completo');
        setRegistroHoy(response.data);
      }
      
      toast.success('✅ Salida con incidente registrada');
      setShowClockOutDialog(false);
      loadDashboardData(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar incidente');
    } finally {
      setMarkingAttendance(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TimeTrack</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Asistencia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold">{user.nombre} {user.apellido}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.departamento?.nombre}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Clock Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Registro de Jornada</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentTime.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Clock In/Out Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleClockIn}
                    disabled={estado !== 'fuera' || markingAttendance}
                    size="lg"
                    className="w-full h-16 text-lg"
                    variant={estado === 'fuera' ? 'default' : 'outline'}
                  >
                    {markingAttendance && estado === 'fuera' ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-6 w-6 mr-3" />
                        Marcar Entrada
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClockOut}
                    disabled={estado === 'completo' || markingAttendance}
                    size="lg"
                    className="w-full h-16 text-lg"
                    variant={estado === 'dentro' ? 'destructive' : 'outline'}
                  >
                    {markingAttendance && estado !== 'fuera' ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <LogOutIcon className="h-6 w-6 mr-3" />
                        Marcar Salida
                      </>
                    )}
                  </Button>
                </div>

                {/* Today's Summary */}
                <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-4xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                    {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hora Actual</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">
                        {registroHoy?.hora_entrada 
                          ? new Date(registroHoy.hora_entrada).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            })
                          : '--:--'
                        }
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">Entrada</p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {registroHoy?.hora_salida 
                          ? new Date(registroHoy.hora_salida).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            })
                          : '--:--'
                        }
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">Salida</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {estado === 'completo' && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm text-center">
                  ✓ Has completado tu jornada de hoy.
                </div>
              )}
              {registroHoy?.observaciones && (
                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                  <p className="font-semibold mb-1">⚠️ Observaciones:</p>
                  <p>{registroHoy.observaciones}</p>
                </div>
              )}
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Historial de Registros (Últimos 30 días)</h3>
              <HistoryTable registros={historial} />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Mi Perfil</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user.nombre} {user.apellido}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user.departamento?.nombre}</span>
                </div>
                {user.tipo_empleo && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{user.tipo_empleo}</span>
                  </div>
                )}
                {user.hora_entrada && user.hora_salida && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Horario: {user.hora_entrada?.slice(0, 5)} - {user.hora_salida?.slice(0, 5)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <ClockOutDialog
        open={showClockOutDialog}
        onConfirm={handleClockOutWithIncident}
        onCancel={() => setShowClockOutDialog(false)}
      />

      {lateArrivalInfo && (
        <LateArrivalDialog
          open={showLateArrivalDialog}
          scheduledTime={lateArrivalInfo.scheduledTime}
          actualTime={lateArrivalInfo.actualTime}
          minutesLate={lateArrivalInfo.minutesLate}
          onConfirm={handleLateArrivalConfirm}
          onCancel={() => {
            setShowLateArrivalDialog(false);
            setLateArrivalInfo(null);
          }}
        />
      )}

      {earlyExitInfo && (
        <EarlyExitDialog
          open={showEarlyExitDialog}
          scheduledTime={earlyExitInfo.scheduledTime}
          actualTime={earlyExitInfo.actualTime}
          minutesEarly={earlyExitInfo.minutesEarly}
          onConfirm={handleEarlyExitConfirm}
          onCancel={() => {
            setShowEarlyExitDialog(false);
            setEarlyExitInfo(null);
          }}
        />
      )}
    </div>
  );
}