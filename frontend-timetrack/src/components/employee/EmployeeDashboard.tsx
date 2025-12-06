import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TimeEntryTable } from './TimeEntryTable';
import { ClockOutDialog } from './ClockOutDialog';
import { LateArrivalDialog } from './LateArrivalDialog';
import { EarlyExitDialog } from './EarlyExitDialog';
import { LogOut, LogIn, LogOutIcon, Briefcase, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Tipos locales (temporalmente, hasta que se definan en un archivo de tipos compartido)
interface User {
  id: string;
  username: string;
  name: string;
  role: 'employee' | 'supervisor';
  department?: string;
  employmentType?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
}

interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime?: string;
  totalHours: number;
  description: string;
  hasIncident: boolean;
  incidentReason?: string;
  isLate: boolean;
  lateReason?: string;
  isEarlyExit: boolean;
  earlyExitReason?: string;
  deleted: boolean;
  deletedReason?: string;
  deletedBy?: string;
  deletedAt?: string;
}

interface EmployeeDashboardProps {
  user: User;
  timeEntries: TimeEntry[];
  onLogout: () => void;
  onClockIn: (lateReason?: string) => void;
  onClockOut: (incidentReason?: string, earlyExitReason?: string) => void;
}

export function EmployeeDashboard({ user, timeEntries, onLogout, onClockIn, onClockOut }: EmployeeDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showClockOutDialog, setShowClockOutDialog] = useState(false);
  const [showLateArrivalDialog, setShowLateArrivalDialog] = useState(false);
  const [showEarlyExitDialog, setShowEarlyExitDialog] = useState(false);
  const [lateArrivalInfo, setLateArrivalInfo] = useState<{ scheduledTime: string; actualTime: string; minutesLate: number } | null>(null);
  const [earlyExitInfo, setEarlyExitInfo] = useState<{ scheduledTime: string; actualTime: string; minutesEarly: number } | null>(null);

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeEntries = timeEntries.filter(e => !e.deleted);
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = activeEntries.find(e => e.date === today);
  const hasClockIn = Boolean(todayEntry && !todayEntry.endTime);
  const hasCompleted = Boolean(todayEntry && todayEntry.endTime);

  const handleClockInClick = () => {
    if (hasClockIn || hasCompleted) {
      toast.error('Ya has marcado entrada hoy');
      return;
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Verificar si llega tarde (más de 15 minutos)
    if (user.scheduledStartTime) {
      const [scheduledHour, scheduledMin] = user.scheduledStartTime.split(':').map(Number);
      const [currentHour, currentMin] = currentTime.split(':').map(Number);
      
      const scheduledMinutes = scheduledHour * 60 + scheduledMin;
      const currentMinutes = currentHour * 60 + currentMin;
      const minutesLate = currentMinutes - scheduledMinutes;
      
      if (minutesLate > 15) {
        // Mostrar diálogo de justificación
        setLateArrivalInfo({
          scheduledTime: user.scheduledStartTime,
          actualTime: currentTime,
          minutesLate
        });
        setShowLateArrivalDialog(true);
        return;
      }
    }

    // Marcar entrada normal
    onClockIn();
    toast.success('Entrada registrada exitosamente');
  };

  const handleClockOutClick = () => {
    if (hasCompleted) {
      toast.error('Ya has marcado salida hoy');
      return;
    }

    // Si no hay entrada, mostrar diálogo de incurrencia
    if (!hasClockIn) {
      setShowClockOutDialog(true);
      return;
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Verificar si sale temprano
    if (user.scheduledEndTime) {
      const [scheduledEndHour, scheduledEndMin] = user.scheduledEndTime.split(':').map(Number);
      const [currentHour, currentMin] = currentTime.split(':').map(Number);
      
      const scheduledEndMinutes = scheduledEndHour * 60 + scheduledEndMin;
      const currentMinutes = currentHour * 60 + currentMin;
      const minutesEarly = scheduledEndMinutes - currentMinutes;
      
      if (minutesEarly > 0) {
        // Mostrar diálogo de justificación
        setEarlyExitInfo({
          scheduledTime: user.scheduledEndTime,
          actualTime: currentTime,
          minutesEarly
        });
        setShowEarlyExitDialog(true);
        return;
      }
    }

    // Marcar salida normal
    onClockOut();
    toast.success('Salida registrada exitosamente');
  };

  const handleClockOutWithIncident = (reason: string) => {
    onClockOut(reason);
    setShowClockOutDialog(false);
    toast.success('Salida registrada con incurrencia');
  };

  const handleLateArrivalConfirm = (reason: string) => {
    onClockIn(reason);
    setShowLateArrivalDialog(false);
    setLateArrivalInfo(null);
    toast.success('Entrada tardía registrada con justificación');
  };

  const handleEarlyExitConfirm = (reason: string) => {
    onClockOut(undefined, reason);
    setShowEarlyExitDialog(false);
    setEarlyExitInfo(null);
    toast.success('Salida temprana registrada con justificación');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Moderno */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg">
                <h1 className="tracking-tight">EISB&M</h1>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-slate-900">Registro de Horarios</h2>
                  {user.department && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {user.department}
                    </Badge>
                  )}
                  {user.employmentType && (
                    <Badge variant={user.employmentType === 'Full-time' ? 'default' : 'secondary'} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {user.employmentType}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">👋 Hola, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="border-slate-300 hover:bg-slate-100">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Clock Buttons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule - Diseño Moderno */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Registro de Hoy
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-md">
                    <p className="text-sm text-emerald-700 mb-2 uppercase tracking-wide">Entrada</p>
                    <p className="text-4xl text-emerald-900 tabular-nums">
                      {todayEntry?.startTime || '--:--'}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-md">
                    <p className="text-sm text-blue-700 mb-2 uppercase tracking-wide">Salida</p>
                    <p className="text-4xl text-blue-900 tabular-nums">
                      {todayEntry?.endTime || '--:--'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clock Buttons - Botones Modernos */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleClockInClick}
                disabled={hasClockIn || hasCompleted}
                size="lg"
                className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 shadow-xl rounded-2xl border-0 text-white"
              >
                <LogIn className="h-10 w-10 mr-3" />
                <div className="text-left">
                  <div className="text-xl">Marcar</div>
                  <div className="text-sm opacity-90">Entrada</div>
                </div>
              </Button>

              <Button
                onClick={handleClockOutClick}
                disabled={hasCompleted}
                size="lg"
                className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 shadow-xl rounded-2xl border-0 text-white"
              >
                <LogOutIcon className="h-10 w-10 mr-3" />
                <div className="text-left">
                  <div className="text-xl">Marcar</div>
                  <div className="text-sm opacity-90">Salida</div>
                </div>
              </Button>
            </div>

            {hasCompleted && todayEntry && (
              <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
                <p className="text-green-800">
                  ✓ Has completado tu registro de hoy ({todayEntry.totalHours} horas)
                </p>
              </div>
            )}

            {/* Notifications */}
            {todayEntry?.hasIncident && (
              <div className="p-4 bg-orange-100 rounded-lg border border-orange-300">
                <p className="text-orange-800">
                  ⚠️ Incurrencia registrada: {todayEntry.incidentReason}
                </p>
              </div>
            )}

            {todayEntry?.isLate && (
              <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                <p className="text-yellow-800">
                  🕐 Llegada tardía registrada: {todayEntry.lateReason}
                </p>
              </div>
            )}

            {todayEntry?.isEarlyExit && (
              <div className="p-4 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-purple-800">
                  ⏰ Salida temprana registrada: {todayEntry.earlyExitReason}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Current Time - Diseño Moderno */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-indigo-900 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
              <CardHeader className="relative">
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Fecha y Hora
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 relative">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-300 mb-2">Fecha</p>
                  <p className="text-base text-slate-100 leading-relaxed">
                    {currentTime.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {user.scheduledStartTime && user.scheduledEndTime && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs uppercase tracking-wide text-slate-300 mb-2">Horario Asignado</p>
                    <p className="text-lg text-white tabular-nums">
                      {user.scheduledStartTime} - {user.scheduledEndTime}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wide text-slate-300 mb-2">Hora Actual</p>
                  <p className="text-5xl tabular-nums text-white">
                    {currentTime.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeEntryTable entries={timeEntries} showUserColumn={false} />
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <ClockOutDialog
        isOpen={showClockOutDialog}
        onConfirm={handleClockOutWithIncident}
        onClose={() => setShowClockOutDialog(false)}
      />

      {lateArrivalInfo && (
        <LateArrivalDialog
          isOpen={showLateArrivalDialog}
          scheduledTime={lateArrivalInfo.scheduledTime}
          actualTime={lateArrivalInfo.actualTime}
          minutesLate={lateArrivalInfo.minutesLate}
          onConfirm={handleLateArrivalConfirm}
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
          onConfirm={handleEarlyExitConfirm}
          onClose={() => {
            setShowEarlyExitDialog(false);
            setEarlyExitInfo(null);
          }}
        />
      )}
    </div>
  );
}
