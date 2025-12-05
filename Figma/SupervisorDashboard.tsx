import { useState } from 'react';
import { User, TimeEntry } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TimeEntryTable } from './TimeEntryTable';
import { DeleteEntryDialog } from './DeleteEntryDialog';
import { HoursSummary } from './HoursSummary';
import { EmployeeManagement } from './EmployeeManagement';
import { LogOut, Users, Clock, AlertCircle, BarChart3, UserCog } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface SupervisorDashboardProps {
  user: User;
  users: User[];
  timeEntries: TimeEntry[];
  onLogout: () => void;
  onDeleteEntry: (entryId: string, reason: string) => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, user: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

export function SupervisorDashboard({ user, users, timeEntries, onLogout, onDeleteEntry, onAddUser, onUpdateUser, onDeleteUser }: SupervisorDashboardProps) {
  const [entryToDelete, setEntryToDelete] = useState<TimeEntry | null>(null);

  const activeEntries = timeEntries.filter(e => !e.deleted);
  const deletedEntries = timeEntries.filter(e => e.deleted);
  const uniqueEmployees = new Set(timeEntries.map(e => e.userName)).size;
  const totalEmployees = users.filter(u => u.role === 'employee').length;

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
                <h2 className="text-slate-900">Panel de Administración</h2>
                <p className="text-sm text-slate-600">👋 Bienvenido, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2 border-slate-300 hover:bg-slate-100">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview - Diseño Moderno */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-blue-100">Total Empleados</CardDescription>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-5xl mb-2">{totalEmployees}</CardTitle>
              <p className="text-sm text-blue-100">
                {uniqueEmployees} con registros activos
              </p>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-emerald-100">Registros Activos</CardDescription>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-5xl mb-2">{activeEntries.length}</CardTitle>
              <p className="text-sm text-emerald-100">
                Registros en el sistema
              </p>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-rose-100">Eliminados</CardDescription>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-5xl mb-2">{deletedEntries.length}</CardTitle>
              <p className="text-sm text-rose-100">
                Con observaciones
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs Modernos */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-4 h-auto p-1.5 bg-white shadow-lg rounded-2xl border border-slate-200">
            <TabsTrigger value="summary" className="flex flex-col items-center gap-1.5 py-4 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex flex-col items-center gap-1.5 py-4 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <UserCog className="h-6 w-6" />
              <span className="text-sm">Empleados</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex flex-col items-center gap-1.5 py-4 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <Clock className="h-6 w-6" />
              <span className="text-sm">Registros</span>
            </TabsTrigger>
            <TabsTrigger value="deleted" className="flex flex-col items-center gap-1.5 py-4 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <AlertCircle className="h-6 w-6" />
              <span className="text-sm">Eliminados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 rounded-2xl p-6 mb-6 shadow-xl text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg mb-2">📊 Resumen de Horas Trabajadas</h3>
                  <p className="text-sm text-blue-50 leading-relaxed">
                    Visualiza el progreso semanal y mensual de cada empleado. Las barras de progreso muestran el avance hacia las metas establecidas.
                  </p>
                </div>
              </div>
            </div>
            <HoursSummary timeEntries={timeEntries} />
          </TabsContent>

          <TabsContent value="employees" className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 border-0 rounded-2xl p-6 mb-6 shadow-xl text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserCog className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg mb-2">👥 Gestión de Empleados</h3>
                  <p className="text-sm text-purple-50 leading-relaxed">
                    Registra nuevos empleados, edita su información (área, horarios) y visualiza todos los trabajadores. Usa los filtros para buscar por nombre, área o tipo de empleo.
                  </p>
                </div>
              </div>
            </div>
            <EmployeeManagement
              users={users}
              onAddUser={onAddUser}
              onUpdateUser={onUpdateUser}
              onDeleteUser={onDeleteUser}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 rounded-2xl p-6 mb-6 shadow-xl text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg mb-2">⏰ Todos los Registros de Horarios</h3>
                  <p className="text-sm text-emerald-50 leading-relaxed">
                    Revisa todas las entradas y salidas registradas. Puedes eliminar registros con observaciones si detectas inconsistencias o errores.
                  </p>
                </div>
              </div>
            </div>
            <Card className="shadow-xl border-0">
              <CardContent className="pt-6">
                <TimeEntryTable
                  entries={activeEntries}
                  showUserColumn={true}
                  showActions={true}
                  onDelete={setEntryToDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deleted" className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 border-0 rounded-2xl p-6 mb-6 shadow-xl text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg mb-2">🗑️ Historial de Registros Eliminados</h3>
                  <p className="text-sm text-rose-50 leading-relaxed">
                    Consulta los registros que fueron eliminados, incluyendo la observación del supervisor, fecha y razón de eliminación.
                  </p>
                </div>
              </div>
            </div>
            <Card className="shadow-xl border-0">
              <CardContent className="pt-6">
                <TimeEntryTable
                  entries={deletedEntries}
                  showUserColumn={true}
                  showActions={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Dialog */}
      <DeleteEntryDialog
        entry={entryToDelete}
        onConfirm={(reason) => {
          if (entryToDelete) {
            onDeleteEntry(entryToDelete.id, reason);
            setEntryToDelete(null);
          }
        }}
        onCancel={() => setEntryToDelete(null)}
      />
    </div>
  );
}
