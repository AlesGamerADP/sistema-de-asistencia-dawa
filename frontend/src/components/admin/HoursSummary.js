// src/components/admin/HoursSummary.js
import ProgressBar from "../ui/ProgressBar";
import { Clock, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HoursSummary({ loading, items = [] }) {
  if (loading) {
    return <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-gray-900 dark:text-gray-100">Cargando resumen…</div>;
  }

  if (!items.length) {
    return <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-gray-900 dark:text-gray-100">Sin datos</div>;
  }

  return (
    <section className="flex flex-col gap-3 sm:gap-4">
      {items.map((emp) => (
        <div key={emp.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
          {/* Header con info del empleado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center font-bold text-base sm:text-lg shadow-md flex-shrink-0">
              {emp.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">{emp.name}</div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="truncate">{emp.contract}</span>
                <span className="hidden xs:inline">•</span>
                <TrendingUp size={12} className="hidden xs:inline sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="hidden xs:inline truncate">#{emp.rank} en horas trabajadas</span>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Meta Semanal</span>
                <span className="xs:hidden">Semanal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                Mensual
              </span>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <Clock size={14} className="sm:w-4 sm:h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                  <span>Esta Semana</span>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold whitespace-nowrap">
                  {emp.weekHours} / {emp.weekTarget} hrs
                </span>
              </div>
              <ProgressBar value={emp.weekHours} total={emp.weekTarget} />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <Calendar size={14} className="sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <span>Este Mes</span>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold whitespace-nowrap">
                  {emp.monthHours} / {emp.monthTarget} hrs
                </span>
              </div>
              <ProgressBar value={emp.monthHours} total={emp.monthTarget} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
