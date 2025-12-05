import { TimeEntry } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Calendar, Clock, TrendingUp, User } from 'lucide-react';

interface HoursSummaryProps {
  timeEntries: TimeEntry[];
}

interface EmployeeHours {
  name: string;
  type: "full-time" | "part-time";
  weeklyHours: number;
  monthlyHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
  weeklyTarget: number;
  monthlyTarget: number;
}

export function HoursSummary({ timeEntries }: HoursSummaryProps) {
  const now = new Date();

  // Calcular inicio de semana (lunes)
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Calcular inicio de mes
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filtrar solo entradas activas
  const activeEntries = timeEntries.filter(e => !e.deleted);

  // Agrupar por empleado
  const employeesMap = new Map<string, EmployeeHours>();

  activeEntries.forEach(entry => {
    const entryDate = new Date(entry.date + 'T00:00:00');

    if (!employeesMap.has(entry.userName)) {
      // 📌 Aquí definimos metas según el tipo de trabajador
      const isFullTime = entry.type === "full-time";
      const weeklyTarget = isFullTime ? 48 : 24;
      const monthlyTarget = isFullTime ? 192 : 96; // 4 semanas aprox

      employeesMap.set(entry.userName, {
        name: entry.userName,
        type: entry.type, // full-time | part-time
        weeklyHours: 0,
        monthlyHours: 0,
        thisWeekHours: 0,
        thisMonthHours: 0,
        weeklyTarget,
        monthlyTarget
      });
    }

    const employee = employeesMap.get(entry.userName)!;

    // Acumular horas totales
    employee.monthlyHours += entry.totalHours;

    // Horas de esta semana
    if (entryDate >= startOfWeek) {
      employee.thisWeekHours += entry.totalHours;
    }

    // Horas de este mes
    if (entryDate >= startOfMonth) {
      employee.thisMonthHours += entry.totalHours;
    }
  });

  const employees = Array.from(employeesMap.values()).sort((a, b) =>
    b.thisMonthHours - a.thisMonthHours
  );

  // Totales globales
  const totalThisWeek = employees.reduce((sum, emp) => sum + emp.thisWeekHours, 0);
  const totalThisMonth = employees.reduce((sum, emp) => sum + emp.thisMonthHours, 0);
  const averageWeekly = totalThisWeek / (employees.length || 1);
  const averageMonthly = totalThisMonth / (employees.length || 1);

  return (
    <div className="space-y-6">
      {/* Lista de Empleados Simplificada */}
      {employees.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-gray-500">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-gray-700 mb-1">Sin Registros</h3>
              <p className="text-sm">No hay registros de horas para mostrar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {employees.map((employee, index) => {
            const weekProgress = Math.min((employee.thisWeekHours / employee.weeklyTarget) * 100, 100);
            const monthProgress = Math.min((employee.thisMonthHours / employee.monthlyTarget) * 100, 100);
            const weekComplete = employee.thisWeekHours >= employee.weeklyTarget;
            const monthComplete = employee.thisMonthHours >= employee.monthlyTarget;

            return (
              <Card key={employee.name} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  {/* Header del Empleado */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                        <span className="text-lg">{employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-0.5">{employee.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="outline" className="h-5 px-2 text-xs">
                            {employee.type === "full-time" ? "Full-time" : "Part-time"}
                          </Badge>
                          <span>• Puesto #{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progreso Semanal y Mensual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Progreso Semanal */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm text-gray-700">Esta Semana</span>
                        </div>
                        {weekComplete && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            ✓ Completado
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-2xl text-gray-900">{employee.thisWeekHours.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">de {employee.weeklyTarget} hrs</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              weekComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                            }`}
                            style={{ width: `${weekProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{weekProgress.toFixed(0)}% completado</p>
                      </div>
                    </div>

                    {/* Progreso Mensual */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Este Mes</span>
                        </div>
                        {monthComplete && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            ✓ Completado
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-2xl text-gray-900">{employee.thisMonthHours.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">de {employee.monthlyTarget} hrs</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              monthComplete ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                            }`}
                            style={{ width: `${monthProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{monthProgress.toFixed(0)}% completado</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
