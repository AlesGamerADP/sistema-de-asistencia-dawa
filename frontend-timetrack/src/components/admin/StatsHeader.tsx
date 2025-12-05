'use client';

import { Users, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsHeaderProps {
  loading: boolean;
  stats: {
    employees: number;
    activeLogs: number;
    deletedLogs: number;
  };
}

export default function StatsHeader({ loading, stats }: StatsHeaderProps) {
  const items = [
    {
      label: "Empleados",
      value: stats.employees,
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      label: "Registros Activos",
      value: stats.activeLogs,
      icon: Clock,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      label: "Eliminados",
      value: stats.deletedLogs,
      icon: Trash2,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100"
    },
  ];
  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {items.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              bg-white rounded-2xl p-6 
              border border-gray-100
              shadow-sm hover:shadow-md
              transition-all duration-300
              ${item.bgColor}
              ${item.borderColor}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : item.value}
                </p>
              </div>
              <div className={`
                ${item.bgColor} 
                p-3 rounded-xl
                border ${item.borderColor}
              `}>
                <IconComponent 
                  className={`w-6 h-6 ${item.iconColor}`}
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

