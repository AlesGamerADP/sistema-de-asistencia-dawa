// src/components/admin/StatsHeader.jsx
import { Users, CheckCircle, Trash2 } from 'lucide-react';

export default function StatsHeader({ loading, stats }) {
  const items = [
    { 
      label: "Empleados", 
      value: stats.employees, 
      icon: Users,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-900/20"
    },
    { 
      label: "Registros Activos", 
      value: stats.activeLogs, 
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-400",
      bgLight: "bg-green-50",
      bgDark: "dark:bg-green-900/20"
    },
    { 
      label: "Registros Eliminados", 
      value: stats.deletedLogs, 
      icon: Trash2,
      iconColor: "text-red-600 dark:text-red-400",
      bgLight: "bg-red-50",
      bgDark: "dark:bg-red-900/20"
    },
  ];
  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {items.map(i => {
        const IconComponent = i.icon;
        return (
          <div 
            key={i.label} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 truncate">
                  {i.label}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? "—" : i.value}
                </div>
              </div>
              <div className={`${i.bgLight} ${i.bgDark} p-2.5 sm:p-3 rounded-xl flex-shrink-0`}>
                <IconComponent 
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${i.iconColor}`}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
