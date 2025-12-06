/**
 * CollaboratorDashboard - Panel de Colaborador
 * 
 * Vista principal para empleados/colaboradores con control de asistencia
 * 
 * @module pages/CollaboratorDashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

interface RegistroHoy {
  hora_entrada?: string;
  hora_salida?: string;
  observaciones?: string;
  [key: string]: any;
}

interface LateArrivalInfo {
  scheduledTime: string;
  actualTime: string;
  minutesLate: number;
}

interface EarlyExitInfo {
  scheduledTime: string;
  actualTime: string;
  minutesEarly: number;
}

export function CollaboratorDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // Estados
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [estado, setEstado] = useState<'fuera' | 'dentro' | 'completo'>('fuera');
  const [registroHoy, setRegistroHoy] = useState<RegistroHoy | null>(null);
  const [historial, setHistorial] = useState<any[]>([]);

  // Estados de diálogos
  const [showClockOutDialog, setShowClockOutDialog] = useState(false);
  const [showLateArrivalDialog, setShowLateArrivalDialog] = useState(false);
  const [showEarlyExitDialog, setShowEarlyExitDialog] = useState(false);
  const [lateArrivalInfo, setLateArrivalInfo] = useState<LateArrivalInfo | null>(null);
  const [earlyExitInfo, setEarlyExitInfo] = useState<EarlyExitInfo | null>(null);

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
        setEstado(estadoRes.status as 'fuera' | 'dentro' | 'completo');
        setRegistroHoy(estadoRes.data || null);
      }

      // Cargar historial (últimos 30 días, mostrar solo los 5 más recientes)
      const historialRes = await getMiHistorial(30);
      
      if (historialRes.success) {
        // Tomar solo los últimos 5 registros
        const ultimosRegistros = (historialRes.data || []).slice(0, 5);
        setHistorial(ultimosRegistros);
      }
    } catch (error: any) {
      toast.error('Error al cargar los datos del dashboard');
    }
  };

  /**
   * Calcular minutos de retraso
   */
  const calcularMinutosTarde = (horaEntrada: Date, horaEsperada: string): number => {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const entrada = new Date(horaEntrada);
    const esperada = new Date(entrada.getFullYear(), entrada.getMonth(), entrada.getDate(), hE, mE, 0, 0);
    return Math.max(0, Math.floor((entrada.getTime() - esperada.getTime()) / 60000));
  };

  /**
   * Calcular minutos de anticipación en salida
   */
  const calcularMinutosAnticipados = (horaSalida: Date, horaEsperada: string): number => {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const salida = new Date(horaSalida);
    const esperada = new Date(salida.getFullYear(), salida.getMonth(), salida.getDate(), hE, mE, 0, 0);
    return Math.max(0, Math.floor((esperada.getTime() - salida.getTime()) / 60000));
  };

  /**
   * Manejar marcado de entrada
   */
  const handleClockIn = async () => {
    try {
      console.log('🔵 Intentando marcar entrada...');
      const ahora = new Date();
      const horaActual = ahora.toTimeString().slice(0, 5);
      const horaEntrada = (user as any)?.empleado?.hora_entrada || '09:00';

      // Calcular si llega tarde (> 15 minutos)
      const minutosTarde = calcularMinutosTarde(ahora, horaEntrada);
      console.log('⏰ Minutos tarde:', minutosTarde);

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
      console.log('📝 Llamando a marcarAsistencia()...');
      const res = await marcarAsistencia();
      console.log('✅ Respuesta de marcarAsistencia:', res);
      
      if (res && res.success) {
        toast.success('Entrada registrada correctamente');
        await loadDashboardData();
      } else {
        toast.warning('La petición se completó pero sin confirmación');
      }
    } catch (error: any) {
      console.error('❌ Error al marcar entrada:', error);
      console.error('Response data:', error.response?.data);
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
      const horaSalida = (user as any)?.empleado?.hora_salida || '18:00';

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al marcar salida');
    }
  };

  /**
   * Manejar confirmación de llegada tarde
   */
  const handleConfirmLateArrival = async (justificacion: string) => {
    try {
      const res = await marcarEntradaJustificada(justificacion);
      
      if (res && res.success) {
        toast.success('Entrada con justificación registrada');
        setShowLateArrivalDialog(false);
        await loadDashboardData();
      } else {
        toast.warning('La petición se completó pero sin confirmación');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar entrada');
    }
  };

  /**
   * Manejar confirmación de salida anticipada
   */
  const handleConfirmEarlyExit = async (justificacion: string) => {
    try {
      const res = await marcarSalidaJustificada(justificacion);
      if (res.success) {
        toast.success('Salida anticipada con justificación registrada');
        setShowEarlyExitDialog(false);
        await loadDashboardData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar salida');
    }
  };

  /**
   * Manejar confirmación de salida sin entrada
   */
  const handleConfirmClockOut = async (motivo: string) => {
    try {
      const res = await marcarSalidaIncidente(motivo);
      if (res.success) {
        toast.warning('Incidente registrado: Salida sin entrada');
        setShowClockOutDialog(false);
        await loadDashboardData();
      }
    } catch (error: any) {
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
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Panel de Colaborador</h1>
              <p className="text-sm text-gray-500 mt-1">
                {(user as any)?.empleado?.nombre} {(user as any)?.empleado?.apellido}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clock Actions Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Registro de Jornada</h3>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Clock In/Out Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleClockIn}
                    disabled={estado === 'dentro' || estado === 'completo'}
                    size="lg"
                    className="w-full h-14 text-base font-medium rounded-xl"
                    variant={estado === 'fuera' ? 'default' : 'outline'}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Marcar Entrada
                  </Button>
                  <Button
                    onClick={handleClockOut}
                    disabled={estado === 'completo'}
                    size="lg"
                    className="w-full h-14 text-base font-medium rounded-xl"
                    variant={estado === 'dentro' ? 'default' : 'outline'}
                  >
                    <LogOutIcon className="h-5 w-5 mr-2" />
                    Marcar Salida
                  </Button>
                </div>

                {/* Today's Summary */}
                <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-5xl font-bold tabular-nums text-blue-600 mb-2">
                    {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm font-medium text-gray-600 mb-6">Hora Actual</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-xl p-3">
                      <p className="text-2xl font-bold text-gray-900">{registroHoy?.hora_entrada?.slice(0, 5) || '--:--'}</p>
                      <p className="text-xs text-gray-600 mt-1">Entrada</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3">
                      <p className="text-2xl font-bold text-gray-900">{registroHoy?.hora_salida?.slice(0, 5) || '--:--'}</p>
                      <p className="text-xs text-gray-600 mt-1">Salida</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {estado === 'completo' && (
                <motion.div 
                  className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm text-center border border-emerald-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ✓ Has completado tu jornada de hoy.
                </motion.div>
              )}
              {registroHoy?.observaciones && (
                <motion.div 
                  className="mt-6 p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="font-semibold mb-1">⚠️ Observaciones:</p>
                  <p>{registroHoy.observaciones}</p>
                </motion.div>
              )}
            </motion.div>

            {/* History Table */}
            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Historial de Registros</h3>
              <HistoryTable registros={historial} />
            </motion.div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Mi Perfil</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{(user as any)?.empleado?.nombre} {(user as any)?.empleado?.apellido}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{(user as any)?.empleado?.departamento?.nombre}</span>
                </div>
                {(user as any)?.empleado?.puesto && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{(user as any).empleado.puesto}</span>
                  </div>
                )}
                {(user as any)?.empleado?.hora_entrada && (user as any)?.empleado?.hora_salida && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{(user as any).empleado.hora_entrada?.slice(0, 5)} - {(user as any).empleado.hora_salida?.slice(0, 5)}</span>
                  </div>
                )}
              </div>
            </motion.div>
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
    </motion.div>
  );
}

// Export default para React Router (no para Next.js)
export default CollaboratorDashboard;

