// src/components/layout/AdminTopbar.jsx
import { Button } from "../ui/button";
import useAuthStore from "../../store/useAuthStore";
import { Building2, User, LogOut } from 'lucide-react';

export default function AdminTopbar({ title, subtitle }) {
  const { logout } = useAuthStore();
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo y título */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold shadow-md text-xs sm:text-sm flex-shrink-0">
              <Building2 size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">EISB&M</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{title}</h1>
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <User size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <p className="truncate">{subtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Botón logout */}
          <Button 
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 flex items-center gap-1.5 sm:gap-2 shadow-md text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0" 
            onClick={logout}
          >
            <LogOut size={16} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}