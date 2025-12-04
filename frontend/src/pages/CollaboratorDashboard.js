/**
 * CollaboratorDashboard - Panel de Colaborador
 * 
 * Vista principal para empleados/colaboradores con control de asistencia
 * 
 * @module pages/CollaboratorDashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Clock, 
  LogOut, 
  Calendar, 
  UserCircle,
  Briefcase,
  Building2,
  AlertCircle,
  LogIn,
  LogOutIcon
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { 
  marcarAsistencia, 
  getEstadoActual, 
  getMiHistorial,
  marcarEntradaJustificada,
  marcarSalidaJustificada,
  marcarSalidaIncidente
} from '../api/employee';
import { ClockOutDialog } from '../components/employee/ClockOutDialog';
import { LateArrivalDialog } from '../components/employee/LateArrivalDialog';
import { EarlyExitDialog } from '../components/employee/EarlyExitDialog';
import { HistoryTable } from '../components/employee/HistoryTable';

export function CollaboratorDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // Estados
  const [currentTime, setCurrentTime] = useState(new Date());
  const [estado, setEstado] = useState('fuera');
  const [registroHoy, setRegistroHoy] = useState(null);
  const [historial, setHistorial] = useState([]);

  // Estados de diálogos
  const [showClockOutDialog, setShowClockOutDialog] = useState(false);
  const [showLateArrivalDialog, setShowLateArrivalDialog] = useState(false);
  const [showEarlyExitDialog, setShowEarlyExitDialog] = useState(false);
  const [lateArrivalInfo, setLateArrivalInfo] = useState(null);
  const [earlyExitInfo, setEarlyExitInfo] = useState(null);

  /**
   * Verificar autenticación
   */
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Actualizar hora actual cada segundo
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Cargar datos del dashboard
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Cargar estado actual e historial
   */
  const loadDashboardData = async () => {
    try {
      // Cargar estado actual
      const estadoRes = await getEstadoActual();
      
      if (estadoRes.success) {
        setEstado(estadoRes.status);
        setRegistroHoy(estadoRes.data || null);
      }

      // Cargar historial (últimos 30 días, mostrar solo los 5 más recientes)
      const historialRes = await getMiHistorial(30);
      
      if (historialRes.success) {
        // Tomar solo los últimos 5 registros
        const ultimosRegistros = (historialRes.data || []).slice(0, 5);
        setHistorial(ultimosRegistros);
      }
    } catch (error) {
      toast.error('Error al cargar los datos del dashboard');
    }
  };

  /**
   * Calcular minutos de retraso
   */
  const calcularMinutosTarde = (horaEntrada, horaEsperada) => {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const entrada = new Date(horaEntrada);
    const esperada = new Date(entrada.getFullYear(), entrada.getMonth(), entrada.getDate(), hE, mE, 0, 0);
    return Math.max(0, Math.floor((entrada - esperada) / 60000));
  };

  /**
   * Calcular minutos de anticipación en salida
   */
  const calcularMinutosAnticipados = (horaSalida, horaEsperada) => {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const salida = new Date(horaSalida);
    const esperada = new Date(salida.getFullYear(), salida.getMonth(), salida.getDate(), hE, mE, 0, 0);
    return Math.max(0, Math.floor((esperada - salida) / 60000));
  };

  /**
   * Manejar marcado de entrada
   */
  const handleClockIn = async () => {
    try {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().slice(0, 5);
      const horaEntrada = user?.empleado?.hora_entrada || '09:00';

      // Calcular si llega tarde (> 15 minutos)
      const minutosTarde = calcularMinutosTarde(ahora, horaEntrada);

      if (minutosTarde > 15) {
        // Mostrar diálogo de llegada tarde
        setLateArrivalInfo({
          scheduledTime: horaEntrada,
          actualTime: horaActual,
          minutesLate: minutosTarde
        });
        setShowLateArrivalDialog(true);
        return;
      }

      // Marcar entrada normal
      const res = await marcarAsistencia();
      
      if (res && res.success) {
        toast.success('Entrada registrada correctamente');
        await loadDashboardData();
      } else {
        toast.warning('La petición se completó pero sin confirmación');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al marcar entrada');
    }
  };

  /**
   * Manejar marcado de salida
   */
  const handleClockOut = async () => {
    try {
      // Si no hay entrada registrada hoy, mostrar diálogo de incidente
      if (!registroHoy || !registroHoy.hora_entrada) {
        setShowClockOutDialog(true);
        return;
      }

      const ahora = new Date();
      const horaActual = ahora.toTimeString().slice(0, 5);
      const horaSalida = user?.empleado?.hora_salida || '18:00';

      // Calcular si sale temprano (> 15 minutos antes)
      const minutosAnticipados = calcularMinutosAnticipados(ahora, horaSalida);

      if (minutosAnticipados > 15) {
        // Mostrar diálogo de salida anticipada
        setEarlyExitInfo({
          scheduledTime: horaSalida,
          actualTime: horaActual,
          minutesEarly: minutosAnticipados
        });
        setShowEarlyExitDialog(true);
        return;
      }

      // Marcar salida normal
      const res = await marcarAsistencia();
      
      if (res && res.success) {
        toast.success('Salida registrada correctamente');
        await loadDashboardData();
      } else {
        toast.warning('La petición se completó pero sin confirmación');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al marcar salida');
    }
  };

  /**
   * Manejar confirmación de llegada tarde
   */
  const handleConfirmLateArrival = async (justificacion) => {
    try {
      const res = await marcarEntradaJustificada(justificacion);
      
      if (res && res.success) {
        toast.success('Entrada con justificación registrada');
        setShowLateArrivalDialog(false);
        await loadDashboardData();
      } else {
        toast.warning('La petición se completó pero sin confirmación');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar entrada');
    }
  };

  /**
   * Manejar confirmación de salida anticipada
   */
  const handleConfirmEarlyExit = async (justificacion) => {
    try {
      const res = await marcarSalidaJustificada(justificacion);
      if (res.success) {
        toast.success('Salida anticipada con justificación registrada');
        setShowEarlyExitDialog(false);
        await loadDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar salida');
    }
  };

  /**
   * Manejar confirmación de salida sin entrada
   */
  const handleConfirmClockOut = async (motivo) => {
    try {
      const res = await marcarSalidaIncidente(motivo);
      if (res.success) {
        toast.warning('Incidente registrado: Salida sin entrada');
        setShowClockOutDialog(false);
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error al registrar incidente');
    }
  };

  /**
   * Manejar cierre de sesión
   */
  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/', { replace: true });
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
                <p className="font-semibold">{user?.empleado?.nombre} {user?.empleado?.apellido}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.empleado?.departamento?.nombre}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
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
                    disabled={estado === 'dentro' || estado === 'completo'}
                    size="lg"
                    className="w-full h-16 text-lg"
                    variant={estado === 'fuera' ? 'default' : 'outline'}
                  >
                    <LogIn className="h-6 w-6 mr-3" />
                    Marcar Entrada
                  </Button>
                  <Button
                    onClick={handleClockOut}
                    disabled={estado === 'completo'}
                    size="lg"
                    className="w-full h-16 text-lg"
                    variant={estado === 'dentro' ? 'destructive' : 'outline'}
                  >
                    <LogOutIcon className="h-6 w-6 mr-3" />
                    Marcar Salida
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
                      <p className="font-semibold">{registroHoy?.hora_entrada?.slice(0, 5) || '--:--'}</p>
                      <p className="text-gray-500 dark:text-gray-400">Entrada</p>
                    </div>
                    <div>
                      <p className="font-semibold">{registroHoy?.hora_salida?.slice(0, 5) || '--:--'}</p>
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
              <h3 className="text-lg font-semibold mb-4">Historial de Registros (Últimos 5 días)</h3>
              <HistoryTable registros={historial} />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Mi Perfil</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserCircle className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user?.empleado?.nombre} {user?.empleado?.apellido}</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user?.empleado?.departamento?.nombre}</span>
                </div>
                {user?.empleado?.puesto && (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{user.empleado.puesto}</span>
                  </div>
                )}
                {user?.empleado?.hora_entrada && user?.empleado?.hora_salida && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Horario: {user.empleado.hora_entrada?.slice(0, 5)} - {user.empleado.hora_salida?.slice(0, 5)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <ClockOutDialog
        isOpen={showClockOutDialog}
        onConfirm={handleConfirmClockOut}
        onClose={() => setShowClockOutDialog(false)}
      />

      {lateArrivalInfo && (
        <LateArrivalDialog
          isOpen={showLateArrivalDialog}
          scheduledTime={lateArrivalInfo.scheduledTime}
          actualTime={lateArrivalInfo.actualTime}
          minutesLate={lateArrivalInfo.minutesLate}
          onConfirm={handleConfirmLateArrival}
          onClose={() => {
            setShowLateArrivalDialog(false);
            setLateArrivalInfo(null);
          }}
        />
      )}

      {earlyExitInfo && (
        <EarlyExitDialog
          isOpen={showEarlyExitDialog}
          scheduledTime={earlyExitInfo.scheduledTime}
          actualTime={earlyExitInfo.actualTime}
          minutesEarly={earlyExitInfo.minutesEarly}
          onConfirm={handleConfirmEarlyExit}
          onClose={() => {
            setShowEarlyExitDialog(false);
            setEarlyExitInfo(null);
          }}
        />
      )}
    </div>
  );
}

export default CollaboratorDashboard;